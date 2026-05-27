export type MeetingResult = {
  transcript: {
    text: string;
    speakers: { speaker: string; text: string; start: number; end: number }[];
    chapters: { title: string; summary: string; start: number; end: number }[];
    highlights: string[];
    language: string;
  };
  insights: {
    summary: string;
    action_items: { owner: string; task: string; deadline: string | null }[];
    decisions: string[];
    topics: string[];
    sentiment: string;
  };
};
