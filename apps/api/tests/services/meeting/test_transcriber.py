from app.services.meeting.transcriber import transcribe_meeting


def test_transcriber():
    file_path = "tests/files/sample_meeting.mp3"
    transcript = transcribe_meeting(file_path)

    assert isinstance(transcript, str)
