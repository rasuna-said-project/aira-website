import { Sparkles } from "lucide-react";
import { SUGGESTED_QUESTIONS } from "./assistant.constants";

export default function SuggestedPrompts({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 sm:pl-[52px]">
      {SUGGESTED_QUESTIONS.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          className="
            inline-flex min-h-10 items-center gap-1.5
            rounded-full border-2 border-aira-sage
            bg-aira-sage/20 px-3.5 py-2
            text-xs font-semibold text-aira-primary
            transition-colors hover:bg-aira-sage/50
            sm:text-sm
          "
        >
          <Sparkles className="size-4 shrink-0" />

          {question}
        </button>
      ))}
    </div>
  );
}
