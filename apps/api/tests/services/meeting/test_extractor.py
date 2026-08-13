from unittest.mock import Mock, patch

import pytest

from app.services.meeting.extractor import extract_insights

VALID_INSIGHTS = """{
  "summary": "The team agreed to improve the release process.",
  "action_items": [{"owner": "Mia", "task": "Publish release notes", "deadline": null}],
  "decisions": ["Use weekly releases"],
  "topics": ["release process"],
  "sentiment": "positive"
}"""


def mock_completion(content: str) -> Mock:
    return Mock(choices=[Mock(message=Mock(content=content))])


@patch("app.services.meeting.extractor.client.chat.completions.create")
def test_extractor_returns_validated_insights(mock_create):
    mock_create.return_value = mock_completion(VALID_INSIGHTS)

    insights = extract_insights("The team discussed weekly releases.")

    assert insights.sentiment == "positive"
    assert insights.action_items[0].task == "Publish release notes"


@patch("app.services.meeting.extractor.client.chat.completions.create")
def test_extractor_deduplicates_actions_decisions_and_topics(mock_create):
    mock_create.return_value = mock_completion(
        VALID_INSIGHTS.replace(
            '"Publish release notes", "deadline": null',
            '"Publish  release notes", "deadline": null}, {"owner": "Mia", "task": "publish release notes", "deadline": null',
        )
        .replace(
            '"Use weekly releases"]', '"Use weekly releases", "use weekly releases"]'
        )
        .replace('"release process"]', '"release process", "Release Process"]')
    )

    insights = extract_insights("The team agreed to use weekly releases.")

    assert len(insights.action_items) == 1
    assert insights.decisions == ["Use weekly releases"]
    assert insights.topics == ["release process"]


@patch("app.services.meeting.extractor.client.chat.completions.create")
def test_extractor_rejects_malformed_json(mock_create):
    mock_create.return_value = mock_completion("not json")

    with pytest.raises(ValueError, match="invalid JSON"):
        extract_insights("The team discussed weekly releases.")


@patch("app.services.meeting.extractor.client.chat.completions.create")
def test_extractor_rejects_invalid_insight_schema(mock_create):
    mock_create.return_value = mock_completion('{"summary": "Missing fields"}')

    with pytest.raises(ValueError):
        extract_insights("The team discussed weekly releases.")
