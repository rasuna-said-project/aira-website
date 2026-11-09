"use client";

import { useState } from "react";

export default function UpdateWaterForm({
  initialVolume = 60,
  onSave,
  onCancel,
}) {
  const [volume, setVolume] = useState(initialVolume);
  const [note, setNote] = useState("");

  const tankCapacity = 1000;
  const estimatedLiters = Math.round((volume / 100) * tankCapacity);

  function handleSubmit(event) {
    event.preventDefault();

    onSave({
      volume,
      liters: estimatedLiters,
      note: note.trim(),
    });
  }

  return (
    <section className="rounded-3xl border border-[#94D2BD] bg-white p-5 shadow-[0_8px_30px_rgba(30,80,90,0.07)] sm:p-6">
      <h2 className="text-base font-semibold text-[#176B78]">
        Catat kondisi air hari ini
      </h2>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {/* Volume air */}
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="water-volume"
              className="text-xs font-medium text-[#34464B]"
            >
              Volume tandon saat ini
            </label>

            <p className="text-sm text-gray-500">
              <strong className="text-xl text-[#176B78]">
                {volume}%
              </strong>{" "}
              ≈ {estimatedLiters.toLocaleString("id-ID")} L
            </p>
          </div>

          <input
            id="water-volume"
            type="range"
            min="0"
            max="100"
            step="5"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="h-2 w-full cursor-pointer accent-[#176B78]"
          />

          <div className="mt-1 flex justify-between text-[10px] text-gray-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Catatan */}
        <div>
          <label
            htmlFor="water-note"
            className="mb-2 block text-xs font-medium text-[#34464B]"
          >
            Catatan (opsional)
          </label>

          <input
            id="water-note"
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Contoh: isi ulang dari tangki"
            className="w-full rounded-xl border border-[#C9DDE3] px-3 py-3 text-xs text-[#34464B] outline-none transition placeholder:text-gray-400 focus:border-[#4EA8DE] focus:ring-2 focus:ring-[#4EA8DE]/20"
          />
        </div>

        {/* Tombol */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="rounded-full bg-[#176B78] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#125762]"
          >
            Simpan Catatan
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-3 py-3 text-xs font-medium text-[#176B78] transition hover:bg-[#EAF5F4]"
          >
            Batal
          </button>
        </div>
      </form>
    </section>
  );
} 