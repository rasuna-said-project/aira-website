import AssistantAvatar from "./AssistantAvatar";

export default function ChatMessage({ message }) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex gap-3 ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
    >
      {isAssistant && <AssistantAvatar />}

      <div
        className={`
          min-w-0 max-w-[90%] rounded-3xl
          px-4 py-3.5 text-sm leading-relaxed
          whitespace-pre-line sm:px-5 sm:text-[15px]
          ${
            isAssistant
              ? "flex-1 border border-aira-primary/10 bg-white text-aira-text sm:flex-none sm:max-w-[85%] rounded-tl-lg"
              : "bg-aira-primary text-white rounded-tr-lg"
          }
        `}
      >
        <p>{message.content}</p>

        {message.topics?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-aira-primary/10 pt-3">
            <span className="mr-1 text-xs text-aira-text/55">
              Referensi:
            </span>

            {message.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-aira-sage/35 px-2.5 py-1 text-xs font-semibold text-aira-primary"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 