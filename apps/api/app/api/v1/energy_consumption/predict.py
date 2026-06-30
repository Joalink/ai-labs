from app.schemas.energy_consumption import PredictionResponse, PredictRequest
from app.services.energy_consumption.prediction import process_energy_consumption
from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.post("/energy-consumption/predict", response_model=PredictionResponse)
async def predict(predictRequest: PredictRequest) -> PredictionResponse:
    try:
        result = process_energy_consumption(predictRequest)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
