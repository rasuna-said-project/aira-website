"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { INITIAL_MESSAGE } from "@/components/assistant/assistant.constants";
import { kirimPesanAssistant } from "@/app/actions/assistant";

export function useAssistantChat() {
  const [messages, setMessages] = useState([
    INITIAL_MESSAGE,
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryMessage, setRetryMessage] = useState("");

  const endRef = useRef(null);

  // Menggeser tampilan ke pesan terbaru.
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading, error]);

  const sendMessage = useCallback(
    async (question = input, options = {}) => {
      const message =
        typeof question === "string"
          ? question.trim()
          : "";

      if (!message || loading) return;

      const isRetry = options.retry === true;

      setError("");
      setRetryMessage(message);

      // Pesan pengguna hanya ditambahkan sekali.
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
        // Riwayat diambil dari pesan sebelum permintaan terbaru.
        // Pesan awal sambutan tidak perlu dikirim ke backend.
        const history = messages
          .filter(
            (item) =>
              item.id !== "welcome" &&
              ["user", "assistant"].includes(item.role) &&
              typeof item.content === "string"
          )
          .slice(-6)
          .map((item) => ({
            role: item.role,
            content: item.content,
          }));

        // Ketika retry, pertanyaan yang gagal sudah ada di riwayat.
        // Hapus dari history agar tidak terkirim dua kali.
        if (
          history.length > 0 &&
          history[history.length - 1].role === "user" &&
          history[history.length - 1].content.trim() === message
        ) {
          history.pop();
        }

        const response = await kirimPesanAssistant({
          question: message,
          history,
        });

        if (!response?.ok) {
          throw new Error(
            response?.error ||
              "AIRA Assistant belum dapat menjawab pertanyaan."
          );
        }

        setMessages((previous) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: response.answer,
            mode: response.mode,
            sources: Array.isArray(response.sources)
              ? response.sources
              : [],
          },
        ]);

        setRetryMessage("");
      } catch (err) {
        console.error(
          "[AIRA Assistant] Gagal mengirim pesan:",
          err
        );

        setError(
          err?.message ||
            "AIRA Assistant sedang mengalami gangguan. Pertanyaan Anda belum terjawab."
        );
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages]
  );

  const retryMessageSend = useCallback(() => {
    if (!retryMessage || loading) return;

    sendMessage(retryMessage, {
      retry: true,
    });
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
