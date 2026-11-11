"use client";

import { useState } from "react";
import { Clock, Info } from "lucide-react";

import Overlay from "@/components/admin/titik-air/Overlay";
import { VerificationBadge } from "@/components/StatusBadge";
import { Field, inputCls } from "@/components/dashboard/DashboardFormUi";

export const KETERSEDIAAN = ["Tersedia", "Terbatas", "Tidak Tersedia", "Belum Diketahui"];
const SUMBER_PEMBARUAN = ["Pantauan langsung admin", "Pengelola setempat", "Laporan warga", "Lainnya"];

// Panel "Edit titik air" (Figma C03). Dipasang dengan key = id titik, jadi isian selalu mulai dari data titik terpilih.
export default function PanelEditTitikAir({ titik, onClose, onSimpan }) {
  const [nama, setNama] = useState(titik.name);
  const [alamat, setAlamat] = useState(titik.address);
  const [ketersediaan, setKetersediaan] = useState(titik.availability);
  const [jam, setJam] = useState(titik.hours);
  const [catatan, setCatatan] = useState(titik.note);
  const [sumber, setSumber] = useState("");

  const berikutnya = {
    name: nama.trim(),
    address: alamat.trim(),
    availability: ketersediaan,
    hours: jam.trim() || "Belum diketahui",
    note: catatan.trim(),
  };
  const berubah =
    berikutnya.name !== titik.name ||
    berikutnya.address !== titik.address ||
    berikutnya.availability !== titik.availability ||
    berikutnya.hours !== titik.hours ||
    berikutnya.note !== titik.note;
  const bisaSimpan = berubah && !!berikutnya.name && !!berikutnya.address && !!sumber;

  const adaKoordinat = typeof titik.latitude === "number" && typeof titik.longitude === "number";

  return (
    <Overlay onClose={onClose} title="Edit titik air">
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!bisaSimpan) return;
          onSimpan(titik.id, berikutnya, sumber);
        }}
      >
        <div>
          <h3 className="font-heading text-xl font-bold leading-snug text-aira-primary">{titik.name}</h3>
          <p className="text-sm text-aira-text/65">
            {titik.type}, {titik.area}
          </p>
          <div className="mt-3">
            <VerificationBadge v="Terverifikasi" />
          </div>
        </div>
        <p className="flex items-center gap-2 text-sm text-aira-text/70">
          <Clock className="size-4" /> Terakhir diperbarui {titik.updated.replace(/^Diperbarui\s*/, "")}
        </p>

        <dl className="space-y-2 rounded-2xl bg-aira-bg p-4 text-sm">
          <div>
            <dt className="font-semibold">Alamat lengkap</dt>
            <dd className="text-aira-text/80">{titik.address || "Informasi alamat belum tersedia"}</dd>
          </div>
          <div>
            <dt className="font-semibold">Pengelola / kontak</dt>
            <dd className="text-aira-text/80">
              {[titik.provider, titik.contact].filter(Boolean).join(", ") || "Belum tersedia"}
              {titik.phone ? ` (${titik.phone})` : ""}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Koordinat</dt>
            <dd className="text-aira-text/80">
              {adaKoordinat
                ? `${titik.latitude.toFixed(4)}, ${titik.longitude.toFixed(4)}`
                : "Koordinat belum tersedia"}
            </dd>
          </div>
        </dl>

        <Field label="Nama titik air">
          <input value={nama} onChange={(e) => setNama(e.target.value)} required className={inputCls} />
        </Field>
        <Field label="Alamat / lokasi">
          <input value={alamat} onChange={(e) => setAlamat(e.target.value)} required className={inputCls} />
        </Field>

        <Field label="Ketersediaan air">
          <div className="grid grid-cols-2 gap-2">
            {KETERSEDIAAN.map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => setKetersediaan(k)}
                aria-pressed={ketersediaan === k}
                className={`min-h-[48px] rounded-2xl border-2 px-3 py-3 text-sm font-semibold transition-colors ${
                  ketersediaan === k
                    ? "border-aira-primary bg-aira-primary/10 text-aira-primary"
                    : "border-aira-primary/15 hover:bg-aira-bg"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Jam operasional">
          <input
            value={jam}
            onChange={(e) => setJam(e.target.value)}
            className={inputCls}
            placeholder="Contoh: Setiap hari, 06.00 - 18.00 WIB"
          />
        </Field>
        <Field label="Catatan akses">
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            rows={3}
            className={inputCls}
            placeholder="Biaya, antrean, atau aturan penggunaan"
          />
        </Field>
        <Field label="Sumber pembaruan" hint="Pilih dasar informasi perubahan ini.">
          <select value={sumber} onChange={(e) => setSumber(e.target.value)} required className={inputCls}>
            <option value="">Pilih sumber</option>
            {SUMBER_PEMBARUAN.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>

        <p className="flex gap-2 rounded-2xl bg-aira-sand p-4 text-sm leading-relaxed">
          <Info className="mt-0.5 size-4 shrink-0 text-aira-primary" /> Waktu pembaruan akan dicatat otomatis dan
          perubahan ini masuk ke jejak audit.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={!bisaSimpan}
            className="min-h-[52px] w-full rounded-full bg-aira-primary px-8 py-3.5 font-semibold text-white shadow-soft transition-colors hover:bg-aira-primary-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-aira-primary sm:w-auto"
          >
            Simpan Perubahan
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[52px] w-full rounded-full px-6 py-3.5 font-semibold text-aira-primary hover:bg-aira-primary/10 sm:w-auto"
          >
            Batal
          </button>
        </div>
      </form>
    </Overlay>
  );
}
