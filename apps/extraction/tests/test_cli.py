import json
from io import StringIO

import pytest

from extraction.__main__ import main


def test_cli_uses_the_fake_when_no_key_is_set(
    monkeypatch: pytest.MonkeyPatch,
    capsys: pytest.CaptureFixture[str],
) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.setattr(
        "sys.stdin",
        StringIO(
            json.dumps(
                {
                    "subject": "2028 GK - John Smith",
                    "sender": "john@example.com",
                    "body": "Coach, my name is John Smith. I am a 2028 goalkeeper playing for XYZ Academy...",
                }
            )
        ),
    )

    main()

    payload = json.loads(capsys.readouterr().out)
    assert payload["name"] == "John Smith"
    assert payload["graduation_year"] == 2028
    assert payload["film_url"] is None
    assert payload["academic_info"] is None


def test_cli_does_not_echo_invalid_input(
    monkeypatch: pytest.MonkeyPatch,
    capsys: pytest.CaptureFixture[str],
) -> None:
    monkeypatch.setattr("sys.stdin", StringIO('{"body": "UniqueBodyTokenXYZ"}'))

    with pytest.raises(SystemExit) as caught:
        main()

    captured = capsys.readouterr()
    assert caught.value.code == 1
    assert captured.err.strip() == "Invalid extraction input."
    assert "UniqueBodyTokenXYZ" not in captured.err
    assert captured.out == ""
