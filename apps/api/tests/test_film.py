from collections.abc import Iterator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker

from app.db import Base, get_db
from app.film import youtube_embed_url
from app.main import app
from app.models.athlete import Athlete
from app.seed import DEMO_FILM_URL, seed_demo_athletes

EMBED = "https://www.youtube-nocookie.com/embed/2zmXjwXyNQA"


def test_youtube_embed_url_accepts_common_youtube_links() -> None:
    assert youtube_embed_url("https://www.youtube.com/watch?v=2zmXjwXyNQA") == EMBED
    assert youtube_embed_url("https://youtu.be/2zmXjwXyNQA") == EMBED
    assert youtube_embed_url("https://www.youtube.com/embed/2zmXjwXyNQA") == EMBED
    assert (
        youtube_embed_url("https://www.youtube-nocookie.com/embed/2zmXjwXyNQA") == EMBED
    )


def test_youtube_embed_url_rejects_missing_and_non_youtube_links() -> None:
    assert youtube_embed_url(None) is None
    assert youtube_embed_url("") is None
    assert youtube_embed_url("https://example.com/film/maya-ellison") is None
    assert youtube_embed_url("https://www.youtube.com/watch?v=not-an-id") is None
    assert youtube_embed_url("https://www.youtube.com/channel/UC1234567890") is None
    assert youtube_embed_url("https://www.youtube.com/shorts/2zmXjwXyNQA") == EMBED
    assert youtube_embed_url("https://m.youtube.com/live/2zmXjwXyNQA") == EMBED


@pytest.fixture
def client(tmp_path: Path) -> Iterator[TestClient]:
    engine = create_engine(
        f"sqlite:///{tmp_path / 'film.db'}",
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
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    engine.dispose()


def test_review_card_embeds_youtube_and_uses_placeholder_otherwise(
    client: TestClient,
) -> None:
    session_generator = app.dependency_overrides[get_db]()
    db = next(session_generator)
    try:
        db.add_all(
            [
                Athlete(
                    first_name="Maya",
                    last_name="Ellison",
                    email="maya.ellison@example.com",
                    graduation_year=2027,
                    primary_position="GK",
                    club_team="Harbor City FC",
                    highlight_reel_url=DEMO_FILM_URL,
                    status="unreviewed",
                ),
                Athlete(
                    first_name="Jonah",
                    last_name="Hale",
                    email="jonah.hale@example.com",
                    graduation_year=2026,
                    primary_position="CB",
                    club_team="Northline Academy",
                    highlight_reel_url="https://example.com/film/jonah-hale",
                    status="unreviewed",
                ),
                Athlete(
                    first_name="Luis",
                    last_name="Ortega",
                    email="luis.ortega@example.com",
                    graduation_year=2027,
                    primary_position="RB",
                    club_team="Rio Vista SC",
                    highlight_reel_url=None,
                    status="unreviewed",
                ),
            ]
        )
        db.commit()
    finally:
        session_generator.close()

    # Recruit review shows one unreviewed athlete at a time. Decide on the
    # current card, then load `/` again to reach the next film state.
    maya = client.get("/").text
    assert f'data-src="{EMBED}"' in maya
    assert "YouTube · plays inline" in maya
    assert "Film hosted externally" not in maya
    assert "No film yet" not in maya

    maya_id = 1
    decided = client.post(f"/athletes/{maya_id}/decision", data={"status": "pass"})
    assert decided.status_code == 200

    jonah = client.get("/").text
    assert "Film hosted externally" in jonah
    assert 'href="https://example.com/film/jonah-hale"' in jonah
    assert "youtube-nocookie.com/embed" not in jonah
    assert "<iframe" not in jonah

    decided = client.post("/athletes/2/decision", data={"status": "pass"})
    assert decided.status_code == 200

    luis = client.get("/").text
    assert "No film yet" in luis
    assert "youtube-nocookie.com/embed" not in luis
    assert "example.com/film" not in luis


def test_reset_stores_the_demo_film_url(tmp_path: Path) -> None:
    engine = create_engine(f"sqlite:///{tmp_path / 'reset.db'}")
    Base.metadata.create_all(engine)
    factory = sessionmaker(bind=engine)
    with factory() as session:
        session.add(
            Athlete(
                first_name="Maya",
                last_name="Ellison",
                email="maya.ellison@example.com",
                graduation_year=2027,
                primary_position="GK",
                club_team="Harbor City FC",
                highlight_reel_url="https://example.com/old",
                status="interested",
            )
        )
        session.commit()
        inserted = seed_demo_athletes(session, reset=True)
        maya = session.scalar(
            select(Athlete).where(Athlete.email == "maya.ellison@example.com")
        )
        assert inserted == 8
        assert maya is not None
        assert maya.highlight_reel_url == DEMO_FILM_URL
        assert maya.status == "unreviewed"

    engine.dispose()
