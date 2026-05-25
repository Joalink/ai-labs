import os
import re

from app.services.meeting.audio_processor import (
    extract_audio,
    validate_format,
    validate_size,
)
from app.services.meeting.transcriber import transcribe
from fastapi import APIRouter, BackgroundTasks, HTTPException, UploadFile
from pydantic import BaseModel

router = APIRouter()


class SummarizeRequest(BaseModel):
    transcript: str


def cleanup(*paths):
    for path in paths:
        try:
            if path and os.path.exists(path):
                os.remove(path)
        except Exception:
            pass


@router.post("/meeting/transcribe", status_code=200)
async def transcribe_meeting(file: UploadFile, background_tasks: BackgroundTasks):
    if not validate_format(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Unsupported format. Supported: mp3 wav ogg opus flac aac mp4 m4a mkv",
        )

    file_content = await file.read()

    if not validate_size(len(file_content)):
        raise HTTPException(status_code=413, detail="File exceeds 500MB limit")

    safe_filename = re.sub(r"[^a-zA-Z0-9._-]", "_", file.filename)
    input_path = f"data/{safe_filename}"
    audio_path = f"data/audio_{safe_filename}.wav"

    try:
        os.makedirs("data", exist_ok=True)

        with open(input_path, "wb") as f:
            f.write(file_content)

        extract_audio(input_path, audio_path)
        transcript = transcribe(audio_path)

        background_tasks.add_task(cleanup, input_path, audio_path)

        return {"transcript": transcript}

    except Exception as e:
        cleanup(input_path, audio_path)
        raise HTTPException(status_code=500, detail=str(e))
