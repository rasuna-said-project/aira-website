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
    historyLoading,
    error,
    panelRef,
    sendMessage,
    retryMessageSend,
  } = useAssistantChat();

  return (
    <section className="w-full min-w-0 bg-aira-bg">
      <div
        className="
          mx-auto flex w-full max-w-205 min-w-0
          min-h-[min(760px,100svh)]
          flex-col gap-0
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
          historyLoading={historyLoading}
          error={error}
          onSelectPrompt={sendMessage}
          onRetry={retryMessageSend}
          panelRef={panelRef}
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

        {/* DISCLAIMER */}
        <AssistantNotice />
      </div>
    </section>
  );
} 