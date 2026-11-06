"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, CloudRain, Container, Droplet, Home, MapPin, Users } from "lucide-react";
import FieldLabel from "@/components/kalkulator/FieldLabel";
import RegionSelect from "@/components/kalkulator/RegionSelect";
import Stepper from "@/components/kalkulator/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hitungKalkulator } from "@/app/actions/kalkulator";
import { cariCurahHujan } from "@/data/curahHujan";
import { simpanHasilKalkulator } from "@/lib/hasilKalkulator";
import {
  BASIC_PER_ORANG,
  INPUT_AWAL,
  KONDISI_SUMBER_AIR,
  MAX_ANGGOTA,
  MAX_LUAS_ATAP_M2,
  MHM_PER_ORANG,
  SUMBER_AIR,
  hitungVolumeSaatIni,
  validasiInput,
} from "@/services/calculatorFormService";

const kolom =
  "h-[52px] rounded-2xl border-aira-primary/20 bg-white px-4 text-base focus-visible:border-aira-primary focus-visible:ring-aira-secondary/30 md:text-base";
const pesanError = "mt-1 block text-sm text-aira-coral-dark";

export default function KalkulatorForm() {
  const router = useRouter();
  const [value, setValue] = useState(INPUT_AWAL);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gagal, setGagal] = useState("");

  const set = (key, val) => setValue((current) => ({ ...current, [key]: val }));
  const { errors } = validasiInput(value);
  const kapasitasError =
    touched || (value.kapasitas !== "" && value.kapasitas !== "0") ? errors.kapasitas : undefined;
  const luasAtapError = value.luasAtap !== "" ? errors.luasAtap : undefined;

  const volume = hitungVolumeSaatIni(value.kapasitas, value.persen);
  const adaKapasitas = Number(value.kapasitas) > 0;
  const curahHujan = cariCurahHujan(value.lokasi);
  const luasAtap = Number(value.luasAtap) || 0;
  const kebutuhanDasar = value.anggota * BASIC_PER_ORANG;
  const tambahanMhm = value.mhm ? value.anggotaMhm * MHM_PER_ORANG : 0;

  const ubahAnggota = (n) =>
    setValue((current) => ({
      ...current,
      anggota: n,
      // Tanpa anggota, MHM dimatikan. Jika tidak, jumlah anggota MHM tidak boleh melebihi anggota keluarga.
      mhm: n === 0 ? false : current.mhm,
      anggotaMhm: n === 0 || !current.mhm ? 0 : Math.max(1, Math.min(current.anggotaMhm, n)),
    }));

  const ubahMhm = () =>
    setValue((current) => ({
      ...current,
      mhm: !current.mhm,
      anggotaMhm: current.mhm ? 0 : Math.max(1, Math.min(current.anggotaMhm || 1, current.anggota)),
    }));

  async function handleSubmit(event) {
    event.preventDefault();
    setTouched(true);
    setGagal("");
    setLoading(true);
    try {
      // Perhitungan dijalankan di server. Data tidak valid menghasilkan status "Belum Dapat Ditentukan".
      const hasil = await hitungKalkulator(value);
      simpanHasilKalkulator(value, hasil);
      router.push("/kalkulator-air/hasil");
    } catch {
      setGagal("Perhitungan belum berhasil dijalankan. Periksa koneksi Anda lalu coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-aira-bg">
      <div
        className="absolute -right-24 -top-20 size-90 rounded-[55%_45%_40%_60%] bg-aira-sage/40 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute -left-24 bottom-0 size-80 rounded-[40%_60%_55%_45%] bg-aira-peach/25 blur-2xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-180 px-4 py-10 sm:px-5 sm:py-16">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight text-aira-primary sm:text-[2.5rem]">
            Kalkulator Ketahanan Air
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-aira-text/80">
            Isi data rumah tangga Anda. Hasilnya berupa estimasi berapa hari cadangan air akan bertahan, ditambah
            potensi panen air hujan.
          </p>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="space-y-8 rounded-[28px] border border-aira-primary/5 bg-white p-5 shadow-soft sm:p-9"
        >
          <div>
            <FieldLabel icon={MapPin} badge="Opsional">
              Lokasi / Wilayah Tempat Tinggal
            </FieldLabel>
            <RegionSelect value={value.lokasi} onChange={(v) => set("lokasi", v)} />
            <p className="mt-2 text-sm text-aira-text/65">
              Dipakai untuk menentukan data curah hujan wilayah Anda secara otomatis.
            </p>
            <p className="mt-1 text-sm text-aira-text/65">Data curah hujan bersifat simulasi.</p>
          </div>

          <div>
            <FieldLabel icon={Users} badge="Wajib">
              Jumlah Anggota Keluarga
            </FieldLabel>
            <Stepper
              value={value.anggota}
              min={0}
              max={MAX_ANGGOTA}
              label="Jumlah anggota keluarga"
              onChange={ubahAnggota}
              editable
            />
            {value.anggota === 0 && (
              <p className="mt-2 text-sm text-aira-text/65">Isi minimal 1 anggota keluarga.</p>
            )}
          </div>

          <fieldset className="space-y-4">
            <legend className="sr-only">Sumber dan kondisi air utama</legend>
            <label className="block">
              <FieldLabel icon={Droplet} badge="Wajib">
                Sumber Air Utama
              </FieldLabel>
              <select
                value={value.sumberAir}
                onChange={(e) => set("sumberAir", e.target.value)}
                className="h-13 w-full rounded-2xl border border-aira-primary/20 bg-white px-4 text-base transition-colors focus:border-aira-primary focus:outline-none"
              >
                {SUMBER_AIR.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <div role="radiogroup" aria-label="Kondisi sumber air">
              <span className="mb-2 block text-[15px] font-semibold">Kondisi Sumber Air</span>
              <div className="flex flex-wrap gap-2.5">
                {KONDISI_SUMBER_AIR.map((k) => {
                  const aktif = value.kondisi === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      role="radio"
                      aria-checked={aktif}
                      onClick={() => set("kondisi", k)}
                      className={`inline-flex min-h-12 items-center gap-2 rounded-full border px-5 py-2.5 font-medium transition-colors ${
                        aktif
                          ? "border-aira-primary bg-aira-primary text-white"
                          : "border-aira-primary/25 bg-white text-aira-text hover:bg-aira-primary/10"
                      }`}
                    >
                      {aktif && <Check className="size-4" />} {k}
                    </button>
                  );
                })}
              </div>
            </div>
          </fieldset>

          <div className="space-y-6">
            <label className="block">
              <FieldLabel icon={Container} badge="Wajib">
                Kapasitas Tandon / Penampungan (Liter)
              </FieldLabel>
              <Input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={value.kapasitas}
                onFocus={(e) => e.target.select()}
                onChange={(e) => set("kapasitas", e.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, ""))}
                onBlur={() => {
                  if (value.kapasitas === "") set("kapasitas", "0");
                }}
                aria-invalid={!!kapasitasError}
                placeholder="Contoh: 1000"
                className={`${kolom} aria-invalid:border-aira-peach`}
              />
              {kapasitasError && (
                <span className={pesanError} role="alert">
                  {kapasitasError}
                </span>
              )}
            </label>
            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-[15px] font-semibold">
                  <Droplet className="size-4 text-aira-secondary" aria-hidden="true" /> Volume Air Saat Ini
                </span>
                <span
                  className="rounded-full bg-aira-secondary/15 px-3.5 py-1.5 font-heading font-bold text-aira-primary-dark"
                  aria-live="polite"
                >
                  {value.persen}%{" "}
                  {adaKapasitas ? `≈ ${volume.toLocaleString("id-ID", { maximumFractionDigits: 2 })} Liter` : ""}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={value.persen}
                onChange={(e) => set("persen", Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-aira-primary"
                aria-label="Volume air saat ini"
              />
              <div className="mt-1 flex justify-between text-xs text-aira-text/65">
                <span>Kosong</span>
                <span>{adaKapasitas ? "" : "Isi kapasitas dahulu"}</span>
                <span>Penuh</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-aira-sand p-5">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-[15px] font-semibold">
                  Kebutuhan Kebersihan Menstruasi (MHM){" "}
                  <span className="ml-1 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-aira-text/70">
                    Opsional
                  </span>
                </p>
                <p className="mt-1 text-sm text-aira-text/70">
                  Tambahan kebutuhan air sebesar {MHM_PER_ORANG} liter/orang/hari untuk setiap anggota keluarga yang
                  membutuhkan MHM.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={value.mhm}
                aria-label="Sertakan kebutuhan MHM"
                disabled={value.anggota === 0}
                onClick={ubahMhm}
                className={`relative h-8 w-14 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  value.mhm ? "bg-aira-primary" : "bg-aira-text/25"
                }`}
              >
                <span
                  className={`absolute top-1 size-6 rounded-full bg-white shadow transition-all ${
                    value.mhm ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
            {value.mhm && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-aira-text/10 pt-5">
                <span className="max-w-75 text-[15px] font-medium">
                  Jumlah anggota keluarga yang sedang mengalami menstruasi
                </span>
                <Stepper
                  value={value.anggotaMhm}
                  min={1}
                  max={value.anggota}
                  label="Jumlah anggota yang sedang menstruasi"
                  onChange={(n) => set("anggotaMhm", n)}
                />
              </div>
            )}
            <div className="mt-5 space-y-1 rounded-xl bg-white/70 px-4 py-3 text-sm text-aira-text/75" aria-live="polite">
              <p>
                Kebutuhan dasar: {BASIC_PER_ORANG} liter/orang/hari x {value.anggota} orang ={" "}
                <strong>{kebutuhanDasar} L</strong>
              </p>
              {value.mhm && (
                <p>
                  + MHM: {MHM_PER_ORANG} liter/orang/hari x {value.anggotaMhm} orang = <strong>{tambahanMhm} L</strong>
                </p>
              )}
              <p>
                Total kebutuhan: <strong className="text-aira-primary">{kebutuhanDasar + tambahanMhm} L/hari</strong>
              </p>
            </div>
          </div>

          <section className="rounded-3xl border-2 border-aira-sage bg-aira-sage/15 p-6 sm:p-7" aria-labelledby="rain-h">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-aira-sage">
                <CloudRain className="size-6 text-aira-primary-dark" />
              </span>
              <div>
                <h2 id="rain-h" className="font-heading text-xl font-bold leading-tight text-aira-primary">
                  Potensi Panen Air Hujan
                </h2>
                <p className="text-sm text-aira-text/70">Seberapa banyak air yang bisa Anda tampung dari atap rumah.</p>
              </div>
            </div>
            <label className="mt-5 block">
              <FieldLabel icon={Home} badge="Opsional">
                Luas Atap Rumah (m²)
              </FieldLabel>
              <Input
                type="number"
                min={0}
                max={MAX_LUAS_ATAP_M2}
                inputMode="numeric"
                value={value.luasAtap}
                onChange={(e) => set("luasAtap", e.target.value)}
                aria-invalid={!!luasAtapError}
                placeholder="Contoh: 36"
                className={`${kolom} aria-invalid:border-aira-peach`}
              />
              {luasAtapError && (
                <span className={pesanError} role="alert">
                  {luasAtapError}
                </span>
              )}
            </label>
            <p className="mt-3 flex gap-2 text-sm text-aira-text/75">
              <CloudRain className="mt-0.5 size-4 shrink-0 text-aira-primary" aria-hidden="true" />
              <span>
                {value.lokasi && curahHujan != null ? (
                  <>
                    Curah hujan dihitung otomatis dari lokasi Anda (<strong>{value.lokasi}</strong>, {curahHujan}{" "}
                    mm/bulan, data simulasi).
                  </>
                ) : (
                  <>Pilih lokasi untuk menghitung estimasi panen air hujan.</>
                )}
                {luasAtap > 0 && curahHujan != null && <> Estimasi panen hujan tampil di halaman hasil.</>}
              </span>
            </p>
          </section>

          {gagal && (
            <p
              role="alert"
              className="rounded-2xl bg-aira-peach/20 px-4 py-3 text-sm font-medium text-aira-danger-dark"
            >
              {gagal}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="group h-14 w-full rounded-full bg-aira-primary px-8 text-lg font-semibold text-white shadow-soft hover:bg-aira-primary-dark"
          >
            {loading ? "Menghitung…" : "Hitung Ketahanan Air"}
            {!loading && <ArrowRight className="transition-transform group-hover:translate-x-1" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
