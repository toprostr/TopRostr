"""Instructions sent with a live extraction request.

The fake extractor does not use this text. It encodes the same rule in code:
copy only what the email states, and leave everything else null.
"""

from __future__ import annotations

from extraction.schemas import ExtractionInput

SYSTEM_PROMPT = """You extract structured facts from one college soccer recruiting email.

Rules:
- Use only the subject, sender, and body. Do not guess or fill gaps from a typical recruiting email.
- If a fact is missing, unclear, or would require choosing among several possibilities, return null.
- Never invent a name, email address, graduation year, position, club, academic record, or film link.
- Do not score, rank, recommend, or evaluate the athlete.
- Do not draft a reply and do not contact anyone. Extraction is the only task.
- graduation_year is the four-digit graduation year only when the email states it. Otherwise null.
- email is an address written in the email. Use the sender only when the sender is clearly the athlete. Otherwise null.
- film_url is a list of highlight or film links written in the email, or null when there are none.
- academic_info is academic information copied from the email, or null when none is stated.
"""


def render_user_message(message: ExtractionInput) -> str:
    """Show the three input fields without adding facts."""

    return (
        "Extract recruiting facts from the email below.\n\n"
        f"Subject: {message.subject}\n"
        f"Sender: {message.sender}\n"
        "Body:\n"
        f"{message.body}"
    )


SUGGESTION_SYSTEM_PROMPT = """You interpret one coach's note about an athlete already on their board.

Return interest, engagement, and next_actions. These are suggestions the coach will confirm. You do not apply them.

Rules:
- Use only the note. If a decision or task is missing, leave that field null or empty.
- interest is interested, review_later, or pass only when the note states that decision. Otherwise null.
- engagement is one short label for a recruiting interaction to record, such as a camp invitation. Otherwise null.
- next_actions is a list of short task labels, or an empty list.
- Do not contact anyone. Do not produce a message. A label is a task for the coach, not an action you take.
- Do not score, rank, or evaluate talent.
- Do not invent a task the note does not support.
- Keep each label under 80 characters.
"""


def render_note(notes: str) -> str:
    """Show the coach's note without adding facts."""

    return f"Interpret the coach's note below.\n\n{notes}"
