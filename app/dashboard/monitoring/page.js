"use client";

import { useState } from "react";
import { Plus, X, Info } from "lucide-react";
import MonitoringChart from "@/components/dashboard/monitoring/MonitoringChart";
import UpdateWaterForm from "@/components/dashboard/monitoring/UpdateWaterForm";

const initialChartData = [
  { id: 1, date: "2 Okt", value: 12.8 },
  { id: 2, date: "4 Okt", value: 10.8 },
  { id: 3, date: "6 Okt", value: 8.7 },
  { id: 4, date: "8 Okt", value: 13.6 },
  { id: 5, date: "10 Okt", value: 11.0 },
  { id: 6, date: "12 Okt", value: 10.0 },
];

export default function MonitoringPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [volume, setVolume] = useState(60);
  const [liters, setLiters] = useState(600);
  const [note, setNote] = useState("");
  const [lastUpdate, setLastUpdate] = useState("12 Okt 2026, 06.40");
  const [chartData, setChartData] = useState(initialChartData);

  const dailyWaterNeeds = 70;
  const estimatedDays = liters / dailyWaterNeeds;

  const status =
    estimatedDays >= 10
      ? "Aman"
      : estimatedDays >= 3
        ? "Waspada"
        : "Krisis";

  function handleSave(data) {
    const newDays = data.liters / dailyWaterNeeds;

    const now = new Date();
    const dateLabel = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    }).format(now);

    const timeLabel = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(now);

    setVolume(data.volume);
    setLiters(data.liters);
    setNote(data.note);
    setLastUpdate(timeLabel);

    setChartData((previous) => [
      ...previous,
      {
        id: Date.now(),
        date: dateLabel,
        value: Number(newDays.toFixed(1)),
      },
    ]);

    setIsFormOpen(false);
  }

  return (
    <div className="space-y-5">
      {/* Header halaman */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[#176B78] sm:text-3xl">
            Monitoring Kondisi Air
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Tren stok air dari catatan yang Anda masukkan sendiri.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen((previous) => !previous)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#176B78] px-5 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#125762]"
        >
          {isFormOpen ? <X size={16} /> : <Plus size={16} />}
          {isFormOpen
            ? "Tutup Form Pembaruan"
            : "Perbarui Kondisi Air Saat Ini"}
        </button>
      </div>

      {/* Status terakhir */}
      <section className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-[#E1EAEB] bg-white px-4 py-3 shadow-sm">
        <span className="text-xs font-medium text-[#176B78]">
          Kondisi terakhir
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            status === "Aman"
              ? "bg-[#D7EEE7] text-[#176B78]"
              : status === "Waspada"
                ? "bg-[#F9D989] text-[#76591C]"
                : "bg-[#F4C9BD] text-[#8C5143]"
          }`}
        >
          {status}
        </span>

        <p className="text-sm text-[#176B78]">
          <strong className="text-base">
            {estimatedDays.toFixed(1).replace(".", ",")} hari
          </strong>{" "}
          <span className="text-xs text-gray-500">
            estimasi ketahanan
          </span>
        </p>

        <span className="text-xs text-gray-400 sm:ml-auto">
          Diperbarui {lastUpdate}
        </span>
      </section>

      {/* Informasi sumber data */}
      <div className="flex items-start gap-2 rounded-xl border border-[#B9DDF5] bg-white px-4 py-3">
        <Info size={16} className="mt-0.5 shrink-0 text-[#4EA8DE]" />
        <p className="text-xs leading-relaxed text-gray-500">
          Data di halaman ini berasal dari catatan manual Anda, bukan sensor
          atau pemantauan waktu nyata. Semakin rutin dicatat, semakin akurat
          tren yang tampil.
        </p>
      </div>

      {/* Parameter perhitungan terakhir */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-[#94D2BD] bg-[#E5F3EF] p-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-sm font-medium text-[#176B78]">
            Parameter perhitungan terakhir
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Rongkop, Gunungkidul, DIY · sumber terbatas · atap 36 m² ·
            MHM 2 orang
          </p>
        </div>

        <a
          href="/kalkulator-air"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#176B78] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#125762]"
        >
          Buka kalkulator dengan data ini
        </a>
      </section>

      {/* Form pembaruan kondisi air */}
      {isFormOpen && (
        <UpdateWaterForm
          initialVolume={volume}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {/* Grafik tren ketahanan air */}
      <MonitoringChart data={chartData} />

      {/* Catatan terakhir */}
      {note && (
        <div className="rounded-xl border border-[#E1EAEB] bg-white px-4 py-3">
          <p className="text-xs font-medium text-[#176B78]">
            Catatan pembaruan terakhir
          </p>
          <p className="mt-1 text-xs text-gray-500">{note}</p>
        </div>
      )}
    </div>
  );
} 