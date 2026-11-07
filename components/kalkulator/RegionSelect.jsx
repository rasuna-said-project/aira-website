
"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

const API_BASE =
  "https://www.emsifa.com/api-wilayah-indonesia/v2";

const kolomLokasi =
  "h-[52px] w-full rounded-2xl border border-aira-primary/20 bg-white px-4 text-base text-aira-text transition-colors focus:border-aira-primary focus:outline-none focus:ring-2 focus:ring-aira-secondary/30 disabled:cursor-not-allowed disabled:bg-aira-bg disabled:text-aira-text/40";

async function ambilWilayah(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Data wilayah gagal dimuat.");
  }

  const result = await response.json();

  return result.data || [];
}

export default function RegionSelect({ value = "", onChange }) {
  const [provinsi, setProvinsi] = useState([]);
  const [kabupaten, setKabupaten] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);

  const [provinsiId, setProvinsiId] = useState("");
  const [kabupatenId, setKabupatenId] = useState("");
  const [kecamatanId, setKecamatanId] = useState("");

  const [loadingProvinsi, setLoadingProvinsi] = useState(true);
  const [loadingKabupaten, setLoadingKabupaten] = useState(false);
  const [loadingKecamatan, setLoadingKecamatan] = useState(false);

  const [error, setError] = useState("");

  // Mencegah perubahan pilihan pengguna dianggap sebagai
  // perubahan eksternal yang harus memulihkan data lagi.
  const perubahanInternal = useRef(null);

  // ==========================================
  // 1. MENGAMBIL DATA PROVINSI
  // ==========================================

  useEffect(() => {
    let aktif = true;

    async function muatProvinsi() {
      try {
        setLoadingProvinsi(true);
        setError("");

        const data = await ambilWilayah(
          `${API_BASE}/provinces.json`
        );

        if (aktif) {
          setProvinsi(data);
        }
      } catch {
        if (aktif) {
          setError("Data provinsi gagal dimuat. Periksa koneksi internet.");
        }
      } finally {
        if (aktif) {
          setLoadingProvinsi(false);
        }
      }
    }

    muatProvinsi();

    return () => {
      aktif = false;
    };
  }, []);

  // ==========================================
  // 2. MEMULIHKAN LOKASI YANG SUDAH TERSIMPAN
  // ==========================================

  useEffect(() => {
    if (!provinsi.length) return;

    // Jika perubahan berasal dari pilihan pengguna,
    // tidak perlu melakukan pemulihan ulang.
    if (perubahanInternal.current === value) {
      perubahanInternal.current = null;
      return;
    }

    if (!value) return;

    let aktif = true;

    async function pulihkanLokasi() {
      try {
        const bagian = value
          .split(",")
          .map((item) => item.trim());

        if (bagian.length !== 3) return;

        const [namaKecamatan, namaKabupaten, namaProvinsi] =
          bagian;

        const dataProvinsi = provinsi.find(
          (item) => item.name === namaProvinsi
        );

        if (!dataProvinsi) return;

        setProvinsiId(dataProvinsi.id);

        const dataKabupaten = await ambilWilayah(
          `${API_BASE}/regencies/${dataProvinsi.id}.json`
        );

        if (!aktif) return;

        setKabupaten(dataKabupaten);

        const dataKabupatenTerpilih = dataKabupaten.find(
          (item) => item.name === namaKabupaten
        );

        if (!dataKabupatenTerpilih) return;

        setKabupatenId(dataKabupatenTerpilih.id);

        const dataKecamatan = await ambilWilayah(
          `${API_BASE}/districts/${dataKabupatenTerpilih.id}.json`
        );

        if (!aktif) return;

        setKecamatan(dataKecamatan);

        const dataKecamatanTerpilih = dataKecamatan.find(
          (item) => item.name === namaKecamatan
        );

        if (dataKecamatanTerpilih) {
          setKecamatanId(dataKecamatanTerpilih.id);
        }
      } catch {
        if (aktif) {
          setError("Lokasi sebelumnya gagal dipulihkan.");
        }
      }
    }

    pulihkanLokasi();

    return () => {
      aktif = false;
    };
  }, [provinsi, value]);

  // ==========================================
  // 3. MEMILIH PROVINSI
  // ==========================================

  async function pilihProvinsi(id) {
    setProvinsiId(id);

    setKabupatenId("");
    setKecamatanId("");

    setKabupaten([]);
    setKecamatan([]);

    setError("");

    perubahanInternal.current = "";

    onChange("");

    if (!id) return;

    try {
      setLoadingKabupaten(true);

      const data = await ambilWilayah(
        `${API_BASE}/regencies/${id}.json`
      );

      setKabupaten(data);
    } catch {
      setError("Kabupaten/kota gagal dimuat.");
    } finally {
      setLoadingKabupaten(false);
    }
  }

  // ==========================================
  // 4. MEMILIH KABUPATEN / KOTA
  // ==========================================

  async function pilihKabupaten(id) {
    setKabupatenId(id);

    setKecamatanId("");
    setKecamatan([]);

    setError("");

    perubahanInternal.current = "";

    onChange("");

    if (!id) return;

    try {
      setLoadingKecamatan(true);

      const data = await ambilWilayah(
        `${API_BASE}/districts/${id}.json`
      );

      setKecamatan(data);
    } catch {
      setError("Kecamatan gagal dimuat.");
    } finally {
      setLoadingKecamatan(false);
    }
  }

  // ==========================================
  // 5. MEMILIH KECAMATAN
  // ==========================================

  function pilihKecamatan(id) {
    setKecamatanId(id);

    const namaProvinsi = provinsi.find(
      (item) => item.id === provinsiId
    )?.name;

    const namaKabupaten = kabupaten.find(
      (item) => item.id === kabupatenId
    )?.name;

    const namaKecamatan = kecamatan.find(
      (item) => item.id === id
    )?.name;

    if (!id || !namaProvinsi || !namaKabupaten || !namaKecamatan) {
      perubahanInternal.current = "";
      onChange("");
      return;
    }

    // Format tetap berupa:
    // Kecamatan, Kabupaten/Kota, Provinsi

    const lokasiLengkap =
      `${namaKecamatan}, ${namaKabupaten}, ${namaProvinsi}`;

    perubahanInternal.current = lokasiLengkap;

    onChange(lokasiLengkap);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin
          className="size-4 text-aira-primary"
          aria-hidden="true"
        />
        <span className="text-sm font-semibold text-aira-text">
          Pilih Wilayah Tempat Tinggal
        </span>
        <span className="rounded-full bg-aira-sand px-2.5 py-1 text-xs text-aira-text/70">
          Opsional
        </span>
      </div>

      {/* PROVINSI */}
      <label className="block">
        <span className="mb-2 block text-sm text-aira-text/75">
          Provinsi
        </span>

        <select
          value={provinsiId}
          onChange={(e) => pilihProvinsi(e.target.value)}
          disabled={loadingProvinsi}
          className={kolomLokasi}
        >
          <option value="">
            {loadingProvinsi
              ? "Memuat provinsi..."
              : "Pilih provinsi"}
          </option>

          {provinsi.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      {/* KABUPATEN / KOTA */}
      <label className="block">
        <span className="mb-2 block text-sm text-aira-text/75">
          Kabupaten / Kota
        </span>

        <select
          value={kabupatenId}
          onChange={(e) => pilihKabupaten(e.target.value)}
          disabled={!provinsiId || loadingKabupaten}
          className={kolomLokasi}
        >
          <option value="">
            {!provinsiId
              ? "Pilih provinsi dahulu"
              : loadingKabupaten
                ? "Memuat kabupaten/kota..."
                : "Pilih kabupaten / kota"}
          </option>

          {kabupaten.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      {/* KECAMATAN */}
      <label className="block">
        <span className="mb-2 block text-sm text-aira-text/75">
          Kecamatan
        </span>

        <select
          value={kecamatanId}
          onChange={(e) => pilihKecamatan(e.target.value)}
          disabled={!kabupatenId || loadingKecamatan}
          className={kolomLokasi}
        >
          <option value="">
            {!kabupatenId
              ? "Pilih kabupaten / kota dahulu"
              : loadingKecamatan
                ? "Memuat kecamatan..."
                : "Pilih kecamatan"}
          </option>

          {kecamatan.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <p
          role="alert"
          className="text-sm text-aira-coral-dark"
        >
          {error}
        </p>
      )}

      <p className="text-xs leading-relaxed text-aira-text/60">
        Pilih lokasi tempat tinggal untuk membantu menentukan
        data curah hujan wilayah secara otomatis.
        Data curah hujan AIRA tetap menggunakan sumber data
        simulasi yang tersedia pada sistem.
      </p>

      {value && (
        <div className="rounded-xl bg-aira-sage/15 px-4 py-3">
          <p className="text-xs font-semibold text-aira-primary">
            Lokasi terpilih
          </p>
          <p className="mt-1 text-sm text-aira-text">
            {value}
          </p>
        </div>
      )}
    </div>
  );
} 