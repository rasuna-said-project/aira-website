import { RefreshCw } from "lucide-react";
import AssistantAvatar from "./AssistantAvatar";
import { ASSISTANT_CONFIG } from "./assistant.constants";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <AssistantAvatar />

      <div
        className="flex items-center gap-2 rounded-3xl rounded-tl-lg border border-aira-primary/10 bg-white px-5 py-4 text-sm font-medium text-aira-primary"
        aria-label="AIRA sedang memproses pertanyaan"
      >
        <RefreshCw className="size-4 animate-spin" />

        {ASSISTANT_CONFIG.initialLoadingText}
      </div>
    </div>
  );
}
