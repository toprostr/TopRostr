import os
import socket
from collections.abc import Iterator
from pathlib import Path

import pytest
from extraction.extractor import ExtractionError
from extraction.openai_suggester import OpenAINoteSuggester
from extraction.suggestions import RecruitingSuggestions
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.db import Base, get_db
from app.main import app
from app.models.athlete import Athlete
from app.suggestions import get_suggester, read_openai_api_key

NOTE = "Interested. Invite to summer camp and ask for updated full-game footage."


@pytest.fixture(autouse=True)
def offline_suggester(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    """Keep this module on the fake suggester even if a developer key is set."""
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.setattr("app.suggestions.ENV_PATH", tmp_path / "missing.env")


@pytest.fixture
def session_factory(tmp_path: Path) -> Iterator[sessionmaker[Session]]:
    engine = create_engine(
        f"sqlite:///{tmp_path / 'suggestions.db'}",
        connect_args={"check_same_thread": False},
    )
    Base.metadata.create_all(engine)
    factory = sessionmaker(bind=engine)

    def override_get_db() -> Iterator[Session]:
        db = factory()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield factory
    app.dependency_overrides.clear()
    engine.dispose()


@pytest.fixture
def client(session_factory: sessionmaker[Session]) -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client


def _add_athlete(factory: sessionmaker[Session], **overrides: object) -> int:
    payload: dict[str, object] = {
        "first_name": "Maya",
        "last_name": "Ellison",
        "email": "maya.ellison@example.com",
        "graduation_year": 2027,
        "primary_position": "GK",
        "club_team": "Harbor City FC",
        "status": "unreviewed",
    }
    payload.update(overrides)
    with factory() as session:
        athlete = Athlete(**payload)
        session.add(athlete)
        session.commit()
        session.refresh(athlete)
        return athlete.id


def _stored(factory: sessionmaker[Session], athlete_id: int) -> Athlete:
    with factory() as session:
        athlete = session.get(Athlete, athlete_id)
        assert athlete is not None
        session.expunge(athlete)
        return athlete


def _strip(html: str) -> str:
    return html.split("data-ai-strip", 1)[1].split("</form>", 1)[0]


def test_suggest_and_confirm_with_the_fake_suggester(
    session_factory: sessionmaker[Session],
    client: TestClient,
) -> None:
    athlete_id = _add_athlete(session_factory, notes="Keep until confirm")
    suggested = client.post(
        f"/athletes/{athlete_id}/suggestions",
        data={"notes": NOTE},
    )

    assert suggested.status_code == 200
    strip = _strip(suggested.text)
    assert 'name="apply_interest" value="interested"' in strip
    assert 'name="engagement" value="Summer camp invitation"' in strip
    assert "Request full-game footage" in strip
    assert "Add to summer camp list" in strip
    assert "Prepare communication draft" in strip
    assert ">Confirm<" in strip

    untouched = _stored(session_factory, athlete_id)
    assert untouched.status == "unreviewed"
    assert untouched.notes == "Keep until confirm"
    assert untouched.engagement is None
    assert untouched.next_action is None

    confirmed = client.post(
        f"/athletes/{athlete_id}/suggestions/confirm",
        data={
            "notes": NOTE,
            "apply_interest": "interested",
            "engagement": "Summer camp invitation",
            "next_actions": [
                "Request full-game footage",
                "Add to summer camp list",
                "Prepare communication draft",
            ],
        },
    )
    assert confirmed.status_code == 200
    assert "Saved to your tracker." in confirmed.text

    stored = _stored(session_factory, athlete_id)
    assert stored.status == "interested"
    assert stored.notes == NOTE
    assert stored.engagement == "Summer camp invitation"
    assert stored.next_action == (
        "Request full-game footage; "
        "Add to summer camp list; "
        "Prepare communication draft"
    )

    tracker = client.get("/tracker")
    assert "Summer camp invitation" in tracker.text
    assert "Request full-game footage" in tracker.text
    assert "Not tracked yet" not in tracker.text
    assert "No action set" not in tracker.text


def test_dismiss_and_unchecked_suggestions_save_nothing(
    session_factory: sessionmaker[Session],
    client: TestClient,
) -> None:
    athlete_id = _add_athlete(session_factory, notes="Original note")
    client.post(f"/athletes/{athlete_id}/suggestions", data={"notes": NOTE})

    dismissed = client.get(f"/athletes/{athlete_id}/card")
    assert dismissed.status_code == 200
    assert "Original note" in dismissed.text
    assert "Summer camp invitation" not in dismissed.text
    stored = _stored(session_factory, athlete_id)
    assert stored.notes == "Original note"
    assert stored.status == "unreviewed"
    assert stored.engagement is None

    confirmed = client.post(
        f"/athletes/{athlete_id}/suggestions/confirm",
        data={"notes": NOTE},
    )
    assert confirmed.status_code == 200
    after = _stored(session_factory, athlete_id)
    assert after.notes == NOTE
    assert after.status == "unreviewed"
    assert after.engagement is None
    assert after.next_action is None
    assert "Summer camp invitation" not in client.get("/tracker?status=all").text


def test_suggestions_do_not_change_status_on_their_own(
    session_factory: sessionmaker[Session],
    client: TestClient,
) -> None:
    athlete_id = _add_athlete(session_factory)
    suggested = client.post(
        f"/athletes/{athlete_id}/suggestions",
        data={"notes": NOTE},
    )
    assert suggested.status_code == 200
    assert _stored(session_factory, athlete_id).status == "unreviewed"

    confirmed = client.post(
        f"/athletes/{athlete_id}/suggestions/confirm",
        data={
            "notes": NOTE,
            "engagement": "Summer camp invitation",
            "next_actions": ["Request full-game footage"],
        },
    )
    assert confirmed.status_code == 200
    stored = _stored(session_factory, athlete_id)
    assert stored.status == "unreviewed"
    assert stored.engagement == "Summer camp invitation"
    assert stored.next_action == "Request full-game footage"


def test_suggestions_do_not_contact_or_send(
    session_factory: sessionmaker[Session],
    client: TestClient,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    def refuse_connection(*args: object, **kwargs: object) -> None:
        raise AssertionError("suggestions must not open a connection")

    monkeypatch.setattr(socket, "create_connection", refuse_connection)
    athlete_id = _add_athlete(session_factory)
    note = "Interested. Email the family tonight and invite her to camp."

    suggested = client.post(
        f"/athletes/{athlete_id}/suggestions",
        data={"notes": note},
    )
    assert suggested.status_code == 200
    strip = _strip(suggested.text).lower()
    assert "emailed" not in strip
    assert "sent" not in strip
    assert "Prepare communication draft" in _strip(suggested.text)

    confirmed = client.post(
        f"/athletes/{athlete_id}/suggestions/confirm",
        data={
            "notes": note,
            "engagement": "Emailed the family",
            "next_actions": ["Prepare communication draft"],
        },
    )
    assert confirmed.status_code == 200
    stored = _stored(session_factory, athlete_id)
    assert stored.engagement is None
    assert stored.next_action == "Prepare communication draft"


def test_suggestions_do_not_score_or_rank(
    session_factory: sessionmaker[Session],
    client: TestClient,
) -> None:
    athlete_id = _add_athlete(session_factory)
    note = "Interested. Rank her 9/10. Talent score 95."
    suggested = client.post(
        f"/athletes/{athlete_id}/suggestions",
        data={"notes": note},
    )

    assert suggested.status_code == 200
    strip = _strip(suggested.text).lower()
    assert "rank" not in strip
    assert "score" not in strip
    assert "9/10" not in strip
    assert "95" not in strip

    client.post(
        f"/athletes/{athlete_id}/suggestions/confirm",
        data={
            "notes": note,
            "engagement": "Ranked #1 in the class",
            "next_actions": ["Score: 95"],
        },
    )
    stored = _stored(session_factory, athlete_id)
    assert stored.engagement is None
    assert stored.next_action is None
    tracker = client.get("/tracker?status=all").text
    assert "Ranked" not in tracker
    assert "Score" not in tracker


def test_suggestion_failure_saves_nothing(
    session_factory: sessionmaker[Session],
    client: TestClient,
    caplog: pytest.LogCaptureFixture,
) -> None:
    class Boom:
        def suggest(self, notes: str) -> RecruitingSuggestions:
            raise ExtractionError("provider echoed UniqueNoteToken")

    app.dependency_overrides[get_suggester] = lambda: Boom()
    athlete_id = _add_athlete(session_factory, notes="Still here")

    with caplog.at_level("WARNING"):
        response = client.post(
            f"/athletes/{athlete_id}/suggestions",
            data={"notes": "UniqueNoteToken " + NOTE},
        )

    assert response.status_code == 200
    # Jinja escapes the apostrophe, so match the words around it.
    assert "read those notes" in response.text
    assert "Nothing was saved." in response.text
    assert "UniqueNoteToken" not in caplog.text
    stored = _stored(session_factory, athlete_id)
    assert stored.notes == "Still here"
    assert stored.status == "unreviewed"
    assert stored.engagement is None
    assert stored.next_action is None


def test_env_file_reads_only_the_openai_key(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    path = tmp_path / ".env"
    path.write_text(
        "DATABASE_URL=sqlite:////tmp/other.db\nOPENAI_API_KEY=sk-test-not-a-real-key\n",
        encoding="utf-8",
    )
    monkeypatch.delenv("DATABASE_URL", raising=False)

    key = read_openai_api_key(path)

    assert key is not None
    assert key.get_secret_value() == "sk-test-not-a-real-key"
    assert os.environ.get("DATABASE_URL") is None
    assert "sk-test-not-a-real-key" not in repr(key)


def test_env_file_key_selects_openai_without_calling_it(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    path = tmp_path / ".env"
    path.write_text("OPENAI_API_KEY=sk-test-not-a-real-key\n", encoding="utf-8")
    monkeypatch.setattr("app.suggestions.ENV_PATH", path)

    def explode(*args: object, **kwargs: object) -> None:
        raise AssertionError("OpenAI client must not be constructed")

    monkeypatch.setattr("extraction.openai_suggester.OpenAI", explode)

    suggester = get_suggester()

    assert isinstance(suggester, OpenAINoteSuggester)


def test_env_example_lists_only_the_openai_key() -> None:
    text = Path(".env.example").read_text(encoding="utf-8")
    assignments = [
        line.strip()
        for line in text.splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]

    assert assignments == ["OPENAI_API_KEY="]
    assert "DATABASE_URL" not in text
