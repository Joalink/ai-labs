from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


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
    model_config = ConfigDict(extra="forbid")

    owner: str
    task: str
    deadline: str | None


class MeetingInsights(BaseModel):
    model_config = ConfigDict(extra="forbid")

    summary: str = Field(min_length=1)
    action_items: list[ActionItem]
    decisions: list[str]
    topics: list[str]
    sentiment: Literal["positive", "neutral", "negative"]


class MeetingResponse(BaseModel):
    transcript: MeetingTranscript
    insights: MeetingInsights
