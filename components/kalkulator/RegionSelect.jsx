"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import Combobox from "@/components/navigasi/Combobox";
import FieldLabel from "@/components/kalkulator/FieldLabel";
import { createClient } from "@/lib/supabase/client";

export default function RegionSelect({
  value = "",
  onChange,
  onRegionChange,
}) {
  const supabase = useMemo(() => createClient(), []);

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

        console.log("========== DEBUG SUPABASE WILAYAH ==========");
        console.log("Mulai mengambil data provinsi...");

        const { data, error } = await supabase
          .from("provinces")
          .select("province_id, province_name")
          .order("province_name", { ascending: true });

        // DEBUG: HASIL QUERY PROVINSI
        console.log("DATA PROVINSI:", data);
        console.log("JUMLAH PROVINSI:", data?.length);
        console.log("ERROR SUPABASE:", error);
        console.log("============================================");

        if (error) throw error;

        if (aktif) {
          setProvinsi(
            (data || []).map((item) => ({
              id: String(item.province_id),
              name: item.province_name,
            }))
          );
        }
      } catch (err) {
        console.error("Gagal mengambil provinsi:", err);

        if (aktif) {
          setError("Data provinsi gagal dimuat.");
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

  // ==========================================
  // 2. FUNGSI MENGAMBIL KABUPATEN / KOTA
  // ==========================================

  async function ambilKabupaten(idProvinsi) {
    const { data, error } = await supabase
      .from("city_regencies")
      .select("city_regency_id, city_regency_name")
      .eq("provinces_id", Number(idProvinsi))
      .order("city_regency_name", { ascending: true });

    console.log("DATA KABUPATEN/KOTA:", data);
    console.log("JUMLAH KABUPATEN/KOTA:", data?.length);
    console.log("ERROR KABUPATEN/KOTA:", error);

    if (error) throw error;

    return (data || []).map((item) => ({
      id: String(item.city_regency_id),
      name: item.city_regency_name,
    }));
  }

  // ==========================================
  // 3. FUNGSI MENGAMBIL KECAMATAN
  // ==========================================

  async function ambilKecamatan(idProvinsi, idKabupaten) {
    const { data, error } = await supabase
      .from("districts")
      .select("district_id, district_name")
      .eq("province_id", Number(idProvinsi))
      .eq("city_regency_id", Number(idKabupaten))
      .order("district_name", { ascending: true });

    console.log("DATA KECAMATAN:", data);
    console.log("JUMLAH KECAMATAN:", data?.length);
    console.log("ERROR KECAMATAN:", error);

    if (error) throw error;

    return (data || []).map((item) => ({
      id: String(item.district_id),
      name: item.district_name,
    }));
  }

  // ==========================================
  // 4. MEMULIHKAN LOKASI TERSIMPAN
  // ==========================================

  useEffect(() => {
    if (!provinsi.length) return;

    if (perubahanInternal.current === value) {
      perubahanInternal.current = null;
      return;
    }

    if (!value) {
      setProvinsiId("");
      setKabupatenId("");
      setKecamatanId("");
      setKabupaten([]);
      setKecamatan([]);
      return;
    }

    let aktif = true;

    async function pulihkanLokasi() {
      try {
        const bagian = value.split(",").map((item) => item.trim());

        if (bagian.length !== 3) return;

        const [namaKecamatan, namaKabupaten, namaProvinsi] = bagian;

        const dataProvinsi = provinsi.find(
          (item) => item.name === namaProvinsi
        );

        if (!dataProvinsi) return;

        setProvinsiId(dataProvinsi.id);

        const dataKabupaten = await ambilKabupaten(dataProvinsi.id);

        if (!aktif) return;

        setKabupaten(dataKabupaten);

        const kabupatenTerpilih = dataKabupaten.find(
          (item) => item.name === namaKabupaten
        );

        if (!kabupatenTerpilih) return;

        setKabupatenId(kabupatenTerpilih.id);

        const dataKecamatan = await ambilKecamatan(
          dataProvinsi.id,
          kabupatenTerpilih.id
        );

        if (!aktif) return;

        setKecamatan(dataKecamatan);

        const kecamatanTerpilih = dataKecamatan.find(
          (item) => item.name === namaKecamatan
        );

        if (!kecamatanTerpilih) return;

        setKecamatanId(kecamatanTerpilih.id);

        onRegionChange?.({
          province_id: Number(dataProvinsi.id),
          city_regency_id: Number(kabupatenTerpilih.id),
          district_id: Number(kecamatanTerpilih.id),
          location: value,
        });
      } catch (err) {
        console.error("Gagal memulihkan lokasi:", err);

        if (aktif) {
          setError("Lokasi sebelumnya gagal dipulihkan.");
        }
      }
    }

    pulihkanLokasi();

    return () => {
      aktif = false;
    };
  }, [provinsi, value, supabase]);

  // ==========================================
  // 5. MEMILIH PROVINSI
  // ==========================================

  async function pilihProvinsi(id) {
    setProvinsiId(id);
    setKabupatenId("");
    setKecamatanId("");

    setKabupaten([]);
    setKecamatan([]);

    setError("");

    perubahanInternal.current = "";
    onChange?.("");
    onRegionChange?.(null);

    if (!id) return;

    try {
      setLoadingKabupaten(true);

      const data = await ambilKabupaten(id);

      setKabupaten(data);
    } catch (err) {
      console.error("Gagal mengambil kabupaten:", err);
      setError("Kabupaten/kota gagal dimuat.");
    } finally {
      setLoadingKabupaten(false);
    }
  }

  // ==========================================
  // 6. MEMILIH KABUPATEN / KOTA
  // ==========================================

  async function pilihKabupaten(id) {
    setKabupatenId(id);
    setKecamatanId("");

    setKecamatan([]);
    setError("");

    perubahanInternal.current = "";
    onChange?.("");
    onRegionChange?.(null);

    if (!id) return;

    try {
      setLoadingKecamatan(true);

      const data = await ambilKecamatan(provinsiId, id);

      setKecamatan(data);
    } catch (err) {
      console.error("Gagal mengambil kecamatan:", err);
      setError("Kecamatan gagal dimuat.");
    } finally {
      setLoadingKecamatan(false);
    }
  }

  // ==========================================
  // 7. MEMILIH KECAMATAN
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
      onChange?.("");
      onRegionChange?.(null);
      return;
    }

    const lokasiLengkap =
      `${namaKecamatan}, ${namaKabupaten}, ${namaProvinsi}`;

    perubahanInternal.current = lokasiLengkap;

    onChange?.(lokasiLengkap);

    onRegionChange?.({
      province_id: Number(provinsiId),
      city_regency_id: Number(kabupatenId),
      district_id: Number(id),
      location: lokasiLengkap,
    });
  }

  // ==========================================
  // 8. MENGUBAH ID MENJADI NAMA
  // ==========================================

  const namaDariId = (daftar, id) =>
    daftar.find((item) => item.id === id)?.name ?? "";

  const idDariNama = (daftar, nama) =>
    daftar.find((item) => item.name === nama)?.id ?? "";

  const namaProvinsiTerpilih = namaDariId(provinsi, provinsiId);
  const namaKabupatenTerpilih = namaDariId(kabupaten, kabupatenId);
  const namaKecamatanTerpilih = namaDariId(kecamatan, kecamatanId);

  const lokasiTerpilih = [
    namaKecamatanTerpilih,
    namaKabupatenTerpilih,
    namaProvinsiTerpilih,
  ]
    .filter(Boolean)
    .join(", ");

  // ==========================================
  // 9. TAMPILAN
  // ==========================================

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
          emptyText="Wilayah tidak ditemukan."
          onSelect={(nama) =>
            pilihProvinsi(idDariNama(provinsi, nama))
          }
        />

        <Combobox
          label="Kabupaten / Kota"
          placeholder="Pilih kabupaten / kota"
          options={kabupaten.map((item) => item.name)}
          value={namaKabupatenTerpilih}
          disabled={!provinsiId}
          memuat={loadingKabupaten}
          hint="Pilih provinsi dahulu"
          emptyText="Wilayah tidak ditemukan."
          onSelect={(nama) =>
            pilihKabupaten(idDariNama(kabupaten, nama))
          }
        />

        <Combobox
          label="Kecamatan"
          placeholder="Pilih kecamatan"
          options={kecamatan.map((item) => item.name)}
          value={namaKecamatanTerpilih}
          disabled={!kabupatenId}
          memuat={loadingKecamatan}
          hint="Pilih kabupaten / kota dahulu"
          emptyText="Wilayah tidak ditemukan."
          onSelect={(nama) =>
            pilihKecamatan(idDariNama(kecamatan, nama))
          }
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-aira-coral-dark">
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