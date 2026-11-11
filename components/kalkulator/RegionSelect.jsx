"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

import Combobox from "@/components/navigasi/Combobox";
import FieldLabel from "@/components/kalkulator/FieldLabel";
import { createClient } from "@/lib/supabase/client";

export default function RegionSelect({ value = "", onChange }) {
  // Membuat Supabase client satu kali untuk komponen ini.
  const [supabase] = useState(() => createClient());

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

  // Menandai perubahan lokasi yang berasal dari pilihan pengguna.
  const perubahanInternal = useRef(null);

  // =====================================================
  // 1. MEMUAT DATA PROVINSI DARI SUPABASE
  // =====================================================

  useEffect(() => {
    let aktif = true;

    async function muatProvinsi() {
      try {
        setError("");

        const { data, error: queryError } = await supabase
          .from("provinces")
          .select("province_id, province_name")
          .order("province_name", { ascending: true });

        if (queryError) {
          throw queryError;
        }

        if (aktif) {
          setProvinsi(data || []);
        }
      } catch (err) {
        console.error("Gagal memuat provinsi:", err);

        if (aktif) {
          setError(
            "Data provinsi gagal dimuat. Periksa koneksi atau akses data wilayah."
          );
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
  }, [supabase]);

  // =====================================================
  // 2. MEMULIHKAN LOKASI YANG SUDAH TERSIMPAN
  // =====================================================

  useEffect(() => {
    // Tunggu sampai data provinsi selesai dimuat.
    if (!provinsi.length) return;

    // Jika perubahan berasal dari pilihan pengguna,
    // tidak perlu menjalankan pemulihan lokasi.
    if (perubahanInternal.current === value) {
      perubahanInternal.current = null;
      return;
    }

    // Lokasi kosong tidak perlu dipulihkan.
    if (!value) return;

    let aktif = true;

    async function pulihkanLokasi() {
      try {
        const bagian = value
          .split(",")
          .map((item) => item.trim());

        if (bagian.length !== 3) return;

        const [
          namaKecamatan,
          namaKabupaten,
          namaProvinsi,
        ] = bagian;

        // Cari provinsi berdasarkan nama.
        const dataProvinsi = provinsi.find(
          (item) => item.province_name === namaProvinsi
        );

        if (!dataProvinsi) {
          throw new Error(
            "Provinsi pada lokasi tersimpan tidak ditemukan."
          );
        }

        const idProvinsi = String(dataProvinsi.province_id);

        // Ambil kabupaten/kota berdasarkan provinsi.
        const {
          data: dataKabupaten,
          error: errorKabupaten,
        } = await supabase
          .from("city_regencies")
          .select(
            "city_regency_id, provinces_id, city_regency_name"
          )
          .eq("provinces_id", idProvinsi)
          .order("city_regency_name", { ascending: true });

        if (errorKabupaten) throw errorKabupaten;
        if (!aktif) return;

        const kabupatenTerpilih = (dataKabupaten || []).find(
          (item) => item.city_regency_name === namaKabupaten
        );

        if (!kabupatenTerpilih) {
          throw new Error(
            "Kabupaten/kota pada lokasi tersimpan tidak ditemukan."
          );
        }

        const idKabupaten = String(
          kabupatenTerpilih.city_regency_id
        );

        // Ambil kecamatan berdasarkan kabupaten dan provinsi.
        const {
          data: dataKecamatan,
          error: errorKecamatan,
        } = await supabase
          .from("districts")
          .select(
            "district_id, province_id, city_regency_id, district_name"
          )
          .eq("city_regency_id", idKabupaten)
          .eq("province_id", idProvinsi)
          .order("district_name", { ascending: true });

        if (errorKecamatan) throw errorKecamatan;
        if (!aktif) return;

        const kecamatanTerpilih = (dataKecamatan || []).find(
          (item) => item.district_name === namaKecamatan
        );

        if (!kecamatanTerpilih) {
          throw new Error(
            "Kecamatan pada lokasi tersimpan tidak ditemukan."
          );
        }

        // Pulihkan seluruh pilihan wilayah.
        setProvinsiId(idProvinsi);

        setKabupaten(dataKabupaten || []);
        setKabupatenId(idKabupaten);

        setKecamatan(dataKecamatan || []);
        setKecamatanId(String(kecamatanTerpilih.district_id));

        setError("");
      } catch (err) {
        console.error("Gagal memulihkan lokasi:", err);

        if (aktif) {
          setError(
            "Lokasi sebelumnya gagal dipulihkan. Silakan pilih ulang wilayah."
          );
        }
      }
    }

    pulihkanLokasi();

    return () => {
      aktif = false;
    };
  }, [provinsi, value, supabase]);

  // =====================================================
  // 3. MEMILIH PROVINSI
  // =====================================================

  async function pilihProvinsi(id) {
    setProvinsiId(id);

    // Kosongkan pilihan wilayah di bawahnya.
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

      const { data, error: queryError } = await supabase
        .from("city_regencies")
        .select(
          "city_regency_id, provinces_id, city_regency_name"
        )
        .eq("provinces_id", id)
        .order("city_regency_name", { ascending: true });

      if (queryError) throw queryError;

      setKabupaten(data || []);
    } catch (err) {
      console.error("Gagal memuat kabupaten/kota:", err);
      setError("Kabupaten/kota gagal dimuat.");
    } finally {
      setLoadingKabupaten(false);
    }
  }

  // =====================================================
  // 4. MEMILIH KABUPATEN / KOTA
  // =====================================================

  async function pilihKabupaten(id) {
    setKabupatenId(id);

    // Kosongkan pilihan kecamatan sebelumnya.
    setKecamatanId("");
    setKecamatan([]);

    setError("");

    perubahanInternal.current = "";
    onChange("");

    if (!id) return;

    try {
      setLoadingKecamatan(true);

      const { data, error: queryError } = await supabase
        .from("districts")
        .select(
          "district_id, province_id, city_regency_id, district_name"
        )
        .eq("city_regency_id", id)
        .eq("province_id", provinsiId)
        .order("district_name", { ascending: true });

      if (queryError) throw queryError;

      setKecamatan(data || []);
    } catch (err) {
      console.error("Gagal memuat kecamatan:", err);
      setError("Kecamatan gagal dimuat.");
    } finally {
      setLoadingKecamatan(false);
    }
  }

  // =====================================================
  // 5. MEMILIH KECAMATAN
  // =====================================================

  function pilihKecamatan(id) {
    setKecamatanId(id);

    const namaProvinsi = provinsi.find(
      (item) => String(item.province_id) === String(provinsiId)
    )?.province_name;

    const namaKabupaten = kabupaten.find(
      (item) =>
        String(item.city_regency_id) === String(kabupatenId)
    )?.city_regency_name;

    const namaKecamatan = kecamatan.find(
      (item) => String(item.district_id) === String(id)
    )?.district_name;

    if (
      !id ||
      !namaProvinsi ||
      !namaKabupaten ||
      !namaKecamatan
    ) {
      perubahanInternal.current = "";
      onChange("");
      return;
    }

    // Format lokasi dipertahankan:
    // Kecamatan, Kabupaten/Kota, Provinsi
    const lokasiLengkap =
      `${namaKecamatan}, ${namaKabupaten}, ${namaProvinsi}`;

    perubahanInternal.current = lokasiLengkap;
    onChange(lokasiLengkap);

    setError("");
  }

  // =====================================================
  // 6. DATA UNTUK COMBOBOX
  // =====================================================

  const namaDariId = (daftar, id, kolomId, kolomNama) =>
    daftar.find(
      (item) => String(item[kolomId]) === String(id)
    )?.[kolomNama] ?? "";

  const idDariNama = (daftar, nama, kolomId, kolomNama) =>
    daftar.find(
      (item) => item[kolomNama] === nama
    )?.[kolomId] ?? "";

  const namaProvinsiTerpilih = namaDariId(
    provinsi,
    provinsiId,
    "province_id",
    "province_name"
  );

  const namaKabupatenTerpilih = namaDariId(
    kabupaten,
    kabupatenId,
    "city_regency_id",
    "city_regency_name"
  );

  const namaKecamatanTerpilih = namaDariId(
    kecamatan,
    kecamatanId,
    "district_id",
    "district_name"
  );

  const lokasiTerpilih = [
    namaKecamatanTerpilih,
    namaKabupatenTerpilih,
    namaProvinsiTerpilih,
  ]
    .filter(Boolean)
    .join(", ");

  // =====================================================
  // 7. TAMPILAN
  // =====================================================

  return (
    <>
      <FieldLabel icon={MapPin} badge="Opsional">
        Lokasi / Wilayah Tempat Tinggal
      </FieldLabel>

      <div className="space-y-4">
        <Combobox
          label="Provinsi"
          placeholder="Pilih provinsi"
          options={provinsi.map((item) => item.province_name)}
          value={namaProvinsiTerpilih}
          memuat={loadingProvinsi}
          emptyText="Wilayah tidak ditemukan."
          onSelect={(nama) =>
            pilihProvinsi(
              String(
                idDariNama(
                  provinsi,
                  nama,
                  "province_id",
                  "province_name"
                )
              )
            )
          }
        />

        <Combobox
          label="Kabupaten / Kota"
          placeholder="Pilih kabupaten / kota"
          options={kabupaten.map(
            (item) => item.city_regency_name
          )}
          value={namaKabupatenTerpilih}
          disabled={!provinsiId || loadingKabupaten}
          memuat={loadingKabupaten}
          hint="Pilih provinsi dahulu"
          emptyText="Kabupaten/kota tidak ditemukan."
          onSelect={(nama) =>
            pilihKabupaten(
              String(
                idDariNama(
                  kabupaten,
                  nama,
                  "city_regency_id",
                  "city_regency_name"
                )
              )
            )
          }
        />

        <Combobox
          label="Kecamatan"
          placeholder="Pilih kecamatan"
          options={kecamatan.map(
            (item) => item.district_name
          )}
          value={namaKecamatanTerpilih}
          disabled={!kabupatenId || loadingKecamatan}
          memuat={loadingKecamatan}
          hint="Pilih kabupaten / kota dahulu"
          emptyText="Kecamatan tidak ditemukan."
          onSelect={(nama) =>
            pilihKecamatan(
              String(
                idDariNama(
                  kecamatan,
                  nama,
                  "district_id",
                  "district_name"
                )
              )
            )
          }
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 text-sm text-aira-coral-dark"
        >
          {error}
        </p>
      )}

      {provinsiId && (
        <p className="mt-3 text-sm font-medium text-aira-primary">
          Lokasi terpilih: {lokasiTerpilih}
        </p>
      )}

      <p className="mt-2 text-sm text-aira-text/65">
        Dipakai untuk menentukan data curah hujan wilayah Anda secara otomatis.
      </p>

      <p className="mt-1 text-sm text-aira-text/65">
        Data curah hujan bersifat simulasi.
      </p>
    </>
  );
}
