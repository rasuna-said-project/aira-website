import ReactMarkdown from "react-markdown";
import AssistantAvatar from "./AssistantAvatar";

const LABEL_MODE = {
  rag: "Referensi AIRA",
  hybrid: "AIRA Assistant (Hybrid)",
  llm: "Pengetahuan umum AI",
  no_source: "Referensi belum ditemukan",
  out_of_scope: "Di luar cakupan AIRA",
};

function formatHalaman(source) {
  const awal = source.page_start;
  const akhir = source.page_end;
  if (awal == null && akhir == null) return null;
  if (awal == null) return `Halaman ${akhir}`;
  if (akhir == null || awal === akhir) return `Halaman ${awal}`;
  return `Halaman ${awal}–${akhir}`;
}

function bersihkanPenandaSumber(content) {
  return String(content || "")
    .replace(/\s*\[Sumber\s+\d+\]/gi, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function MarkdownContent({ content }) {
  return (
    <div className="aira-markdown text-sm leading-relaxed text-aira-text sm:text-[15px]">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-aira-text">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          h1: ({ children }) => <h1 className="mb-2 mt-4 text-lg font-bold">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-2 mt-3 text-base font-semibold">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 mt-3 text-sm font-semibold">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-4 border-gray-300 pl-3 italic text-gray-600">{children}</blockquote>
          ),
          code: ({ children }) => <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">{children}</code>,
          pre: ({ children }) => <pre className="my-2 overflow-x-auto rounded-lg bg-gray-100 p-3 text-xs">{children}</pre>,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {children}
            </a>
          ),
          hr: () => <hr className="my-3 border-aira-primary/10" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function ChatMessage({ message }) {
  const isAssistant = message.role === "assistant";
  const sources = Array.isArray(message.sources) ? message.sources : [];
  const mode = message.mode || null;
  const modeLabel = isAssistant && mode ? LABEL_MODE[mode] || null : null;
  const tampilkanSumber = isAssistant && ["rag", "hybrid"].includes(mode) && sources.length > 0;
  const content = isAssistant
    ? bersihkanPenandaSumber(message.content)
    : String(message.content || "");

  return (
    <div className={`flex gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}>
      {isAssistant && <AssistantAvatar />}
      <div
        className={`min-w-0 max-w-[90%] rounded-3xl px-4 py-3.5 text-sm leading-relaxed sm:px-5 ${
          isAssistant
            ? "flex-1 rounded-tl-lg border border-aira-primary/10 bg-white text-aira-text sm:flex-none sm:max-w-[85%]"
            : "whitespace-pre-line rounded-tr-lg bg-aira-primary text-white"
        }`}
      >
        {isAssistant ? <MarkdownContent content={content} /> : <p>{content}</p>}

        {modeLabel && (
          <div className="mt-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                mode === "rag"
                  ? "bg-aira-sage/35 text-aira-primary"
                  : mode === "hybrid"
                    ? "bg-blue-50 text-blue-700"
                    : mode === "no_source"
                      ? "bg-aira-peach/20 text-aira-text"
                      : mode === "out_of_scope"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-blue-50 text-blue-700"
              }`}
            >
              {modeLabel}
            </span>
          </div>
        )}

        {tampilkanSumber && (
          <div className="mt-3 border-t border-aira-primary/10 pt-3">
            <p className="mb-2 text-xs font-semibold text-aira-text/70">Sumber referensi</p>
            <div className="space-y-2">
              {sources.map((source, index) => {
                const halaman = formatHalaman(source);
                return (
                  <div
                    key={`${source.title || "referensi"}-${source.number || index}`}
                    className="flex gap-2 rounded-xl bg-aira-sage/15 p-3"
                  >
                    <span className="mt-0.5 shrink-0" aria-hidden="true">
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
                        <p className="mt-1 text-xs text-aira-text/65">{source.publisher}</p>
                      )}
                      {halaman && (
                        <p className="mt-1 text-xs text-aira-text/65">{halaman}</p>
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
