from collections.abc import Iterator
from pathlib import Path

import pytest
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from alembic import command
from app.athletes import STATUS_LABELS
from app.db import Base, get_db
from app.main import app
from app.models.athlete import Athlete
from app.seed import DEMO_ATHLETES, seed_demo_athletes


@pytest.fixture
def session_factory(tmp_path: Path) -> Iterator[sessionmaker[Session]]:
    engine = create_engine(
        f"sqlite:///{tmp_path / 'api.db'}",
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
    payload = {
        "first_name": "Maya",
        "last_name": "Ellison",
        "email": "maya.ellison@example.com",
        "graduation_year": 2027,
        "primary_position": "GK",
        "club_team": "Harbor City FC",
        "location": "San Diego, CA",
        "status": "unreviewed",
    }
    payload.update(overrides)
    with factory() as session:
        athlete = Athlete(**payload)
        session.add(athlete)
        session.commit()
        session.refresh(athlete)
        return athlete.id


def test_seeded_athletes_load(
    session_factory: sessionmaker[Session], client: TestClient
) -> None:
    with session_factory() as session:
        inserted = seed_demo_athletes(session)
    assert inserted == len(DEMO_ATHLETES) == 8

    response = client.get("/api/v1/athletes")
    assert response.status_code == 200
    athletes = response.json()
    assert len(athletes) == 8
    assert {athlete["status"] for athlete in athletes} == {"unreviewed"}
    assert {athlete["primary_position"] for athlete in athletes} >= {
        "GK",
        "CB",
        "LB",
        "RB",
        "CM",
        "W",
        "ST",
    }

    page = client.get("/")
    assert page.status_code == 200
    assert "Maya Ellison" in page.text
    assert "Recruit review" in page.text
    assert "https://www.youtube-nocookie.com/embed/2zmXjwXyNQA" in page.text
    assert all(
        athlete["highlight_reel_url"] == "https://www.youtube.com/watch?v=2zmXjwXyNQA"
        for athlete in athletes
    )

    tracker_page = client.get("/tracker")
    assert tracker_page.status_code == 200
    assert "No “Interested” recruits yet" in tracker_page.text


def test_recruiting_decisions_persist_and_drive_the_tracker(
    session_factory: sessionmaker[Session],
    client: TestClient,
) -> None:
    interested_id = _add_athlete(
        session_factory, email="interested@example.com", first_name="Elena"
    )
    later_id = _add_athlete(
        session_factory, email="later@example.com", first_name="Jonah", last_name="Hale"
    )
    passed_id = _add_athlete(
        session_factory,
        email="passed@example.com",
        first_name="Luis",
        last_name="Ortega",
    )
    untouched_id = _add_athlete(
        session_factory,
        email="untouched@example.com",
        first_name="Priya",
        last_name="Shah",
    )

    interested = client.patch(
        f"/api/v1/athletes/{interested_id}/status", json={"status": "interested"}
    )
    later = client.patch(
        f"/api/v1/athletes/{later_id}/status", json={"status": "review_later"}
    )
    passed = client.patch(
        f"/api/v1/athletes/{passed_id}/status", json={"status": "pass"}
    )

    assert interested.status_code == 200
    assert interested.json()["status"] == "interested"
    assert later.status_code == 200
    assert later.json()["status"] == "review_later"
    assert passed.status_code == 200
    assert passed.json()["status"] == "pass"

    listed = client.get("/api/v1/athletes").json()
    by_id = {athlete["id"]: athlete["status"] for athlete in listed}
    assert by_id[interested_id] == "interested"
    assert by_id[later_id] == "review_later"
    assert by_id[passed_id] == "pass"
    assert by_id[untouched_id] == "unreviewed"

    tracker = client.get("/api/v1/tracker")
    assert tracker.status_code == 200
    tracker_ids = {athlete["id"] for athlete in tracker.json()}
    assert tracker_ids == {interested_id}

    tracker_page = client.get("/tracker")
    assert "Elena Ellison" in tracker_page.text
    assert "Jonah Hale" not in tracker_page.text
    assert "Luis Ortega" not in tracker_page.text
    assert "Not tracked yet" in tracker_page.text
    assert "No action set" in tracker_page.text


def test_review_page_decision_updates_the_card(
    session_factory: sessionmaker[Session],
    client: TestClient,
) -> None:
    athlete_id = _add_athlete(session_factory)
    response = client.post(
        f"/athletes/{athlete_id}/decision", data={"status": "interested"}
    )
    assert response.status_code == 200
    assert "Saved" in response.text
    assert "Added to your tracker" in response.text

    tracker = client.get("/api/v1/tracker").json()
    assert tracker[0]["id"] == athlete_id


def test_invalid_status_is_rejected(
    session_factory: sessionmaker[Session], client: TestClient
) -> None:
    athlete_id = _add_athlete(session_factory)
    for payload in (
        {"status": "maybe"},
        {"status": "unreviewed"},
        {"status": "passed"},
    ):
        response = client.patch(f"/api/v1/athletes/{athlete_id}/status", json=payload)
        assert response.status_code == 422

    unchanged = client.get("/api/v1/athletes").json()
    assert unchanged[0]["status"] == "unreviewed"


def test_review_later_label_is_sentence_case() -> None:
    assert STATUS_LABELS["review_later"] == "Review later"


def test_decision_post_saves_notes(
    session_factory: sessionmaker[Session], client: TestClient
) -> None:
    athlete_id = _add_athlete(session_factory, notes="Old note")
    response = client.post(
        f"/athletes/{athlete_id}/decision",
        data={"status": "review_later", "notes": "  Calm in possession.  "},
    )
    assert response.status_code == 200
    assert "Calm in possession." in response.text

    stored = client.get("/api/v1/athletes").json()
    assert stored[0]["notes"] == "Calm in possession."
    assert stored[0]["status"] == "review_later"

    cleared = client.post(
        f"/athletes/{athlete_id}/decision",
        data={"status": "pass", "notes": "   "},
    )
    assert cleared.status_code == 200
    assert client.get("/api/v1/athletes").json()[0]["notes"] is None


def test_decision_post_renders_recruit_card(
    session_factory: sessionmaker[Session], client: TestClient
) -> None:
    athlete_id = _add_athlete(session_factory)
    response = client.post(
        f"/athletes/{athlete_id}/decision", data={"status": "interested"}
    )
    assert response.status_code == 200
    assert 'id="recruit-card"' in response.text
    assert 'hx-target="#recruit-card"' in response.text
    assert 'id="athlete-' not in response.text


def test_tracker_lists_all_athletes_and_filters_by_status(
    session_factory: sessionmaker[Session], client: TestClient
) -> None:
    interested_id = _add_athlete(
        session_factory,
        email="filter-interested@example.com",
        first_name="Elena",
        status="interested",
    )
    later_id = _add_athlete(
        session_factory,
        email="filter-later@example.com",
        first_name="Jonah",
        last_name="Hale",
        status="review_later",
    )
    passed_id = _add_athlete(
        session_factory,
        email="filter-pass@example.com",
        first_name="Luis",
        last_name="Ortega",
        status="pass",
    )

    default_page = client.get("/tracker")
    assert "Elena Ellison" in default_page.text
    assert "Jonah Hale" not in default_page.text
    assert "Luis Ortega" not in default_page.text

    everyone = client.get("/tracker?status=all")
    assert "Elena Ellison" in everyone.text
    assert "Jonah Hale" in everyone.text
    assert "Luis Ortega" in everyone.text

    later = client.get("/tracker?status=review_later")
    assert "Jonah Hale" in later.text
    assert "Elena Ellison" not in later.text

    passed = client.get("/tracker?status=pass")
    assert "Luis Ortega" in passed.text
    assert "Elena Ellison" not in passed.text

    unknown = client.get("/tracker?status=maybe")
    assert "Elena Ellison" in unknown.text
    assert "Jonah Hale" not in unknown.text

    listed = {athlete["id"] for athlete in client.get("/api/v1/athletes").json()}
    assert {interested_id, later_id, passed_id} <= listed


def test_missing_athlete_returns_404(client: TestClient) -> None:
    response = client.patch(
        "/api/v1/athletes/999/status", json={"status": "interested"}
    )
    assert response.status_code == 404


def test_migrations_apply_on_an_empty_database(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    database_path = tmp_path / "migrated.db"
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{database_path}")
    config = Config("alembic.ini")
    command.upgrade(config, "head")

    engine = create_engine(f"sqlite:///{database_path}")
    factory = sessionmaker(bind=engine)
    with factory() as session:
        session.add(
            Athlete(
                first_name="Quinn",
                last_name="Harper",
                email="quinn.harper@example.com",
                graduation_year=2027,
                primary_position="W",
                club_team="Tidewater FC",
                location="Virginia Beach, VA",
                notes="Demo note",
                status="interested",
            )
        )
        session.commit()
        stored = session.get(Athlete, 1)
        assert stored is not None
        assert stored.location == "Virginia Beach, VA"
        assert stored.notes == "Demo note"
        assert stored.status == "interested"

    engine.dispose()
