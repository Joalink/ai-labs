import {
  SmileyIcon,
  SmileyMehIcon,
  SmileySadIcon,
} from "@phosphor-icons/react";

export default function SentimentSelection({
  sentiment,
  setSentiment,
}: {
  sentiment: string;
  setSentiment: (value: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        The general mood during the meeting was {sentiment}
      </p>
      {sentiment === "positive" && <SmileyIcon size={60} color="green" />}
      {sentiment === "neutral" && <SmileyMehIcon size={60} color="gray" />}
      {sentiment === "negative" && <SmileySadIcon size={60} color="orange" />}
    </div>
  );
}
