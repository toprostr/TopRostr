from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.routers.athletes import router as athletes_router
from app.routers.pages import router as pages_router

app = FastAPI(title="TopRostr")
app.include_router(pages_router)
app.include_router(athletes_router)
app.mount(
    "/static",
    StaticFiles(directory=Path(__file__).resolve().parents[1] / "static"),
    name="static",
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
