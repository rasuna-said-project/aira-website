"use client";

import { useId, useState } from "react";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { WILAYAH_CURAH_HUJAN } from "@/data/curahHujan";

// Kolom pencarian wilayah (combobox) dengan daftar kabupaten/kota.
export default function RegionSelect({ value, onChange }) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const list = WILAYAH_CURAH_HUJAN.filter((w) => w.nama.toLowerCase().includes(query.trim().toLowerCase()));

  const pilih = (nama) => {
    onChange(nama);
    setOpen(false);
  };

  return (
    <div
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <MapPin
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-aira-primary"
        aria-hidden="true"
      />
      <Input
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-label="Lokasi atau wilayah tempat tinggal"
        value={open ? query : value}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "Enter" && open) {
            e.preventDefault();
            if (list[0]) pilih(list[0].nama);
          }
        }}
        placeholder="Pilih Kabupaten / Kota (misal: Gunungkidul)"
        className="h-[52px] rounded-2xl border-aira-primary/20 bg-white pl-12 pr-11 text-base focus-visible:border-aira-primary focus-visible:ring-aira-secondary/30 md:text-base"
      />
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-aira-text/50"
        aria-hidden="true"
      />
      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-aira-primary/15 bg-white p-1.5 shadow-soft"
        >
          {list.length === 0 && (
            <li className="px-4 py-3 text-sm text-aira-text/65">
              Wilayah tidak ditemukan. Kosongkan untuk melewati estimasi panen hujan.
            </li>
          )}
          {value && !query && (
            <li role="option" aria-selected={false}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pilih("")}
                className="w-full rounded-xl px-4 py-2.5 text-left text-sm text-aira-text/65 hover:bg-aira-bg"
              >
                Hapus pilihan wilayah
              </button>
            </li>
          )}
          {list.map((w) => (
            <li key={w.nama} role="option" aria-selected={w.nama === value}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pilih(w.nama)}
                className="flex w-full items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-left hover:bg-aira-sage/30"
              >
                <span>{w.nama}</span>
                {w.nama === value && <Check className="size-4 text-aira-primary" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
