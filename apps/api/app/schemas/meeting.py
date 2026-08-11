from pydantic import BaseModel


class SpeakerUtterance(BaseModel):
    speaker: str
    text: str
    start: int
    end: int


class MeetingTranscript(BaseModel):
    text: str
    speakers: list[SpeakerUtterance]
    language: str | None


class ActionItem(BaseModel):
    owner: str
    task: str
    deadline: str | None


class MeetingInsights(BaseModel):
    summary: str
    action_items: list[ActionItem]
    decisions: list[str]
    topics: list[str]
    sentiment: str


class MeetingResponse(BaseModel):
    transcript: MeetingTranscript
    insights: MeetingInsights
