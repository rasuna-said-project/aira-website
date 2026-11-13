"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

// Panel samping kanan (Figma: AdminUi Overlay, side="right"): latar gelap, Esc menutup,
// scroll halaman dikunci, fokus pindah ke panel lalu kembali ke tombol pemicu saat ditutup.
export default function Overlay({ onClose, title, children }) {
  const panel = useRef(null);

  useEffect(() => {
    const pemicu = document.activeElement;
    panel.current?.focus();

    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflowSebelumnya = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflowSebelumnya;
      if (pemicu instanceof HTMLElement) pemicu.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-aira-text/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fade-up relative h-[100dvh] w-full max-w-[460px] overflow-y-auto overscroll-contain bg-white shadow-2xl outline-none sm:rounded-l-[28px]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-aira-primary/10 bg-white/95 px-4 py-4 backdrop-blur sm:px-8 sm:py-5">
          <h2 className="font-heading text-xl font-semibold text-aira-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="grid size-11 place-items-center rounded-full hover:bg-aira-sand"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="px-4 py-6 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
