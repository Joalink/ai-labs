import json

from app.core.config import settings
from app.core.shared.llm import client


def extract_insights(transcript_text: str) -> dict:
    prompt = f"""
    Analyze this meeting transcript and extract structured information.
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

    return json.loads(response.choices[0].message.content)
