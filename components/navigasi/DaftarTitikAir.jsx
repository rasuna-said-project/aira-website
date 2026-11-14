"use client";

import { useEffect, useMemo, useState } from "react";
import { Info, Search, SlidersHorizontal, X } from "lucide-react";
import Combobox from "@/components/navigasi/Combobox";
import KartuTitikAir from "@/components/navigasi/KartuTitikAir";
import { getTitikAirPublikAction } from "@/app/actions/navigasi-air";
import {
  JENIS_SEMUA,
  JENIS_TITIK_AIR,
  cariTitikAir,
} from "@/lib/titikAir";

export default function DaftarTitikAir() {
  const [kataKunci, setKataKunci] = useState("");
  const [jenis, setJenis] = useState(JENIS_SEMUA);
  const [adaAirSaja, setAdaAirSaja] = useState(false);
  const [provinsi, setProvinsi] = useState("");
  const [kabupaten, setKabupaten] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [panel, setPanel] = useState(false);

  const [titikAir, setTitikAir] = useState([]);

  const [wilayah, setWilayah] = useState({
    provinces: [],
    regencies: [],
    districts: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mengambil data titik air publik dan data wilayah dari Supabase.
  useEffect(() => {
    let aktif = true;

    async function muatData() {
      try {
        setLoading(true);
        setError("");

        const result = await getTitikAirPublikAction();

        if (!aktif) return;

        if (!result?.success) {
          setError(
            result?.message || "Gagal memuat data titik air."
          );

          setTitikAir([]);
          setWilayah({
            provinces: [],
            regencies: [],
            districts: [],
          });

          return;
        }

        setTitikAir(
          Array.isArray(result.data) ? result.data : []
        );

        setWilayah({
          provinces: Array.isArray(result.wilayah?.provinces)
            ? result.wilayah.provinces
            : [],

          regencies: Array.isArray(result.wilayah?.regencies)
            ? result.wilayah.regencies
            : [],

          districts: Array.isArray(result.wilayah?.districts)
            ? result.wilayah.districts
            : [],
        });
      } catch (error) {
        console.error("Gagal memuat data Navigasi Air:", error);

        if (aktif) {
          setError(
            "Terjadi kesalahan saat memuat data titik air. Silakan coba kembali."
          );

          setTitikAir([]);
          setWilayah({
            provinces: [],
            regencies: [],
            districts: [],
          });
        }
      } finally {
        if (aktif) {
          setLoading(false);
        }
      }
    }

    muatData();

    return () => {
      aktif = false;
    };
  }, []);

  // Mencari data provinsi yang dipilih.
  const dataProvinsi = wilayah.provinces.find(
    (item) => item.province_name === provinsi
  );

  // Mencari data kabupaten/kota berdasarkan provinsi.
  const dataKabupaten = wilayah.regencies.find(
    (item) =>
      item.city_regency_name === kabupaten &&
      Number(item.provinces_id) ===
        Number(dataProvinsi?.province_id)
  );

  // Menampilkan kabupaten/kota sesuai provinsi yang dipilih.
  const opsiKabupaten = wilayah.regencies
    .filter(
      (item) =>
        Number(item.provinces_id) ===
        Number(dataProvinsi?.province_id)
    )
    .map((item) => item.city_regency_name);

  // Menampilkan kecamatan sesuai kabupaten/kota yang dipilih.
  const opsiKecamatan = wilayah.districts
    .filter(
      (item) =>
        Number(item.city_regency_id) ===
        Number(dataKabupaten?.city_regency_id)
    )
    .map((item) => item.district_name);

  const diketik = kataKunci.trim();

  // Memproses pencarian dan seluruh filter.
  const hasil = useMemo(
    () =>
      cariTitikAir(titikAir, {
        kataKunci,
        jenis,
        adaAirSaja,
        provinsi,
        kabupaten,
        kecamatan,
      }),
    [
      titikAir,
      kataKunci,
      jenis,
      adaAirSaja,
      provinsi,
      kabupaten,
      kecamatan,
    ]
  );

  const adaKecocokanWilayah = hasil.some(
    (item) => item.tingkat !== null
  );

  // Menentukan apakah pengguna sedang menggunakan filter.
  const adaFilterAktif =
    Boolean(diketik) ||
    jenis !== JENIS_SEMUA ||
    adaAirSaja ||
    Boolean(provinsi) ||
    Boolean(kabupaten) ||
    Boolean(kecamatan);

  // Daftar filter aktif untuk ditampilkan sebagai chip.
  const chips = [
    ...(diketik
      ? [
          {
            label: `Kata kunci: ${diketik}`,
            hapus: () => setKataKunci(""),
          },
        ]
      : []),

    ...(jenis !== JENIS_SEMUA
      ? [
          {
            label: jenis,
            hapus: () => setJenis(JENIS_SEMUA),
          },
        ]
      : []),

    ...(adaAirSaja
      ? [
          {
            label: "Ada air saja",
            hapus: () => setAdaAirSaja(false),
          },
        ]
      : []),

    ...(provinsi
      ? [
          {
            label: `Provinsi: ${provinsi}`,
            hapus: () => {
              setProvinsi("");
              setKabupaten("");
              setKecamatan("");
            },
          },
        ]
      : []),

    ...(kabupaten
      ? [
          {
            label: `Kab/Kota: ${kabupaten}`,
            hapus: () => {
              setKabupaten("");
              setKecamatan("");
            },
          },
        ]
      : []),

    ...(kecamatan
      ? [
          {
            label: `Kecamatan: ${kecamatan}`,
            hapus: () => setKecamatan(""),
          },
        ]
      : []),
  ];

  // Menghapus seluruh filter.
  const reset = () => {
    setKataKunci("");
    setJenis(JENIS_SEMUA);
    setAdaAirSaja(false);
    setProvinsi("");
    setKabupaten("");
    setKecamatan("");
  };

  const jumlahFilterWilayah = [
    provinsi,
    kabupaten,
    kecamatan,
  ].filter(Boolean).length;

  const kolomTeks =
    "w-full min-h-[52px] rounded-2xl border border-aira-primary/20 bg-white px-4 py-3.5 focus:border-aira-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-aira-primary/30";

  return (
    <div className="min-h-[calc(100vh-72px)] bg-aira-bg">
      <div className="fade-up mx-auto max-w-[1240px] px-4 py-10 sm:px-5 sm:py-16">
        <h1 className="text-3xl font-bold leading-tight text-aira-primary sm:text-[2.5rem]">
          Daftar Titik Air
        </h1>

        <p className="mt-3 max-w-2xl text-aira-text/80">
          Cari titik air alternatif berdasarkan nama atau wilayah.
          Status verifikasi dan ketersediaan ditampilkan terpisah.
        </p>

        {/* Pencarian dan filter */}
        <div className="mt-8 space-y-4 rounded-3xl border border-aira-primary/5 bg-white p-4 shadow-soft sm:p-5">
          <div className="grid items-center gap-3 md:grid-cols-[1fr_220px_auto]">
            <label className="relative">
              <span className="sr-only">
                Cari nama titik air atau wilayah
              </span>

              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-aira-primary" />

              <input
                value={kataKunci}
                onChange={(e) => setKataKunci(e.target.value)}
                placeholder="Cari nama titik air atau wilayah (misal: Rongkop)"
                className={`${kolomTeks} pl-12`}
              />
            </label>

            <label>
              <span className="sr-only">Jenis sumber</span>

              <select
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                className={kolomTeks}
              >
                {JENIS_TITIK_AIR.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPanel(!panel)}
                aria-expanded={panel}
                aria-controls="filter-wilayah"
                className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-aira-primary/25 px-5 font-semibold text-aira-primary hover:bg-aira-primary/10 md:hidden"
              >
                <SlidersHorizontal className="size-4" />

                Filter
                {jumlahFilterWilayah > 0
                  ? ` (${jumlahFilterWilayah})`
                  : ""}
              </button>

              <button
                type="button"
                onClick={() => setAdaAirSaja(!adaAirSaja)}
                aria-pressed={adaAirSaja}
                className={`min-h-[52px] flex-1 rounded-2xl border-2 px-5 font-semibold transition-colors md:flex-none ${
                  adaAirSaja
                    ? "border-aira-primary bg-aira-primary text-white"
                    : "border-aira-primary/25 text-aira-primary hover:bg-aira-primary/10"
                }`}
              >
                Ada air saja
              </button>
            </div>
          </div>

          {/* Filter wilayah */}
          <div
            id="filter-wilayah"
            className={`${
              panel ? "grid" : "hidden"
            } gap-4 md:grid md:grid-cols-3`}
          >
            <Combobox
              label="Provinsi"
              placeholder="Pilih provinsi"
              options={wilayah.provinces.map(
                (item) => item.province_name
              )}
              value={provinsi}
              onSelect={(nama) => {
                setProvinsi(nama);
                setKabupaten("");
                setKecamatan("");
              }}
            />

            <Combobox
              label="Kabupaten / Kota"
              placeholder="Pilih kabupaten / kota"
              options={opsiKabupaten}
              value={kabupaten}
              disabled={!provinsi}
              hint="Pilih provinsi dahulu"
              onSelect={(nama) => {
                setKabupaten(nama);
                setKecamatan("");
              }}
            />

            <Combobox
              label="Kecamatan"
              placeholder="Pilih kecamatan"
              options={opsiKecamatan}
              value={kecamatan}
              disabled={!kabupaten}
              hint="Pilih kabupaten / kota dahulu"
              onSelect={setKecamatan}
            />
          </div>

          {/* Filter aktif */}
          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.hapus}
                  aria-label={`Hapus filter ${chip.label}`}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-aira-sage/40 px-3.5 text-sm font-medium text-aira-primary-dark hover:bg-aira-sage/60 focus-visible:ring-2 focus-visible:ring-aira-primary/30"
                >
                  {chip.label}
                  <X className="size-3.5" />
                </button>
              ))}

              <button
                type="button"
                onClick={reset}
                className="min-h-[44px] px-2 text-sm font-semibold text-aira-primary underline"
              >
                Reset filter
              </button>
            </div>
          )}
        </div>

        {/* Informasi untuk pengguna */}
        <div className="mt-5 flex gap-3 rounded-2xl border border-aira-secondary/30 bg-white/70 p-4 text-sm text-aira-text/80">
          <Info className="mt-0.5 size-5 shrink-0 text-aira-secondary" />

          <p>
            Status <b>Terverifikasi</b> berarti data lokasi sudah
            ditinjau admin. Itu tidak menjamin air sedang mengalir
            atau aman diminum. Selalu cek waktu pembaruan terakhir.
          </p>
        </div>

        {/* Jumlah hasil */}
        <p
          className="mt-8 text-sm text-aira-text/70"
          aria-live="polite"
        >
          {loading
            ? "Memuat data titik air..."
            : `${hasil.length} titik air ditemukan${
                diketik ? ` untuk '${diketik}'` : ""
              }${
                adaKecocokanWilayah
                  ? " · Diurutkan berdasarkan kecocokan wilayah"
                  : ""
              }`}
        </p>

        {/* Pesan error */}
        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Daftar titik air */}
        {!loading && !error && (
          <>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {hasil.map(({ titik, tingkat }) => (
                <KartuTitikAir
                  key={titik.id}
                  titik={titik}
                  tingkat={tingkat}
                />
              ))}
            </div>

            {/* Tampilan ketika tidak ada hasil */}
            {hasil.length === 0 && (
              <div className="mt-6 rounded-3xl bg-white p-10 text-center shadow-soft">
                <p className="font-heading text-xl font-semibold text-aira-primary">
                  {adaFilterAktif
                    ? "Tidak ada titik air yang sesuai"
                    : "Belum ada titik air terverifikasi"}
                </p>

                <p className="mt-2 text-aira-text/70">
                  {adaFilterAktif
                    ? "Coba ubah kata kunci atau filter pencarian untuk menemukan titik air lainnya."
                    : "Belum tersedia titik air aktif yang telah diverifikasi admin. Kamu dapat mencoba kembali nanti."}
                </p>

                {adaFilterAktif && (
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-5 min-h-[48px] rounded-full bg-aira-primary px-6 py-3 font-semibold text-white hover:bg-aira-primary-dark"
                  >
                    Reset filter
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}