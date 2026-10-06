from enum import StrEnum

from pydantic import BaseModel, ConfigDict, EmailStr, Field, HttpUrl


class RecruitingStatus(StrEnum):
    """Stored recruiting state, including athletes the coach has not decided on."""

    UNREVIEWED = "unreviewed"
    INTERESTED = "interested"
    REVIEW_LATER = "review_later"
    PASS = "pass"


class RecruitingDecision(StrEnum):
    """The three decisions a coach can make from Recruit Review."""

    INTERESTED = "interested"
    REVIEW_LATER = "review_later"
    PASS = "pass"


class AthleteCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    graduation_year: int = Field(ge=2020, le=2040)
    primary_position: str
    club_team: str
    gpa: float | None = Field(default=None, ge=0, le=5.0)
    highlight_reel_url: HttpUrl | None = None


class AthleteResponse(AthleteCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    location: str | None = None
    notes: str | None = None
    status: RecruitingStatus = RecruitingStatus.UNREVIEWED


class AthleteStatusUpdate(BaseModel):
    status: RecruitingDecision
