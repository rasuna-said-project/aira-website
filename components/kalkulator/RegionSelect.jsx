
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MapPin } from "lucide-react";

import Combobox from "@/components/navigasi/Combobox";
import FieldLabel from "@/components/kalkulator/FieldLabel";
import { createClient } from "@/lib/supabase/client";
import {
  formatNamaKecamatan,
  formatNamaKabupaten,
  formatNamaProvinsi,
  formatLokasiWilayah,
} from "@/lib/formatWilayah";

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

        const { data, error } = await supabase
          .from("provinces")
          .select("province_id, province_name")
          .order("province_name", { ascending: true });

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

  const ambilKabupaten = useCallback(
    async (idProvinsi) => {
      const { data, error } = await supabase
        .from("city_regencies")
        .select("city_regency_id, city_regency_name")
        .eq("provinces_id", Number(idProvinsi))
        .order("city_regency_name", { ascending: true });

      if (error) throw error;

      return (data || []).map((item) => ({
        id: String(item.city_regency_id),
        name: item.city_regency_name,
      }));
    },
    [supabase]
  );

  // ==========================================
  // 3. FUNGSI MENGAMBIL KECAMATAN
  // ==========================================

  const ambilKecamatan = useCallback(
    async (idProvinsi, idKabupaten) => {
      const { data, error } = await supabase
        .from("districts")
        .select("district_id, district_name")
        .eq("province_id", Number(idProvinsi))
        .eq("city_regency_id", Number(idKabupaten))
        .order("district_name", { ascending: true });

      if (error) throw error;

      return (data || []).map((item) => ({
        id: String(item.district_id),
        name: item.district_name,
      }));
    },
    [supabase]
  );

  // ==========================================
  // 4. MEMULIHKAN LOKASI TERSIMPAN
  // ==========================================

  useEffect(() => {
    if (!provinsi.length || !value) return;

    if (perubahanInternal.current === value) {
      perubahanInternal.current = null;
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
  }, [
    provinsi,
    value,
    ambilKabupaten,
    ambilKecamatan,
    onRegionChange,
  ]);

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

    // Nilai asli tetap digunakan untuk penyimpanan.
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
  // 8. MENGUBAH ID MENJADI NAMA TAMPILAN
  // ==========================================

  const namaDariId = (daftar, id) =>
    daftar.find((item) => item.id === id)?.name ?? "";

  const idDariNama = (daftar, nama, formatter) =>
    daftar.find(
      (item) => formatter(item.name) === nama
    )?.id ?? "";

  const namaProvinsiTerpilih = formatNamaProvinsi(
    namaDariId(provinsi, provinsiId)
  );

  const namaKabupatenTerpilih = formatNamaKabupaten(
    namaDariId(kabupaten, kabupatenId)
  );

  const namaKecamatanTerpilih = formatNamaKecamatan(
    namaDariId(kecamatan, kecamatanId)
  );

  const opsiProvinsi = provinsi.map((item) =>
    formatNamaProvinsi(item.name)
  );

  const opsiKabupaten = kabupaten.map((item) =>
    formatNamaKabupaten(item.name)
  );

  const opsiKecamatan = kecamatan.map((item) =>
    formatNamaKecamatan(item.name)
  );

  const lokasiTerpilih = [
    namaDariId(kecamatan, kecamatanId),
    namaDariId(kabupaten, kabupatenId),
    namaDariId(provinsi, provinsiId),
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
          options={opsiProvinsi}
          value={namaProvinsiTerpilih}
          memuat={loadingProvinsi}
          emptyText="Wilayah tidak ditemukan."
          onSelect={(nama) =>
            pilihProvinsi(
              idDariNama(provinsi, nama, formatNamaProvinsi)
            )
          }
        />

        <Combobox
          label="Kabupaten / Kota"
          placeholder="Pilih kabupaten / kota"
          options={opsiKabupaten}
          value={namaKabupatenTerpilih}
          disabled={!provinsiId}
          memuat={loadingKabupaten}
          hint="Pilih provinsi dahulu"
          emptyText="Wilayah tidak ditemukan."
          onSelect={(nama) =>
            pilihKabupaten(
              idDariNama(kabupaten, nama, formatNamaKabupaten)
            )
          }
        />

        <Combobox
          label="Kecamatan"
          placeholder="Pilih kecamatan"
          options={opsiKecamatan}
          value={namaKecamatanTerpilih}
          disabled={!kabupatenId}
          memuat={loadingKecamatan}
          hint="Pilih kabupaten / kota dahulu"
          emptyText="Wilayah tidak ditemukan."
          onSelect={(nama) =>
            pilihKecamatan(
              idDariNama(kecamatan, nama, formatNamaKecamatan)
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
          Lokasi terpilih: {formatLokasiWilayah(lokasiTerpilih)}
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
