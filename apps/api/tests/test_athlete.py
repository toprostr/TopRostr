import pytest
from pydantic import ValidationError

from app.schemas.athlete import AthleteCreate, AthleteResponse, RecruitingStatus


def test_athletecreate_with_valid_succeeds():
    athlete = AthleteCreate(
        first_name="Alejandro",
        last_name="Suarez",
        email="alesuarez@gmail.com",
        graduation_year=2021,
        primary_position="CB",
        club_team="NYCFC",
    )

    assert athlete.email == "alesuarez@gmail.com"
    assert athlete.gpa is None
    assert athlete.highlight_reel_url is None


def test_athletecreate_with_invalid_email_fails():
    with pytest.raises(ValidationError):
        AthleteCreate(
            first_name="Alejandro",
            last_name="Suarez",
            email="alesuarezgmail.com",
            graduation_year=2021,
            primary_position="CB",
            club_team="NYCFC",
        )


def test_athletecreate_with_invlaid_gpa_fails():
    with pytest.raises(ValidationError):
        AthleteCreate(
            first_name="Alejandro",
            last_name="Suarez",
            email="alesuarezgmail.com",
            graduation_year=2021,
            primary_position="CB",
            club_team="NYCFC",
            gpa=-2.0,
        )


def test_athletecreate_with_invalid_grad_year_fails():
    with pytest.raises(ValidationError):
        AthleteCreate(
            first_name="Alejandro",
            last_name="Suarez",
            email="alesuarezgmail.com",
            graduation_year=2060,
            primary_position="CB",
            club_team="NYCFC",
            gpa=-2.0,
        )


def test_create_athlete_response_defaults_to_unreviewed_status():
    athlete = AthleteResponse(
        id=1,
        first_name="Jordan",
        last_name="Smith",
        email="jordan@example.com",
        graduation_year=2027,
        primary_position="CM",
        club_team="Example FC",
    )

    assert athlete.status == RecruitingStatus.UNREVIEWED
    assert athlete.location is None
    assert athlete.notes is None
