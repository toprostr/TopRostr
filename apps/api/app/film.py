import re
from urllib.parse import parse_qs, urlparse

_VIDEO_ID = re.compile(r"^[A-Za-z0-9_-]{11}$")
_YOUTUBE_HOSTS = {"youtube.com", "m.youtube.com", "youtube-nocookie.com"}


def youtube_embed_url(film_url: str | None) -> str | None:
    """Turn a YouTube watch or share URL into a nocookie embed URL.

    Returns None when film_url is missing or is not a YouTube link, so the
    card can keep the plain "Film not available" placeholder.
    """
    if film_url is None:
        return None
    parsed = urlparse(str(film_url).strip())
    if parsed.scheme not in {"http", "https"}:
        return None

    host = parsed.netloc.lower().removeprefix("www.")
    video_id: str | None = None
    if host in _YOUTUBE_HOSTS:
        if parsed.path == "/watch":
            video_ids = parse_qs(parsed.query).get("v", [])
            video_id = video_ids[0] if video_ids else None
        else:
            parts = [part for part in parsed.path.split("/") if part]
            if len(parts) >= 2 and parts[0] in {"embed", "shorts", "live"}:
                video_id = parts[1]
    elif host == "youtu.be":
        parts = [part for part in parsed.path.split("/") if part]
        video_id = parts[0] if parts else None

    if video_id is None or _VIDEO_ID.fullmatch(video_id) is None:
        return None
    return f"https://www.youtube-nocookie.com/embed/{video_id}"
