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
