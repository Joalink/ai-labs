# from app.core.shared.lsm import client_speech

import assemblyai as speech_model
from app.core.config import settings

speech_model.settings.api_key = settings.ASSEMBLYAI_API_KEY


def transcribe(file_path: str) -> dict:

    config = speech_model.TranscriptionConfig(
        speaker_labels=True,  # diarization
        auto_chapters=True,  # automatic chapter detection
        sentiment_analysis=True,
        auto_highlights=True,  # key phrases
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
                "speaker": utterances.speaker,
                "text": utterances.text,
                "start": utterances.start,
                "end": utterances.end,
            }
            for utterances in transcript.utterances or []
        ],
        "chapters": [
            {
                "title": chapter.headline,
                "summary": chapter.summary,
                "start": chapter.start,
                "end": chapter.end,
            }
            for chapter in transcript.chapters or []
        ],
        "highlights": [h.text for h in transcript.auto_highlights.results or []],
        "sentiment": transcript.sentiment_analysis,
        "language": transcript.language_code,
    }
