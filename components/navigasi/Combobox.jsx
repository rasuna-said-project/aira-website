"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

const kolom =
  "min-h-[52px] w-full rounded-2xl border border-aira-primary/20 bg-white px-4 py-3.5 text-base transition-colors focus:border-aira-primary focus:outline-none";

// Menebalkan bagian nama yang cocok dengan teks yang diketik.
function Sorot({ teks, q }) {
  const kunci = q.trim().toLowerCase();
  if (!kunci) return <>{teks}</>;
  const kecil = teks.toLowerCase();
  const bagian = [];
  let dari = 0;
  for (let i = kecil.indexOf(kunci); i !== -1; i = kecil.indexOf(kunci, dari)) {
    if (i > dari) bagian.push(teks.slice(dari, i));
    bagian.push(
      <strong key={i} className="font-bold text-aira-primary-dark">
        {teks.slice(i, i + kunci.length)}
      </strong>
    );
    dari = i + kunci.length;
  }
  bagian.push(teks.slice(dari));
  return <>{bagian}</>;
}

// Kolom pilihan yang bisa dibuka seperti dropdown sekaligus diketik untuk menyaring.
export default function Combobox({
  label,
  placeholder,
  options,
  value,
  disabled = false,
  hint,
  emptyText = "Wilayah tidak ditemukan. Periksa ejaan atau kosongkan untuk menampilkan semua wilayah.",
  onSelect,
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const timer = useRef(undefined);
  const list = options.filter((o) => o.toLowerCase().includes(q.trim().toLowerCase()));

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (open) document.getElementById(`${id}-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, id]);

  const bukaDaftar = () => {
    if (disabled || open) return;
    setOpen(true);
    setQ("");
    setActive(0);
    // Memuat daftar sebentar, mewakili pengambilan data wilayah dari database.
    setLoading(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLoading(false), 500);
  };

  const tutup = () => {
    window.clearTimeout(timer.current);
    setLoading(false);
    setOpen(false);
  };

  const pilih = (nama) => {
    onSelect(nama);
    tutup();
  };

  return (
    <div
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) tutup();
      }}
    >
      <label htmlFor={`${id}-input`} className="mb-1.5 block text-sm font-medium text-aira-text/80">
        {label}
      </label>

      <div className="relative">
        <input
          id={`${id}-input`}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-disabled={disabled}
          aria-describedby={disabled && hint ? `${id}-hint` : undefined}
          aria-activedescendant={open && list[active] ? `${id}-opt-${active}` : undefined}
          disabled={disabled}
          autoComplete="off"
          value={open ? q : value}
          placeholder={open && value ? value : placeholder}
          onFocus={bukaDaftar}
          onClick={bukaDaftar}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
            if (!open) setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              if (!open) bukaDaftar();
              else setActive((i) => Math.min(i + 1, Math.max(list.length - 1, 0)));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              if (open) setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && open) {
              e.preventDefault();
              if (!loading && list[active]) pilih(list[active]);
            } else if (e.key === "Escape" && open) {
              e.preventDefault();
              tutup();
            }
          }}
          className={`${kolom} pl-4 pr-20 focus-visible:ring-2 focus-visible:ring-aira-primary/30 ${
            disabled ? "cursor-not-allowed bg-aira-sand/60 text-aira-text/50" : ""
          }`}
        />

        {value && !disabled ? (
          <button
            type="button"
            aria-label={`Hapus ${label.toLowerCase()}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onSelect("");
              tutup();
            }}
            className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-aira-text/60 hover:bg-aira-sand focus-visible:ring-2 focus-visible:ring-aira-primary/30"
          >
            <X className="size-4" />
          </button>
        ) : (
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-aira-text/50" />
        )}
      </div>

      {disabled && hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-aira-text/65">
          {hint}
        </p>
      )}

      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 z-20 mt-2 max-h-[260px] overflow-auto rounded-2xl border border-aira-primary/15 bg-white p-1.5 shadow-soft"
        >
          {loading ? (
            <li role="presentation" className="px-4 py-3 text-sm text-aira-text/65">
              Memuat daftar...
            </li>
          ) : list.length === 0 ? (
            <li role="presentation" className="px-4 py-3 text-sm text-aira-text/65">
              {emptyText}
            </li>
          ) : (
            list.map((nama, i) => (
              <li
                key={nama}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={nama === value}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onClick={() => pilih(nama)}
                className={`flex min-h-[44px] cursor-pointer items-center justify-between gap-2 rounded-xl px-4 py-2.5 ${
                  i === active ? "bg-aira-sage/30" : ""
                }`}
              >
                <span>
                  <Sorot teks={nama} q={q} />
                </span>
                {nama === value && <Check className="size-4 shrink-0 text-aira-primary" />}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
