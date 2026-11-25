from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_add_endpoint():
    response = client.get("/add?a=2&b=3")
    assert response.status_code == 200
    assert response.json() == {"result": 5.0}

def test_version():
    response = client.get("/version")
    assert response.status_code == 200
    assert response.json() == {
        "version": "1.1",
        "environment": "demo",
    }

def test_add_missing_parameter():
    response = client.get("/add?a=2")
    assert response.status_code == 422

def test_multiply_endpoint():
    response = client.get("/multiply?a=4&b=5")
    assert response.status_code == 200
    assert response.json() == {"result": 20.0}

def test_subtract_endpoint():
    response = client.get("/subtract?a=10&b=4")
    assert response.status_code == 200
    assert response.json() == {"result": 6.0}


def test_divide_endpoint():
    response = client.get("/divide?a=10&b=2")
    assert response.status_code == 200
    assert response.json() == {"result": 5.0}


def test_divide_by_zero_endpoint():
    response = client.get("/divide?a=10&b=0")
    assert response.status_code == 400


def test_calculator_page():
    response = client.get("/calculator")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    assert "troccamans miniräknare" in response.text