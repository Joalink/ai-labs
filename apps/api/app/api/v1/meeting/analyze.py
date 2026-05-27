from app.core.utils import clean_filename, cleanup_paths, create_path
from app.services.meeting.audio_processor import (
    extract_audio,
    validate_format,
    validate_size,
)
from app.services.meeting.extractor import extract_insights
from app.services.meeting.transcriber import transcribe
from fastapi import APIRouter, BackgroundTasks, HTTPException, UploadFile

router = APIRouter()


@router.post("/meeting/analyze", status_code=200)
async def analyze_meeting(file: UploadFile, background_tasks: BackgroundTasks):

    if not validate_format(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Unsupported format. Supported: mp3 wav ogg opus flac aac mp4 m4a mkv",
        )

    file_content = await file.read()

    if not validate_size(len(file_content)):
        raise HTTPException(status_code=413, detail="File exceeds 500MB limit")

    safe_filename = clean_filename(file.filename)
    input_path = f"data/{safe_filename}"
    audio_path = f"data/audio_{safe_filename}.wav"

    try:
        create_path(input_path, file_content)

        extract_audio(input_path, audio_path)
        transcript = transcribe(audio_path)
        insights = extract_insights(transcript["text"])

        background_tasks.add_task(cleanup_paths, input_path, audio_path)

        return {"transcript": transcript, "insights": insights}

    except Exception as e:
        cleanup_paths(input_path, audio_path)
        raise HTTPException(status_code=500, detail=str(e))
