import { ASSISTANT_CONFIG } from "./assistant.constants";

export default function AssistantNotice() {
  return (
    <p
      className="
      mt-2 w-full px-2
      text-center text-[10px]
      leading-relaxed text-aira-text/55
      sm:text-xs
  "
    >
  {ASSISTANT_CONFIG.notice}
</p>
  );
} 
