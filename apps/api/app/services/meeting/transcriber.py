import assemblyai as speech_model
from app.core.config import settings

speech_model.settings.api_key = settings.ASSEMBLYAI_API_KEY


def transcribe(file_path: str) -> dict:

    config = speech_model.TranscriptionConfig(
        speaker_labels=True,
        language_detection=True,
    )

    transcriber = speech_model.Transcriber()
    transcript = transcriber.transcribe(file_path, config=config)

    if transcript.status == speech_model.TranscriptStatus.error:
        raise Exception(f"Transcription failed: {transcript.error}")

    return {
        "text": transcript.text,
        "speakers": [
            {
                "speaker": u.speaker,
                "text": u.text,
                "start": u.start,
                "end": u.end,
            }
            for u in transcript.utterances or []
        ],
        "language": transcript.language_code,
    }
