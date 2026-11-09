import AssistantAvatar from "./AssistantAvatar";
import { ASSISTANT_CONFIG } from "./assistant.constants";

export default function AssistantHeader() {
  return (
    <header className="mb-5 flex items-center gap-4">
      <AssistantAvatar size="large" />

      <div className="min-w-0">
        <h1 className="text-2xl font-bold leading-tight text-aira-primary sm:text-3xl">
          {ASSISTANT_CONFIG.title}
        </h1>

        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-aira-text/75 sm:text-sm">
          <span className="size-2 rounded-full bg-aira-sage" />
          {ASSISTANT_CONFIG.subtitle}
        </p>

        <p className="mt-1 text-[10px] text-aira-text/50 sm:text-xs">
          {ASSISTANT_CONFIG.mode}
        </p>
      </div>
    </header>
  );
} 