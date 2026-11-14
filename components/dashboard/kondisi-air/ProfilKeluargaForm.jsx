"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Field, Toggle, inputCls } from "@/components/dashboard/DashboardFormUi";
import { simpanProfilKeluarga } from "@/app/actions/dashboard";
import { SUMBER_AIR_PROFIL } from "@/lib/sumberAir";

// Formulir Profil keluarga. `awal` = nilai awal dari data keluarga (database).
export default function ProfilKeluargaForm({ awal }) {
  const [mhm, setMhm] = useState(awal.anggotaMhm > 0);
  const [perempuan, setPerempuan] = useState(String(awal.anggotaMhm));
  const [tersimpan, setTersimpan] = useState(false);
  const [galat, setGalat] = useState("");
  const [menyimpan, setMenyimpan] = useState(false);

  async function simpan(e) {
    e.preventDefault();
    if (menyimpan) return;

    const form = new FormData(e.currentTarget);
    const anggota = Number(form.get("members"));
    const usiaSubur = mhm ? Number(form.get("women")) : 0;
    const kapasitas = Number(form.get("capacity"));

    const tidakValid =
      !Number.isFinite(anggota) ||
      !Number.isFinite(usiaSubur) ||
      !Number.isFinite(kapasitas) ||
      anggota < 1 ||
      usiaSubur < 0 ||
      usiaSubur > anggota ||
      kapasitas < 0;

    if (tidakValid) {
      setGalat("Periksa jumlah anggota, perempuan usia subur, dan kapasitas tandon.");
      setTersimpan(false);
      return;
    }

    setGalat("");
    setMenyimpan(true);

    const hasil = await simpanProfilKeluarga({
      namaRumahTangga: String(form.get("household") || "").trim(),
      wilayahDesa: String(form.get("area") || "").trim(),
      anggota,
      anggotaMhm: usiaSubur,
      mhm,
      sumberAir: String(form.get("source") || ""),
      kapasitas,
    });

    setMenyimpan(false);

    if (!hasil?.ok) {
      setGalat(hasil?.error || "Profil keluarga belum dapat disimpan.");
      setTersimpan(false);
      return;
    }

    setTersimpan(true);
  }

  return (
    <form
      className="space-y-5 rounded-[28px] border border-aira-primary/5 bg-white p-6 shadow-soft sm:p-8"
      onSubmit={simpan}
      onChange={() => {
        setTersimpan(false);
        setGalat("");
      }}
    >
      <h2 className="text-xl font-semibold text-aira-primary">Profil keluarga</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama rumah tangga">
          <input name="household" required defaultValue={awal.namaRumahTangga} className={inputCls} />
        </Field>
        <Field label="Desa / kelurahan dan kecamatan">
          <input name="area" required defaultValue={awal.wilayahDesa} className={inputCls} />
        </Field>
        <Field label="Jumlah anggota keluarga" hint="Isi jumlah orang yang tinggal dalam rumah tangga.">
          <input name="members" type="number" min={1} required defaultValue={awal.anggota ?? ""} className={inputCls} />
        </Field>
        <Field
          label="Perempuan usia subur"
          hint={mhm ? "Opsional; digunakan bila kebutuhan MHM disertakan." : "Aktifkan kebutuhan MHM untuk mengisi"}
        >
          <input
            name="women"
            type="number"
            min={0}
            value={mhm ? perempuan : "0"}
            disabled={!mhm}
            onChange={(e) => setPerempuan(e.target.value)}
            className={`${inputCls} ${mhm ? "" : "cursor-not-allowed bg-aira-sand/60 text-aira-text/50"}`}
          />
        </Field>
        <Field label="Sumber air utama">
          <select name="source" defaultValue={awal.sumberAirUtama} className={inputCls}>
            {SUMBER_AIR_PROFIL.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Kapasitas tandon (liter)" hint="Isi 0 bila rumah tangga tidak menggunakan tandon.">
          <input
            name="capacity"
            type="number"
            min={0}
            defaultValue={awal.kapasitasTandonLiter}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="flex items-center gap-4 rounded-2xl bg-aira-warm p-5">
        <div className="flex-1">
          <p className="text-[15px] font-semibold">Sertakan kebutuhan MHM</p>
          <p className="mt-1 text-sm text-aira-text/70">Menambah 5 liter per orang per hari pada perhitungan.</p>
        </div>
        <Toggle on={mhm} onChange={setMhm} label="Sertakan kebutuhan MHM" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={menyimpan}
          className="min-h-[52px] w-full rounded-full bg-aira-primary px-8 py-3.5 font-semibold text-white shadow-soft transition-colors hover:bg-aira-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {menyimpan ? "Menyimpan..." : "Simpan Profil"}
        </button>
        {tersimpan && (
          <span className="inline-flex items-center gap-2 font-medium text-aira-primary" role="status">
            <CheckCircle2 className="size-5" /> Profil keluarga tersimpan
          </span>
        )}
        {galat && (
          <span className="text-sm font-medium text-aira-danger-dark" role="alert">
            {galat}
          </span>
        )}
      </div>

      <p className="text-xs text-aira-text/60">
        Perubahan profil tidak mengubah hasil perhitungan yang sudah tersimpan dalam riwayat.
      </p>
    </form>
  );
}