
"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import Combobox from "@/components/navigasi/Combobox";
import FieldLabel from "@/components/kalkulator/FieldLabel";

const API_BASE =
  "https://www.emsifa.com/api-wilayah-indonesia/v2";

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

  // Combobox bekerja dengan nama wilayah; id dicari dari nama yang dipilih.
  const idDariNama = (daftar, nama) => daftar.find((item) => item.name === nama)?.id ?? "";
  const namaDariId = (daftar, id) => daftar.find((item) => item.id === id)?.name ?? "";

  const namaProvinsiTerpilih = namaDariId(provinsi, provinsiId);
  const namaKabupatenTerpilih = namaDariId(kabupaten, kabupatenId);
  const namaKecamatanTerpilih = namaDariId(kecamatan, kecamatanId);

  // Teks "Lokasi terpilih" mengikuti Figma: tampil begitu provinsi dipilih (Kecamatan, Kabupaten/Kota, Provinsi).
  const lokasiTerpilih = [namaKecamatanTerpilih, namaKabupatenTerpilih, namaProvinsiTerpilih]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <FieldLabel icon={MapPin} badge="Opsional">
        Lokasi / Wilayah Tempat Tinggal
      </FieldLabel>

      <div className="space-y-4">
        <Combobox
          label="Provinsi"
          placeholder="Pilih provinsi"
          options={provinsi.map((item) => item.name)}
          value={namaProvinsiTerpilih}
          memuat={loadingProvinsi}
          emptyText="Wilayah tidak ditemukan. Periksa ejaan atau kosongkan untuk melewati estimasi panen hujan."
          onSelect={(nama) => pilihProvinsi(idDariNama(provinsi, nama))}
        />
        <Combobox
          label="Kabupaten / Kota"
          placeholder="Pilih kabupaten / kota"
          options={kabupaten.map((item) => item.name)}
          value={namaKabupatenTerpilih}
          disabled={!provinsiId}
          memuat={loadingKabupaten}
          hint="Pilih provinsi dahulu"
          emptyText="Wilayah tidak ditemukan. Periksa ejaan atau kosongkan untuk melewati estimasi panen hujan."
          onSelect={(nama) => pilihKabupaten(idDariNama(kabupaten, nama))}
        />
        <Combobox
          label="Kecamatan"
          placeholder="Pilih kecamatan"
          options={kecamatan.map((item) => item.name)}
          value={namaKecamatanTerpilih}
          disabled={!kabupatenId}
          memuat={loadingKecamatan}
          hint="Pilih kabupaten / kota dahulu"
          emptyText="Wilayah tidak ditemukan. Periksa ejaan atau kosongkan untuk melewati estimasi panen hujan."
          onSelect={(nama) => pilihKecamatan(idDariNama(kecamatan, nama))}
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-aira-coral-dark">
          {error}
        </p>
      )}

      {provinsiId && <p className="mt-3 text-sm font-medium text-aira-primary">Lokasi terpilih: {lokasiTerpilih}</p>}
      <p className="mt-2 text-sm text-aira-text/65">
        Dipakai untuk menentukan data curah hujan wilayah Anda secara otomatis.
      </p>
      <p className="mt-1 text-sm text-aira-text/65">Data curah hujan bersifat simulasi.</p>
    </>
  );
}
