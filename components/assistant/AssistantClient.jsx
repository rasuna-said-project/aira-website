"use client";

import { useAssistantChat } from "@/hooks/useAssistantChat";

import AssistantHeader from "./AssistantHeader";
import ChatPanel from "./ChatPanel";
import ChatInput from "./ChatInput";
import AssistantQuickLinks from "./AssistantQuickLinks";
import AssistantNotice from "./AssistantNotice";

export default function AssistantClient() {
  const {
    messages,
    input,
    setInput,
    loading,
    error,
    endRef,
    sendMessage,
    retryMessageSend,
  } = useAssistantChat();

  return (
    <main className="min-h-[100svh] bg-aira-bg">
      <div
      className="
      mx-auto flex min-h-[100svh]
      w-full max-w-[820px] flex-col
      px-4 py-5
      sm:px-5 sm:py-8
      "
      >
        {/* HEADER */}
        <AssistantHeader />

        {/* AREA PERCAKAPAN */}
        <ChatPanel
          messages={messages}
          loading={loading}
          error={error}
          onSelectPrompt={sendMessage}
          onRetry={retryMessageSend}
          endRef={endRef}
        />

        {/* INPUT PESAN */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={() => sendMessage()}
          loading={loading}
        />

        {/* NAVIGASI FITUR */}
        <AssistantQuickLinks />

        {/* INFORMASI */}
        <AssistantNotice />
      </div>
    </main>
  );
} 