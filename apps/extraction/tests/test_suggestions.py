import logging

import pytest
from openai import OpenAIError
from pydantic import SecretStr

from extraction.extractor import ExtractionError
from extraction.factory import build_suggester
from extraction.openai_suggester import OpenAINoteSuggester
from extraction.prompt import SUGGESTION_SYSTEM_PROMPT
from extraction.settings import ExtractionSettings
from extraction.suggestions import (
    FakeNoteSuggester,
    RecruitingSuggestions,
    SuggestedInterest,
)

_PRD_NOTE = "Interested. Invite to summer camp and ask for updated full-game footage."


def test_fake_suggester_reads_the_prd_example() -> None:
    result = FakeNoteSuggester().suggest(_PRD_NOTE)

    assert result.interest == "interested"
    assert result.engagement == "Summer camp invitation"
    assert result.next_actions == [
        "Request full-game footage",
        "Add to summer camp list",
        "Prepare communication draft",
    ]


def test_fake_suggester_leaves_an_empty_note_empty() -> None:
    assert FakeNoteSuggester().suggest("   ") == RecruitingSuggestions()


def test_fake_suggester_does_not_score_or_rank(
    caplog: pytest.LogCaptureFixture,
) -> None:
    note = "Rank her 9/10. Talent score 95. She is the top goalkeeper."

    with caplog.at_level(logging.DEBUG):
        result = FakeNoteSuggester().suggest(note)

    assert result.interest is None
    assert result.engagement is None
    assert result.next_actions == []
    dumped = " ".join(
        str(part)
        for part in (
            result.interest,
            result.engagement,
            " ".join(result.next_actions),
        )
    ).lower()
    assert "rank" not in dumped
    assert "score" not in dumped
    assert "9/10" not in dumped
    assert note not in caplog.text
    assert "95" not in caplog.text


def test_suggestions_drop_scores_ranks_and_completed_contact() -> None:
    result = RecruitingSuggestions.model_validate(
        {
            "interest": "interested",
            "engagement": "Ranked #1 in the class",
            "next_actions": [
                "Score: 95",
                "Emailed the family",
                "Request full-game footage",
            ],
            "talent_score": 99,
            "contact_athlete": True,
        }
    )

    assert result.interest == "interested"
    assert result.engagement is None
    assert result.next_actions == ["Request full-game footage"]
    assert "talent_score" not in result.model_dump()
    assert "contact_athlete" not in result.model_dump()


def test_invalid_interest_becomes_null() -> None:
    result = RecruitingSuggestions(interest="maybe")  # type: ignore[arg-type]

    assert result.interest is None


def test_missing_key_selects_the_fake_suggester(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    suggester = build_suggester()

    assert isinstance(suggester, FakeNoteSuggester)
    assert suggester.suggest(_PRD_NOTE).interest == "interested"


def test_key_selects_openai_suggester_without_calling_it(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test-not-a-real-key")

    def explode(*args: object, **kwargs: object) -> None:
        raise AssertionError("OpenAI client must not be constructed")

    monkeypatch.setattr("extraction.openai_suggester.OpenAI", explode)

    suggester = build_suggester()

    assert isinstance(suggester, OpenAINoteSuggester)
    assert suggester.model == "gpt-4o-mini"


class _Response:
    def __init__(self, parsed: object) -> None:
        self.output_parsed = parsed


def test_openai_suggester_binds_the_model_and_forbids_scoring(
    caplog: pytest.LogCaptureFixture,
) -> None:
    calls: list[dict[str, object]] = []
    note = "Interested. UniqueNoteToken invite to camp."

    def parse(**kwargs: object) -> _Response:
        calls.append(kwargs)
        return _Response(
            RecruitingSuggestions(
                interest=SuggestedInterest.INTERESTED,
                engagement="Summer camp invitation",
            )
        )

    suggester = OpenAINoteSuggester(
        api_key=SecretStr("sk-test-not-a-real-key"),
        model="gpt-4o-mini",
        parse=parse,
    )

    with caplog.at_level(logging.DEBUG):
        result = suggester.suggest(note)

    assert result.interest == "interested"
    assert result.engagement == "Summer camp invitation"
    assert calls[0]["text_format"] is RecruitingSuggestions
    assert calls[0]["store"] is False
    assert "Do not score, rank" in SUGGESTION_SYSTEM_PROMPT
    assert "Do not contact anyone" in SUGGESTION_SYSTEM_PROMPT
    messages = calls[0]["input"]
    assert isinstance(messages, list)
    assert messages[0]["content"] == SUGGESTION_SYSTEM_PROMPT
    assert "UniqueNoteToken" in str(messages[1]["content"])
    assert "UniqueNoteToken" not in caplog.text
    assert "sk-test-not-a-real-key" not in caplog.text
    assert "Summer camp invitation" not in caplog.text


def test_provider_timeout_does_not_include_the_note(
    caplog: pytest.LogCaptureFixture,
) -> None:
    def fail(**kwargs: object) -> _Response:
        raise OpenAIError("timed out UniqueNoteToken sk-test-not-a-real-key")

    suggester = OpenAINoteSuggester(
        api_key=SecretStr("sk-test-not-a-real-key"),
        model="gpt-4o-mini",
        parse=fail,
    )

    with caplog.at_level(logging.DEBUG), pytest.raises(ExtractionError) as caught:
        suggester.suggest("UniqueNoteToken")

    assert "UniqueNoteToken" not in str(caught.value)
    assert "sk-test-not-a-real-key" not in str(caught.value)
    assert "UniqueNoteToken" not in caplog.text
    assert caught.value.__cause__ is None


def test_explicit_empty_settings_stay_on_the_fake() -> None:
    result = build_suggester(ExtractionSettings(openai_api_key=None)).suggest("hi")

    assert result == RecruitingSuggestions()


def test_fake_suggester_reads_pass_review_later_visit_and_call() -> None:
    passed = FakeNoteSuggester().suggest("Not a fit for the roster.")
    later = FakeNoteSuggester().suggest("Circle back and schedule a campus visit.")
    call = FakeNoteSuggester().suggest("Set up an intro phone call.")

    assert passed.interest == SuggestedInterest.PASS
    assert passed.engagement is None
    assert later.interest == SuggestedInterest.REVIEW_LATER
    assert later.engagement == "Campus visit"
    assert call.interest is None
    assert call.engagement == "Intro call"


def test_missing_parsed_output_is_a_suggestion_error() -> None:
    suggester = OpenAINoteSuggester(
        api_key=SecretStr("sk-test-not-a-real-key"),
        model="gpt-4o-mini",
        parse=lambda **kwargs: _Response(None),
    )

    with pytest.raises(ExtractionError, match="did not return"):
        suggester.suggest("Interested.")


def test_model_dict_drops_a_ranking_before_it_can_be_stored() -> None:
    suggester = OpenAINoteSuggester(
        api_key=SecretStr("sk-test-not-a-real-key"),
        model="gpt-4o-mini",
        parse=lambda **kwargs: _Response(
            {
                "interest": "interested",
                "engagement": "Ranked #1 in the class",
                "next_actions": ["Emailed the family", "Request full-game footage"],
            }
        ),
    )

    result = suggester.suggest("Interested. UniqueNoteToken")

    assert result.interest == SuggestedInterest.INTERESTED
    assert result.engagement is None
    assert result.next_actions == ["Request full-game footage"]


def test_blank_suggester_api_key_is_rejected() -> None:
    with pytest.raises(ValueError, match="OPENAI_API_KEY"):
        OpenAINoteSuggester(api_key=SecretStr("   "), model="gpt-4o-mini")


@pytest.mark.skip(
    reason=(
        "BUG: ordinary soccer language is read as a Pass decision. "
        "FakeNoteSuggester treats any '\\bpass\\b' as Pass, and that check "
        "runs before review-later phrases, so a note such as 'can pass out of "
        "the back' plus 'second look' suggests Pass."
    )
)
def test_passing_the_ball_is_not_a_pass_decision() -> None:
    result = FakeNoteSuggester().suggest(
        "Can pass out of the back. Want a second look in the spring."
    )

    assert result.interest != SuggestedInterest.PASS
    assert result.interest == SuggestedInterest.REVIEW_LATER


@pytest.mark.skip(
    reason=(
        "BUG: a negated offer is read as interest. "
        "FakeNoteSuggester treats '\\boffer\\b' as Interested, so "
        "'Do not offer yet' suggests marking the athlete interested."
    )
)
def test_do_not_offer_is_not_interest() -> None:
    result = FakeNoteSuggester().suggest("Do not offer yet.")

    assert result.interest is None


@pytest.mark.skip(
    reason=(
        "BUG: the word 'highlight' is treated as a film request. "
        "FakeNoteSuggester suggests 'Request full-game footage' for a note "
        "that only says to highlight part of the athlete's play."
    )
)
def test_highlight_her_play_is_not_a_footage_request() -> None:
    result = FakeNoteSuggester().suggest("Highlight her composure in the air.")

    assert result.next_actions == []
