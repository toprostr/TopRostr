from pathlib import Path

from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from app.db import Base
from app.models.athlete import Athlete


def test_athlete_can_be_created_committed_and_retrieved(tmp_path: Path) -> None:
    engine = create_engine(f"sqlite:///{tmp_path / 'isolated.db'}")
    Base.metadata.create_all(engine)
    session_factory = sessionmaker(bind=engine)

    with session_factory() as session:
        session.add(
            Athlete(
                first_name="Maya",
                last_name="Ellison",
                email="maya.ellison@example.com",
                graduation_year=2027,
                primary_position="GK",
                club_team="Harbor City FC",
                location="San Diego, CA",
                status="unreviewed",
            )
        )
        session.commit()

    with session_factory() as session:
        athlete = session.scalar(
            select(Athlete).where(Athlete.email == "maya.ellison@example.com")
        )
        assert athlete is not None
        assert athlete.id is not None
        assert athlete.first_name == "Maya"
        assert athlete.club_team == "Harbor City FC"
        assert athlete.status == "unreviewed"

    engine.dispose()
