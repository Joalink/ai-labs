import json

from app.core.config import settings
from app.core.shared.llm import client
from app.schemas.meeting import MeetingInsights


def deduplicate(values: list[str]) -> list[str]:
    seen = set()
    unique = []
    for value in values:
        normalized = " ".join(value.split())
        key = normalized.casefold()
        if normalized and key not in seen:
            seen.add(key)
            unique.append(normalized)
    return unique


def extract_insights(transcript_text: str) -> MeetingInsights:
    prompt = f"""
    Analyze this meeting transcript and extract structured information.
    Only include decisions, tasks and topics explicitly supported by the transcript.
    Do not infer owners or deadlines; use "unknown" or null when absent.
    Return only valid JSON with these exact keys:
    {{
        "summary": "3-5 sentence summary",
        "action_items": [
            {{"owner": "person or unknown", "task": "what to do", "deadline": "when or null"}}
        ],
        "decisions": ["decision 1", "decision 2"],
        "topics": ["topic 1", "topic 2"],
        "sentiment": "positive | neutral | negative"
    }}
        Transcript:
    {transcript_text}
    """

    response = client.chat.completions.create(
        model=settings.LLM_MODEL,
        max_tokens=settings.MAX_TOKENS,
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": prompt}],
    )

    try:
        content = json.loads(response.choices[0].message.content)
    except json.JSONDecodeError as error:
        raise ValueError("Meeting insight provider returned invalid JSON") from error

    insights = MeetingInsights.model_validate(content)
    action_items = []
    seen_tasks = set()
    for item in insights.action_items:
        task = " ".join(item.task.split())
        if task and task.casefold() not in seen_tasks:
            seen_tasks.add(task.casefold())
            action_items.append(item.model_copy(update={"task": task}))

    return insights.model_copy(
        update={
            "action_items": action_items,
            "decisions": deduplicate(insights.decisions),
            "topics": deduplicate(insights.topics),
        }
    )
