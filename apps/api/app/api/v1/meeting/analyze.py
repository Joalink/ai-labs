from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, HTTPException, UploadFile

from app.core.utils import cleanup_paths, create_path
from app.schemas.meeting import MeetingResponse
from app.services.meeting.audio_processor import (
    extract_audio,
    validate_format,
    validate_size,
)
from app.services.meeting.extractor import extract_insights
from app.services.meeting.transcriber import transcribe

router = APIRouter()


@router.post("/meeting/analyze", status_code=200, response_model=MeetingResponse)
async def analyze_meeting(file: UploadFile, background_tasks: BackgroundTasks):

    if not validate_format(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Unsupported format. Supported: mp3 wav ogg opus flac aac mp4 m4a mkv",
        )

    file_content = await file.read()

    if not validate_size(len(file_content)):
        raise HTTPException(status_code=413, detail="File exceeds 500MB limit")

    input_path = ""
    audio_path = ""

    try:
        input_path = create_path(file.filename, file_content)
        audio_path = str(Path(input_path).with_suffix(".wav"))

        extract_audio(input_path, audio_path)
        transcript = transcribe(audio_path)
        insights = extract_insights(transcript["text"])

        background_tasks.add_task(cleanup_paths, input_path, audio_path)

        return {"transcript": transcript, "insights": insights}

    except Exception as e:  # noqa: BLE001
        cleanup_paths(input_path, audio_path)
        raise HTTPException(status_code=500, detail=str(e))
