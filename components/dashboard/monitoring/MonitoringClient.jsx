"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Info } from "lucide-react";
import MonitoringChart from "@/components/dashboard/monitoring/MonitoringChart";
import UpdateWaterForm from "@/components/dashboard/monitoring/UpdateWaterForm";
import { catatKondisiAir } from "@/app/actions/dashboard";
import { formatDesimal, hitungStatusDashboard } from "@/lib/statusDashboard";

const LABEL_STATUS = {
  aman: "Aman",
  waspada: "Waspada",
  krisis: "Krisis",
  belum: "Belum ditentukan",
};

const CHIP_STATUS = {
  aman: "bg-[#D7EEE7] text-[#176B78]",
  waspada: "bg-[#F9D989] text-[#76591C]",
  krisis: "bg-[#F4C9BD] text-[#8C5143]",
  belum: "bg-[#E9ECEC] text-[#536267]",
};

export default function MonitoringClient({
  adaData = false,
  volume = 0,
  liters = 0,
  note = "",
  lastUpdate = "",
  chartData = [],
  anggota = 1,
  anggotaMhm = 0,
  kondisiSumberAir = "Belum diketahui",
  tankCapacity = 0,
  parameter = "",
}) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);
  const [galat, setGalat] = useState("");

  // Status memakai klasifikasi yang sama dengan kalkulator dan dashboard.
  const status = adaData
    ? hitungStatusDashboard({ liter: liters, anggota, anggotaMhm, kondisiSumberAir })
    : null;

  async function handleSave(data) {
    if (menyimpan) return;

    setMenyimpan(true);
    setGalat("");

    const hasil = await catatKondisiAir({ volume: data.volume, note: data.note });

    setMenyimpan(false);

    if (!hasil?.ok) {
      setGalat(hasil?.error || "Catatan belum dapat disimpan.");
      return;
    }

    setIsFormOpen(false);
    router.refresh();
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
          disabled={!adaData}
          onClick={() => setIsFormOpen((previous) => !previous)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#176B78] px-5 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#125762] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFormOpen ? <X size={16} /> : <Plus size={16} />}
          {isFormOpen
            ? "Tutup Form Pembaruan"
            : "Perbarui Kondisi Air Saat Ini"}
        </button>
      </div>

      {/* Belum ada data */}
      {!adaData && (
        <div className="rounded-xl border border-[#E1EAEB] bg-white px-4 py-3 text-xs leading-relaxed text-gray-500">
          Belum ada data kondisi air.{" "}
          <a
            href="/kalkulator-air"
            className="font-semibold text-[#176B78] underline"
          >
            Hitung kondisi air
          </a>{" "}
          terlebih dahulu agar pencatatan dapat dimulai.
        </div>
      )}

      {/* Status terakhir */}
      {adaData && status && (
        <section className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-[#E1EAEB] bg-white px-4 py-3 shadow-sm">
          <span className="text-xs font-medium text-[#176B78]">
            Kondisi terakhir
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${CHIP_STATUS[status.statusKey]}`}
          >
            {LABEL_STATUS[status.statusKey]}
          </span>

          <p className="text-sm text-[#176B78]">
            <strong className="text-base">
              {formatDesimal(status.hari)} hari
            </strong>{" "}
            <span className="text-xs text-gray-500">
              estimasi ketahanan
            </span>
          </p>

          <span className="text-xs text-gray-400 sm:ml-auto">
            Diperbarui {lastUpdate}
          </span>
        </section>
      )}

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
      {adaData && (
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-[#94D2BD] bg-[#E5F3EF] p-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-sm font-medium text-[#176B78]">
              Parameter perhitungan terakhir
            </h2>
            <p className="mt-1 text-xs text-gray-500">{parameter}</p>
          </div>

          <a
            href="/kalkulator-air"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#176B78] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#125762]"
          >
            Buka kalkulator dengan data ini
          </a>
        </section>
      )}

      {/* Form pembaruan kondisi air */}
      {isFormOpen && (
        <>
          {galat && (
            <p
              role="alert"
              className="rounded-xl bg-[#FCE3DC] px-4 py-3 text-xs text-[#A94D37]"
            >
              {galat}
            </p>
          )}

          <UpdateWaterForm
            initialVolume={volume}
            tankCapacity={tankCapacity}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </>
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