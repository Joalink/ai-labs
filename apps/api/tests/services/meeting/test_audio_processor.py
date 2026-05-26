from app.services.meeting.audio_processor import process_audio


def test_audio_processor():
    audio_path = "tests/files/sample_meeting.mp3"
    processed_audio = process_audio(audio_path)

    assert isinstance(processed_audio, bytes)
