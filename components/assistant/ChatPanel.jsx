import { RefreshCw } from "lucide-react";

import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import SuggestedPrompts from "./SuggestedPrompts";

export default function ChatPanel({
  messages,
  loading,
  historyLoading,
  error,
  onSelectPrompt,
  onRetry,
  panelRef,
}) {
  return (
    <section
      ref={panelRef}
      className="
        mt-5
        flex w-full min-w-0 flex-none flex-col

        h-[clamp(18rem,55svh,34rem)]
        min-h-0

        overflow-y-auto
        overflow-x-hidden
        overscroll-y-contain
        touch-pan-y
        [scrollbar-gutter:stable]

        rounded-aira-lg
        border border-aira-primary/5
        bg-aira-sand
        p-4
        shadow-soft

        sm:h-[min(58vh,660px)]
        sm:rounded-[28px]
        sm:p-6
      "
      role="log"
      aria-label="Percakapan AIRA Assistant"
      aria-live="polite"
      aria-relevant="additions"
    >
      <div className="flex min-w-0 flex-col gap-5">
        {/* DAFTAR PESAN */}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}

        {/* INDIKATOR AIRA SEDANG MENJAWAB */}
        {loading && (
          <TypingIndicator
            historyLoading={historyLoading}
          />
        )}

        {/* PESAN ERROR */}
        {error && (
          <div
            className="
              min-w-0
              rounded-2xl
              border border-aira-peach
              bg-aira-peach/15
              p-4
              text-sm text-aira-text
              sm:ml-13
            "
            role="alert"
          >
            <p className="break-words">{error}</p>

            <button
              type="button"
              onClick={onRetry}
              className="
                mt-3
                inline-flex items-center gap-2
                font-semibold text-aira-primary
                transition-opacity
                hover:opacity-75
              "
            >
              <RefreshCw className="size-4 shrink-0" />
              Coba lagi
            </button>
          </div>
        )}

        {/* PROMPT AWAL */}
        {messages.length === 1 && !loading && (
          <SuggestedPrompts
            onSelect={onSelectPrompt}
          />
        )}
      </div>
    </section>
  );
} 