import httpx
from app.core.config import settings
from app.schemas.energy_consumption import PredictionResponse, PredictRequest

ENERGY_CONSUMPTION_API_URL = settings.ENERGY_CONSUMPTION_API_URL


def process_energy_consumption(predictRequest: PredictRequest) -> PredictionResponse:

    response = httpx.post(
        f"{ENERGY_CONSUMPTION_API_URL}/predict",
        json=predictRequest.model_dump(),
        timeout=30,
    )
    response.raise_for_status()
    result = response.json()

    return PredictionResponse(energy_consumption_kwh=result["energy_consumption_kwh"])
