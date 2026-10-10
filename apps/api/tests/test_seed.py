import sys
from pathlib import Path

import pytest
from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import Session, sessionmaker

from app.db import Base
from app.models.athlete import Athlete
from app.seed import DEMO_ATHLETES, main, seed_demo_athletes


def _factory(tmp_path: Path) -> sessionmaker[Session]:
    engine = create_engine(f"sqlite:///{tmp_path / 'seed.db'}")
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine)


def _close(factory: sessionmaker[Session]) -> None:
    engine = factory.kw["bind"]
    engine.dispose()


def test_seeding_again_leaves_recruiting_decisions_in_place(tmp_path: Path) -> None:
    factory = _factory(tmp_path)
    with factory() as session:
        assert seed_demo_athletes(session) == len(DEMO_ATHLETES)

        maya = session.scalar(
            select(Athlete).where(Athlete.email == "maya.ellison@example.com")
        )
        assert maya is not None
        maya.status = "interested"
        maya.notes = "Keep this decision"
        session.commit()

        assert seed_demo_athletes(session) == 0
        maya = session.scalar(
            select(Athlete).where(Athlete.email == "maya.ellison@example.com")
        )
        assert maya is not None
        assert maya.status == "interested"
        assert maya.notes == "Keep this decision"
        assert session.scalar(select(func.count()).select_from(Athlete)) == len(
            DEMO_ATHLETES
        )
    _close(factory)


def test_seed_cli_reports_inserts_and_resets(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]
) -> None:
    factory = _factory(tmp_path)
    monkeypatch.setattr("app.seed.SessionLocal", factory)
    monkeypatch.setattr(sys, "argv", ["app.seed"])

    main()
    assert f"Inserted {len(DEMO_ATHLETES)} demo athletes" in capsys.readouterr().out

    with factory() as session:
        maya = session.scalar(
            select(Athlete).where(Athlete.email == "maya.ellison@example.com")
        )
        assert maya is not None
        maya.status = "pass"
        session.commit()

    main()
    assert "Inserted 0 demo athletes" in capsys.readouterr().out

    monkeypatch.setattr(sys, "argv", ["app.seed", "--reset"])
    main()
    assert "Reset demo roster" in capsys.readouterr().out

    with factory() as session:
        maya = session.scalar(
            select(Athlete).where(Athlete.email == "maya.ellison@example.com")
        )
        assert maya is not None
        assert maya.status == "unreviewed"
        assert maya.highlight_reel_url is not None
    _close(factory)


def test_seed_cli_exits_when_the_database_has_no_tables(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]
) -> None:
    engine = create_engine(f"sqlite:///{tmp_path / 'empty.db'}")
    monkeypatch.setattr("app.seed.SessionLocal", sessionmaker(bind=engine))
    monkeypatch.setattr(sys, "argv", ["app.seed"])

    with pytest.raises(SystemExit) as caught:
        main()

    assert caught.value.code == 1
    assert "alembic upgrade head" in capsys.readouterr().err
    engine.dispose()
