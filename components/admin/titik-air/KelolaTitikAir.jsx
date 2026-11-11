"use client";

import { useCallback, useState } from "react";
import { Pencil, Search } from "lucide-react";

import PanelEditTitikAir, { KETERSEDIAAN } from "@/components/admin/titik-air/PanelEditTitikAir";
import { AvailabilityBadge } from "@/components/StatusBadge";
import DashboardPageHead from "@/components/dashboard/DashboardPageHead";
import { inputCls } from "@/components/dashboard/DashboardFormUi";

const th = "px-3 py-3 text-xs font-semibold uppercase tracking-wider text-aira-text/60";
const td = "px-3 py-4 align-top";

function TombolEdit({ onClick, penuh = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border-2 border-aira-primary px-4 py-2 font-semibold text-aira-primary transition-colors hover:bg-aira-primary/10 ${
        penuh ? "mt-4 flex w-full" : ""
      }`}
    >
      <Pencil className="size-4" /> Edit
    </button>
  );
}

// Kelola Titik Air (C03): direktori titik air terverifikasi, pencarian, filter ketersediaan, dan panel Edit.
export default function KelolaTitikAir({ awal }) {
  const [titik, setTitik] = useState(awal);
  const [kataKunci, setKataKunci] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [editId, setEditId] = useState(null);
  const [pesan, setPesan] = useState("");

  const dipilih = titik.find((t) => t.id === editId) ?? null;
  const tutupPanel = useCallback(() => setEditId(null), []);

  const daftar = titik.filter(
    (t) =>
      (filter === "Semua" || t.availability === filter) &&
      `${t.name} ${t.area} ${t.type}`.toLowerCase().includes(kataKunci.toLowerCase())
  );

  const simpan = (id, perubahan, sumber) => {
    // SIMULASI: perubahan hanya tersimpan di halaman ini.
    // TODO (Tria): panggil Server Action edit titik air (catat ke jejak audit dan perbarui updated_at),
    // sehingga perubahan tercermin di Navigasi Air. `sumber` ikut dicatat sebagai dasar perubahan.
    void sumber;
    const nama = titik.find((t) => t.id === id)?.name ?? "";
    setTitik((l) =>
      l.map((t) => (t.id === id ? { ...t, ...perubahan, updated: "Diperbarui baru saja", updatedHoursAgo: 0 } : t))
    );
    setPesan(`Perubahan "${nama}" tersimpan dan tampil di Navigasi Air.`);
    setEditId(null);
  };

  return (
    <div className="space-y-6">
      <DashboardPageHead
        title="Kelola Titik Air"
        desc="Direktori titik air terverifikasi yang tampil di Navigasi Air. Perbarui ketersediaan dan jam operasional saat ada perubahan."
      />

      {pesan && (
        <p
          role="status"
          className="fade-up rounded-2xl border border-aira-sage bg-aira-sage/50 px-5 py-3 font-medium text-aira-primary-dark"
        >
          {pesan}
        </p>
      )}

      <section className="rounded-[28px] border border-aira-primary/5 bg-white p-6 shadow-soft sm:p-8">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="relative">
            <span className="sr-only">Cari titik air</span>
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-aira-primary" />
            <input
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
              placeholder="Cari nama, jenis, atau wilayah"
              className="min-h-[52px] w-full rounded-2xl border border-aira-primary/20 bg-white py-3.5 pl-12 pr-4 focus:border-aira-primary focus:outline-none"
            />
          </label>
          <select
            aria-label="Filter ketersediaan"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={inputCls}
          >
            <option>Semua</option>
            {KETERSEDIAAN.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>

        {/* Layar lebar: tabel. Layar sempit: kartu. */}
        <table className="mt-4 hidden w-full table-fixed text-left text-[15px] xl:table">
          <thead>
            <tr className="border-b border-aira-primary/10">
              <th className={`${th} w-[32%]`}>Titik air</th>
              <th className={`${th} w-[18%]`}>Wilayah</th>
              <th className={`${th} w-[18%]`}>Ketersediaan</th>
              <th className={`${th} w-[20%]`}>Jam operasional</th>
              <th className={`${th} w-[12%]`}>
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {daftar.map((t) => (
              <tr key={t.id} className="border-b border-aira-primary/5 last:border-0 hover:bg-aira-bg">
                <td className={td}>
                  <p className="font-semibold text-aira-primary">{t.name}</p>
                  <p className="text-sm text-aira-text/65">{t.type}</p>
                </td>
                <td className={td}>{t.area}</td>
                <td className={`${td} whitespace-nowrap`}>
                  <AvailabilityBadge v={t.availability} />
                </td>
                <td className={td}>
                  <p className="text-aira-text/80">{t.hours}</p>
                  <p className="text-sm text-aira-text/65">{t.updated}</p>
                </td>
                <td className={`${td} text-right`}>
                  <TombolEdit onClick={() => setEditId(t.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="mt-4 space-y-3 xl:hidden">
          {daftar.map((t) => (
            <li key={t.id} className="rounded-2xl border border-aira-primary/10 p-4">
              <p className="font-semibold text-aira-primary">{t.name}</p>
              <p className="text-sm text-aira-text/65">{t.type}</p>
              <p className="mt-2 text-sm text-aira-text/75">{t.area}</p>
              <div className="mt-3 whitespace-nowrap">
                <AvailabilityBadge v={t.availability} />
              </div>
              <p className="mt-3 text-aira-text/80">{t.hours}</p>
              <p className="text-sm text-aira-text/65">{t.updated}</p>
              <TombolEdit onClick={() => setEditId(t.id)} penuh />
            </li>
          ))}
        </ul>

        {daftar.length === 0 && (
          <p className="mt-4 rounded-2xl bg-aira-bg p-8 text-center text-aira-text/70">
            Tidak ada titik air yang cocok dengan pencarian.
          </p>
        )}
        <p className="mt-4 text-sm text-aira-text/65">
          {daftar.length} dari {titik.length} titik air aktif
        </p>
      </section>

      {dipilih && <PanelEditTitikAir key={dipilih.id} titik={dipilih} onClose={tutupPanel} onSimpan={simpan} />}
    </div>
  );
}
