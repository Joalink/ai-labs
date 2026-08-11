from unittest.mock import Mock, patch

from app.services.meeting.transcriber import transcribe


@patch("app.services.meeting.transcriber.speech_model.Transcriber")
def test_transcriber(mock_transcriber):
    transcript_response = Mock(
        status="completed",
        text="Hello team",
        utterances=[],
        language_code="en",
    )
    mock_transcriber.return_value.transcribe.return_value = transcript_response

    assert transcribe("meeting.wav") == {
        "text": "Hello team",
        "speakers": [],
        "language": "en",
    }
