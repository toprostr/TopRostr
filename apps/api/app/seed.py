"""Load a small fictional roster so Recruit Review is ready to demo.

Run from apps/api:

    uv run python -m app.seed
    uv run python -m app.seed --reset
"""

import argparse
import sys

from sqlalchemy import select
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.athletes import delete_athletes_by_email
from app.db import SessionLocal
from app.models.athlete import Athlete

# Fictional academy players. None of these are real people.
DEMO_ATHLETES: list[dict[str, object]] = [
    {
        "first_name": "Maya",
        "last_name": "Ellison",
        "email": "maya.ellison@example.com",
        "graduation_year": 2027,
        "primary_position": "GK",
        "club_team": "Harbor City FC",
        "location": "San Diego, CA",
        "gpa": 3.8,
        "highlight_reel_url": "https://example.com/film/maya-ellison",
        "notes": "Calm in possession. Want a second look at how she plays out of the back.",
        "status": "unreviewed",
    },
    {
        "first_name": "Jonah",
        "last_name": "Hale",
        "email": "jonah.hale@example.com",
        "graduation_year": 2026,
        "primary_position": "CB",
        "club_team": "Northline Academy",
        "location": "Minneapolis, MN",
        "gpa": 3.4,
        "highlight_reel_url": "https://example.com/film/jonah-hale",
        "notes": None,
        "status": "unreviewed",
    },
    {
        "first_name": "Priya",
        "last_name": "Shah",
        "email": "priya.shah@example.com",
        "graduation_year": 2028,
        "primary_position": "LB",
        "club_team": "Lakeshore United",
        "location": "Chicago, IL",
        "gpa": 3.9,
        "highlight_reel_url": "https://example.com/film/priya-shah",
        "notes": "Overlaps well in the attack. Ask about her spring league schedule.",
        "status": "unreviewed",
    },
    {
        "first_name": "Luis",
        "last_name": "Ortega",
        "email": "luis.ortega@example.com",
        "graduation_year": 2027,
        "primary_position": "RB",
        "club_team": "Rio Vista SC",
        "location": "Austin, TX",
        "gpa": 3.2,
        "highlight_reel_url": "https://example.com/film/luis-ortega",
        "notes": None,
        "status": "unreviewed",
    },
    {
        "first_name": "Elena",
        "last_name": "Voss",
        "email": "elena.voss@example.com",
        "graduation_year": 2026,
        "primary_position": "CM",
        "club_team": "Cedar Ridge Academy",
        "location": "Portland, OR",
        "gpa": 3.7,
        "highlight_reel_url": "https://example.com/film/elena-voss",
        "notes": "Connects lines well. Film is a placeholder reel for the demo.",
        "status": "unreviewed",
    },
    {
        "first_name": "Samir",
        "last_name": "Adeyemi",
        "email": "samir.adeyemi@example.com",
        "graduation_year": 2028,
        "primary_position": "CDM",
        "club_team": "Midlands United",
        "location": "Columbus, OH",
        "gpa": None,
        "highlight_reel_url": None,
        "notes": None,
        "status": "unreviewed",
    },
    {
        "first_name": "Quinn",
        "last_name": "Harper",
        "email": "quinn.harper@example.com",
        "graduation_year": 2027,
        "primary_position": "W",
        "club_team": "Tidewater FC",
        "location": "Virginia Beach, VA",
        "gpa": 3.5,
        "highlight_reel_url": "https://example.com/film/quinn-harper",
        "notes": None,
        "status": "unreviewed",
    },
    {
        "first_name": "Nico",
        "last_name": "Ferreira",
        "email": "nico.ferreira@example.com",
        "graduation_year": 2026,
        "primary_position": "ST",
        "club_team": "Redwood Athletic",
        "location": "San Jose, CA",
        "gpa": 3.1,
        "highlight_reel_url": None,
        "notes": "Holds the ball up and finishes early. No film link on file yet.",
        "status": "unreviewed",
    },
]


def seed_demo_athletes(db: Session, *, reset: bool = False) -> int:
    """Insert demo athletes that are not already stored.

    Re-running leaves existing rows alone, so recruiting decisions survive.
    ``reset=True`` deletes only these demo emails and inserts them again.
    """
    emails = [str(athlete["email"]) for athlete in DEMO_ATHLETES]
    if reset:
        delete_athletes_by_email(db, emails)

    inserted = 0
    for record in DEMO_ATHLETES:
        existing = db.scalar(select(Athlete.id).where(Athlete.email == record["email"]))
        if existing is not None:
            continue
        db.add(Athlete(**record))
        inserted += 1
    db.commit()
    return inserted


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Seed fictional TopRostr demo recruits"
    )
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Replace demo athletes and clear their recruiting decisions",
    )
    args = parser.parse_args()
    db = SessionLocal()
    try:
        inserted = seed_demo_athletes(db, reset=args.reset)
    except OperationalError:
        print(
            "Database is not ready. From apps/api run: uv run alembic upgrade head",
            file=sys.stderr,
        )
        raise SystemExit(1) from None
    finally:
        db.close()

    if args.reset:
        print(f"Reset demo roster and inserted {inserted} athletes.")
    else:
        print(
            f"Inserted {inserted} demo athletes. "
            "Existing demo athletes were left unchanged."
        )


if __name__ == "__main__":
    main()
