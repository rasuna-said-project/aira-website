"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { INITIAL_MESSAGE } from "@/components/assistant/assistant.constants";
import { getAssistantPreviewResponse } from "@/services/assistantPreviewService";

export function useAssistantChat() {
  const [messages, setMessages] = useState([
    INITIAL_MESSAGE,
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryMessage, setRetryMessage] = useState("");

  const endRef = useRef(null);

  // Auto scroll setiap ada pesan baru
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading, error]);

  // Mengirim pertanyaan
  const sendMessage = useCallback(
    async (question = input, options = {}) => {
      const message = question.trim();

      if (!message || loading) return;

      const isRetry = options.retry === true;

      setError("");
      setRetryMessage(message);

      // Pesan pengguna hanya ditambahkan sekali.
      // Saat retry, jangan membuat pesan duplikat.
      if (!isRetry) {
        setMessages((previous) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            role: "user",
            content: message,
          },
        ]);
      }

      setInput("");
      setLoading(true);

      try {
        // Respons simulasi.
        // Nanti diganti dengan pemanggilan aiService.
        const response =
          await getAssistantPreviewResponse(message);

        setMessages((previous) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: response.content,
            topics: response.topics || [],
          },
        ]);
      } catch (err) {
        console.error("AIRA Assistant error:", err);

        setError(
          "AIRA Assistant sedang mengalami gangguan. Pertanyaan Anda belum terjawab."
        );
      } finally {
        setLoading(false);
      }
    },
    [input, loading]
  );

  // Mengulang pengiriman pesan yang gagal
  const retryMessageSend = useCallback(() => {
    if (!retryMessage || loading) return;

    sendMessage(retryMessage, { retry: true });
  }, [retryMessage, loading, sendMessage]);

  return {
    messages,
    input,
    setInput,
    loading,
    error,
    endRef,
    sendMessage,
    retryMessageSend,
  };
} 