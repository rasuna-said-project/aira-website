"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Droplets,
  ClipboardList,
  Activity,
  ArrowRight,
  ShieldCheck,
  Clock3,
  Pencil,
  Plus,
  XCircle,
  Filter,
  History,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";

import {
  MOCK_ADMIN,
  MOCK_ADMIN_STATS,
  MOCK_CONTRIBUTION_STATUS,
  MOCK_AUDIT_LOGS,
} from "@/data/admin/mockAdmin";

// ============================================
// 1. ICON STATISTIK
// ============================================

const statIcons = {
  droplet: Droplets,
  "clipboard-list": ClipboardList,
  activity: Activity,
};

const statColors = {
  teal: "bg-[#E0F1F0] text-aira-primary",
  peach: "bg-[#F8E5DF] text-[#B4563C]",
  sage: "bg-[#DDF0E8] text-[#327D69]",
};

// ============================================
// 2. KOMPONEN KARTU STATISTIK
// ============================================

function AdminStatCard({ stat }) {
  const Icon = statIcons[stat.icon];

  return (
    <Link
      href={stat.href}
      className="group flex min-h-[120px] flex-col justify-between rounded-[22px] border border-aira-primary/5 bg-white p-5 shadow-[0_8px_28px_-10px_rgba(23,107,120,0.22)] transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-2">

        <p className="max-w-[190px] text-sm font-medium leading-relaxed text-aira-text/75">
          {stat.title}
        </p>

        <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${statColors[stat.color]}`}>
          <Icon className="size-[18px]" />
        </div>

      </div>

      <div className="mt-3 flex items-end justify-between gap-2">

        <div>
          <p className="text-3xl font-bold tracking-tight text-aira-primary">
            {stat.value}
          </p>

          <p className="mt-1 text-xs text-aira-text/55">
            {stat.description}
            <ArrowRight className="ml-1 inline size-3" />
          </p>
        </div>

      </div>
    </Link>
  );
}

// ============================================
// 3. KOMPONEN STATUS KONTRIBUSI
// ============================================

function ContributionStatus() {
  const total = MOCK_CONTRIBUTION_STATUS.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <section className="rounded-[24px] bg-white p-5 shadow-[0_8px_28px_-10px_rgba(23,107,120,0.22)] sm:p-6">

      <h2 className="mb-5 text-base font-semibold text-aira-primary">
        Status seluruh kontribusi
      </h2>

      {/* Diagram horizontal */}
      <div
        className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100"
        role="img"
        aria-label={`Total ${total} kontribusi`}
      >
        {MOCK_CONTRIBUTION_STATUS.map((item) => (
          <div
            key={item.id}
            style={{
              width: `${(item.value / total) * 100}%`,
              backgroundColor: item.color,
            }}
            title={`${item.label}: ${item.value}`}
          />
        ))}
      </div>

      {/* Keterangan diagram */}
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">

        {MOCK_CONTRIBUTION_STATUS.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 text-xs text-aira-text/70"
          >
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />

            <span>{item.label}</span>

            <span className="font-semibold text-aira-text">
              {item.value}
            </span>
          </div>
        ))}

      </div>

    </section>
  );
}

// ============================================
// 4. LABEL AKSI AUDIT
// ============================================

const actionStyles = {
  contribution: {
    label: "Kontribusi baru",
    className: "bg-[#F4EBDD] text-[#66543B]",
    icon: Plus,
  },

  verification: {
    label: "Verifikasi",
    className: "bg-[#DDF0E8] text-[#28735E]",
    icon: ShieldCheck,
  },

  edit: {
    label: "Edit titik air",
    className: "bg-[#E0EDF7] text-[#28658A]",
    icon: Pencil,
  },

  revision: {
    label: "Perlu perbaikan",
    className: "bg-[#FDF1D8] text-[#8A6414]",
    icon: Clock3,
  },

  rejected: {
    label: "Ditolak",
    className: "bg-[#F8E0D9] text-[#A3432D]",
    icon: XCircle,
  },
};

// ============================================
// 5. FILTER AUDIT
// ============================================

const filterOptions = [
  { label: "Semua", value: "all" },
  { label: "Verifikasi", value: "verification" },
  { label: "Edit titik air", value: "edit" },
  { label: "Kontribusi baru", value: "contribution" },
];

// ============================================
// 6. KOMPONEN TABEL AUDIT
// ============================================

function AuditLogTable() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredLogs = useMemo(() => {
    if (activeFilter === "all") {
      return MOCK_AUDIT_LOGS;
    }

    return MOCK_AUDIT_LOGS.filter(
      (item) => item.actionType === activeFilter
    );
  }, [activeFilter]);

  return (
    <section className="overflow-hidden rounded-[24px] bg-white shadow-[0_8px_28px_-10px_rgba(23,107,120,0.22)]">

      {/* Header */}
      <div className="flex flex-col gap-4 p-5 sm:p-6">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">
            <History className="size-5 text-aira-primary" />

            <h2 className="text-base font-semibold text-aira-primary">
              Jejak audit sistem
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                aria-pressed={activeFilter === filter.value}
                className={`
                  rounded-full border px-3 py-2
                  text-[11px] font-semibold
                  transition-all sm:text-xs
                  ${
                    activeFilter === filter.value
                      ? "border-aira-primary bg-aira-primary text-white"
                      : "border-aira-primary/20 bg-white text-aira-primary hover:bg-aira-sage/20"
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Tabel */}
      <div className="table-scroll px-5 pb-5 sm:px-6 sm:pb-6">

        <table className="w-full min-w-[720px] border-collapse text-left">

          <thead>
            <tr className="border-b border-aira-primary/10 text-[10px] font-semibold uppercase tracking-wider text-aira-text/45">

              <th className="px-2 py-3">Waktu</th>
              <th className="px-2 py-3">Pelaku</th>
              <th className="px-2 py-3">Aksi</th>
              <th className="px-2 py-3">Objek</th>
              <th className="px-2 py-3">Keterangan</th>

            </tr>
          </thead>

          <tbody>

            {filteredLogs.map((log) => {
              const action = actionStyles[log.actionType];
              const ActionIcon = action.icon;

              return (
                <tr
                  key={log.id}
                  className="border-b border-aira-primary/5 last:border-0 hover:bg-aira-bg/70"
                >

                  <td className="whitespace-nowrap px-2 py-4 align-top text-xs text-aira-text/65">
                    {log.date}, {log.time}
                  </td>

                  <td className="px-2 py-4 align-top text-xs font-medium text-aira-text">
                    {log.actor}
                  </td>

                  <td className="px-2 py-4 align-top">
                    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-medium ${action.className}`}>
                      <ActionIcon className="size-3" />
                      {action.label}
                    </span>
                  </td>

                  <td className="max-w-[200px] px-2 py-4 align-top text-xs font-medium leading-relaxed text-aira-primary">
                    {log.object}
                  </td>

                  <td className="max-w-[180px] px-2 py-4 align-top text-xs leading-relaxed text-aira-text/60">
                    {log.description}
                  </td>

                </tr>
              );
            })}

            {filteredLogs.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-aira-text/50"
                >
                  Tidak ada aktivitas untuk kategori ini.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

      {/* Informasi jumlah data */}
      <div className="border-t border-aira-primary/5 px-6 py-3">

        <p className="text-xs text-aira-text/50">
          Menampilkan {filteredLogs.length} dari {MOCK_AUDIT_LOGS.length} aktivitas
        </p>

      </div>

    </section>
  );
}

// ============================================
// 7. HALAMAN UTAMA DASHBOARD ADMIN
// ============================================

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-aira-bg">

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:gap-8 lg:px-8 lg:py-8">

        {/* SIDEBAR */}
        <AdminSidebar admin={MOCK_ADMIN} />

        {/* KONTEN UTAMA */}
        <div className="min-w-0 flex-1 space-y-6">

          {/* Judul */}
          <header className="space-y-2">

            <div className="flex items-center gap-2 text-xs font-medium text-aira-primary/65">
              <span>Panel Admin</span>
              <span>/</span>
              <span>Ringkasan & Riwayat</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-aira-primary sm:text-3xl">
              Ringkasan & Riwayat
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-aira-text/60">
              Pantau aktivitas pengelolaan data titik air,
              kontribusi warga, dan status verifikasi
              dalam satu halaman.
            </p>

          </header>

          {/* STATISTIK */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

            {MOCK_ADMIN_STATS.map((stat) => (
              <AdminStatCard
                key={stat.id}
                stat={stat}
              />
            ))}

          </section>

          {/* STATUS KONTRIBUSI */}
          <ContributionStatus />

          {/* RIWAYAT AKTIVITAS */}
          <AuditLogTable />

        </div>

      </div>

    </main>
  );
}