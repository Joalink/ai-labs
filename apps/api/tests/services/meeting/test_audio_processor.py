from app.services.meeting.audio_processor import (
    MAX_FILE_SIZE,
    validate_format,
    validate_size,
)


def test_audio_validation():
    assert validate_format("meeting.mp3")
    assert not validate_format("meeting.pdf")
    assert validate_size(MAX_FILE_SIZE)
    assert not validate_size(MAX_FILE_SIZE + 1)
