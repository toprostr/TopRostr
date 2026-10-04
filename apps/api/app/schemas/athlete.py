from enum import StrEnum

from pydantic import BaseModel, EmailStr, Field, HttpUrl


class RecruitingStatus(StrEnum):
    NEW = "new"
    REVIEWING = "reviewing"
    INTERESTED = "interested"
    PASSED = "passed"

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
    id: int
    status: RecruitingStatus = RecruitingStatus.NEW