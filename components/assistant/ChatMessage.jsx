
import AssistantAvatar from "./AssistantAvatar";

const LABEL_MODE = {
  rag: "Referensi AIRA",
  llm: "Pengetahuan umum AI",
  no_source: "Referensi belum ditemukan",
  out_of_scope: "Di luar ruang lingkup AIRA",
};

function formatHalaman(source) {
  const awal = source.page_start;
  const akhir = source.page_end;

  if (awal == null && akhir == null) return null;

  if (awal == null) {
    return `Halaman ${akhir}`;
  }

  if (akhir == null || awal === akhir) {
    return `Halaman ${awal}`;
  }

  return `Halaman ${awal}–${akhir}`;
}

export default function ChatMessage({ message }) {
  const isAssistant = message.role === "assistant";

  const sources = Array.isArray(message.sources)
    ? message.sources
    : [];

  const mode = message.mode || null;

  const modeLabel =
    isAssistant && mode
      ? LABEL_MODE[mode] || null
      : null;

  const isRag = mode === "rag";

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

        {/* LABEL MODE RESPONS */}
        {modeLabel && (
          <div className="mt-3">
            <span
              className={`
                inline-flex items-center gap-1.5 rounded-full
                px-2.5 py-1 text-[11px] font-semibold
                ${
                  mode === "rag"
                    ? "bg-aira-sage/35 text-aira-primary"
                    : mode === "no_source"
                      ? "bg-aira-peach/20 text-aira-text"
                      : mode === "out_of_scope"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-blue-50 text-blue-700"
                }
              `}
            >
              {modeLabel}
            </span>
          </div>
        )}

        {/* SUMBER REFERENSI HANYA UNTUK MODE RAG */}
        {isAssistant && isRag && sources.length > 0 && (
          <div className="mt-3 border-t border-aira-primary/10 pt-3">
            <p className="mb-2 text-xs font-semibold text-aira-text/70">
              Sumber referensi
            </p>

            <div className="space-y-2">
              {sources.map((source, index) => {
                const halaman = formatHalaman(source);

                return (
                  <div
                    key={`${source.title || "sumber"}-${index}`}
                    className="flex gap-2 rounded-xl bg-aira-sage/15 p-3"
                  >
                    <span className="mt-0.5 shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-aira-primary"
                        aria-hidden="true"
                      >
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
                        <path d="M14 2v6h6" />
                        <path d="M8 13h8" />
                        <path d="M8 17h8" />
                      </svg>
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-aira-primary">
                        {source.title || "Dokumen referensi AIRA"}
                      </p>

                      {source.publisher && (
                        <p className="mt-1 text-xs text-aira-text/65">
                          Penerbit: {source.publisher}
                        </p>
                      )}

                      {halaman && (
                        <p className="mt-1 text-xs text-aira-text/65">
                          {halaman}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
