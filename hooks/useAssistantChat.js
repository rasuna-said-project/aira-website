"use client"; 

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { INITIAL_MESSAGE } from "@/components/assistant/assistant.constants";
import { kirimPesanAssistant } from "@/app/actions/assistant";
import { ambilRiwayatAssistant } from "@/app/actions/riwayat";

export function useAssistantChat() {
  const [messages, setMessages] = useState([
    INITIAL_MESSAGE,
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryMessage, setRetryMessage] = useState("");
  const [historyLoading, setHistoryLoading] = useState(true);

  // Referensi langsung ke area scroll percakapan
  const panelRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        const response = await ambilRiwayatAssistant();

        if (!active || !response?.ok) return;

        const restoredMessages = [];

        for (const item of response.data || []) {
          restoredMessages.push({
            id: `user-${item.interaction_id}`,
            role: "user",
            content: item.user_question,
          });

          restoredMessages.push({
            id: `assistant-${item.interaction_id}`,
            role: "assistant",
            content: item.assistant_response,
            mode: item.response_mode || null,
            sources: Array.isArray(item.sources)
              ? item.sources
              : [],
          });
        }

        if (restoredMessages.length > 0) {
          setMessages([
            INITIAL_MESSAGE,
            ...restoredMessages,
          ]);
        }
      } catch (err) {
        console.error(
          "[AIRA Assistant] Gagal memuat riwayat:",
          err
        );
      } finally {
        if (active) {
          setHistoryLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      active = false;
    };
  }, []);

  // Auto-scroll hanya pada area percakapan
  useEffect(() => {
    const panel = panelRef.current;

    if (!panel) return;

    panel.scrollTo({
      top: panel.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, error]);

  const sendMessage = useCallback(
    async (question = input, options = {}) => {
      const message =
        typeof question === "string"
          ? question.trim()
          : "";

      if (!message || loading || historyLoading) return;

      const isRetry = options.retry === true;

      setError("");
      setRetryMessage(message);

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
    [input, loading, messages, historyLoading]
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
    loading: loading || historyLoading,
    error,
    panelRef,
    sendMessage,
    retryMessageSend,
    historyLoading,
  };
} 