import { RefreshCw } from "lucide-react";

import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import SuggestedPrompts from "./SuggestedPrompts";

export default function ChatPanel({
  messages,
  loading,
  error,
  onSelectPrompt,
  onRetry,
  endRef,
}) {
  return (
    <section
      className="
      mt-5 flex min-h-80 flex-1 flex-col
      overflow-y-auto overscroll-contain
      rounded-aira-lg
      border border-aira-primary/5
     bg-aira-sand
      p-4 shadow-soft
      sm:min-h-105
      sm:rounded-[28px]
      sm:p-6
    "
      role="log"
      aria-label="Percakapan AIRA Assistant"
      aria-live="polite"
    >
      <div className="flex flex-col gap-5">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}

        {loading && <TypingIndicator />}

        {error && (
          <div
            className="rounded-2xl border border-aira-peach bg-aira-peach/15 p-4 text-sm text-aira-text sm:ml-13"
            role="alert"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 font-semibold text-aira-primary"
            >
              <RefreshCw className="size-4" />
              Coba lagi
            </button>
          </div>
        )}

        {messages.length === 1 && !loading && (
          <SuggestedPrompts onSelect={onSelectPrompt} />
        )}

        <div ref={endRef} />
      </div>
    </section>
  );
} 
