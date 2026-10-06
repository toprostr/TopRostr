from pathlib import Path


def test_package_source_does_not_send_score_or_read_a_mailbox() -> None:
    root = Path(__file__).resolve().parents[1] / "extraction"
    banned = ("gmail", "smtplib", "send_message", "rank_athlete", "mailbox")
    for path in root.rglob("*.py"):
        text = path.read_text(encoding="utf-8").lower()
        for word in banned:
            assert word not in text, f"{path.name} contains {word}"
