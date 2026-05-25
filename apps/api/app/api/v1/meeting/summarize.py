from app.services.meeting.extractor import extract_insights
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class SummarizeRequest(BaseModel):
    transcript: str


@router.post("/meeting/summarize", status_code=200)
async def summarize_meeting(body: SummarizeRequest):
    try:
        insights = extract_insights(body.transcript)
        return {"insights": insights}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
