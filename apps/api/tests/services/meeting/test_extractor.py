from app.services.meeting.extractor import extract_insights


def test_extractor():

    transcript = {
        "transcript": {
            "text": "This is a sample meeting transcript. We discussed project timelines and assigned tasks.",
            "speakers": [
                {
                    "speaker": "A",
                    "text": "Hello, everyone. Thank you guys for coming to our weekly student success meeting. And let's just get started. So I have our list of chronically absent students here. And I've been noticing a troubling trend. A lot of students are skipping on Fridays. Does anyone have any idea what's going on?",
                    "start": 400,
                    "end": 16640,
                },
            ],
            "language": "en",
        }
    }

    insights = extract_insights(transcript)

    assert isinstance(insights, dict)
