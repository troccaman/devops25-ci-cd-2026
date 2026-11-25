from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.service import add, divide, multiply, subtract

app = FastAPI(title="DevOps CI/CD Demo")


@app.get("/")
def root():
    return {"message": "DevOps CI/CD Demo"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/add")
def add_endpoint(a: float, b: float):
    return {"result": add(a, b)}

@app.get("/divide")
def divide_endpoint(a: float, b: float):
    if b == 0:
        raise HTTPException(
            status_code=400,
            detail="Division med noll är inte tillåten"
        )
    return {"result": divide(a, b)}

@app.get("/version")
def version():
    return {
        "version": "1.1",
        "environment": "demo",
    }

@app.get("/multiply")
def multiply_endpoint(a: float, b: float):
    return {"result": multiply(a, b)}

@app.get("/subtract")
def subtract_endpoint(a: float, b: float):
    return {"result": subtract(a, b)}

STATIC_DIR = Path(__file__).resolve().parent / "static"

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/calculator")
def calculator():
    return FileResponse(STATIC_DIR / "index.html")