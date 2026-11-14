import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

const KOLOM_TITIK_AIR = `
  water_point_id,
  point_name,
  water_source_type,
  description,
  province_id,
  city_regency_id,
  district_id,
  village,
  address_detail,
  latitude,
  longitude,
  availability_status,
  access_information,
  opening_hours,
  verification_status,
  is_active,
  last_status_checked_at,
  created_at,
  updated_at,
  quality_information,
  provider,
  contact_person,
  phone_number,
  location_hint,
  usage_purpose,
  information_source,
  is_simulation
`;

function labelJenisAir(value) {
  const labels = {
    public_well: "Sumur umum",
    water_station: "Titik distribusi air",
  };

  return labels[value] || value || "Jenis sumber air belum diketahui";
}

function labelKetersediaan(value) {
  const labels = {
    available: "Tersedia",
    limited: "Terbatas",
    unavailable: "Tidak Tersedia",
    unknown: "Belum Diketahui",
  };

  return labels[value] || value || "Belum Diketahui";
}

function labelVerifikasi(value) {
  const labels = {
    verified: "Terverifikasi",
    pending: "Menunggu Verifikasi",
    needs_revision: "Perlu Perbaikan",
    rejected: "Ditolak",
  };

  return labels[value] || value || "Belum diketahui";
}

function formatTanggal(value) {
  if (!value) return "Belum diketahui";

  const tanggal = new Date(value);

  if (Number.isNaN(tanggal.getTime())) {
    return "Belum diketahui";
  }

  return `Diperbarui ${tanggal.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  })} WIB`;
}

function gabungkanAlamat({
  address_detail,
  village,
  districtName,
  regencyName,
  provinceName,
}) {
  const bagian = [
    address_detail,
    village,
    districtName,
    regencyName,
    provinceName,
  ];

  const hasil = bagian
    .filter(Boolean)
    .map((item) => item.trim())
    .filter((item, index, array) => array.indexOf(item) === index);

  return hasil.join(", ") || "Informasi alamat belum tersedia";
}

async function ambilDataWilayah(supabase) {
  const [provinsiResult, kabupatenResult, kecamatanResult] =
    await Promise.all([
      supabase
        .from("provinces")
        .select("province_id, province_name"),

      supabase
        .from("city_regencies")
        .select("city_regency_id, provinces_id, city_regency_name"),

      supabase
        .from("districts")
        .select(
          "district_id, province_id, city_regency_id, district_name"
        ),
    ]);

  if (provinsiResult.error) throw provinsiResult.error;
  if (kabupatenResult.error) throw kabupatenResult.error;
  if (kecamatanResult.error) throw kecamatanResult.error;

  return {
    provinsi: provinsiResult.data || [],
    kabupaten: kabupatenResult.data || [],
    kecamatan: kecamatanResult.data || [],
  };
}

function petakanTitikAir(titik, wilayah) {
  const provinsi = wilayah.provinsi.find(
    (item) => item.province_id === titik.province_id
  );

  const kabupaten = wilayah.kabupaten.find(
    (item) => item.city_regency_id === titik.city_regency_id
  );

  const kecamatan = wilayah.kecamatan.find(
    (item) => item.district_id === titik.district_id
  );

  const namaProvinsi = provinsi?.province_name || "";
  const namaKabupaten = kabupaten?.city_regency_name || "";
  const namaKecamatan = kecamatan?.district_name || "";

  return {
    id: String(titik.water_point_id),
    waterPointId: titik.water_point_id,

    name: titik.point_name,
    type: labelJenisAir(titik.water_source_type),

    area: [namaKecamatan, namaKabupaten]
      .filter(Boolean)
      .join(", "),

    address: gabungkanAlamat({
      address_detail: titik.address_detail,
      village: titik.village,
      districtName: namaKecamatan,
      regencyName: namaKabupaten,
      provinceName: namaProvinsi,
    }),

    kecamatan: namaKecamatan,
    kabupaten: namaKabupaten,
    provinsi: namaProvinsi,

    latitude: titik.latitude,
    longitude: titik.longitude,

    availability: labelKetersediaan(titik.availability_status),
    verification: labelVerifikasi(titik.verification_status),

    updated: formatTanggal(
      titik.last_status_checked_at || titik.updated_at
    ),
    updatedAt: titik.last_status_checked_at || titik.updated_at,

    hours: titik.opening_hours || "",
    access: titik.access_information || "",
    quality: titik.quality_information || "",

    provider: titik.provider || "",
    contact: titik.contact_person || "",
    phone: titik.phone_number || "",

    locationHint: titik.location_hint || "",
    usagePurpose: titik.usage_purpose || "",
    source: titik.information_source || "",
    note: titik.description || "",

    isSimulation: Boolean(titik.is_simulation),
    isActive: titik.is_active,
  };
}

// Daftar titik air terverifikasi untuk Dashboard Admin.
export const ambilTitikAirTerverifikasi = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("water_points")
    .select(KOLOM_TITIK_AIR)
    .eq("verification_status", "verified")
    .eq("is_active", true)
    .order("point_name", { ascending: true });

  if (error) {
    console.error("Gagal mengambil titik air terverifikasi:", error);
    throw new Error("Gagal mengambil data titik air terverifikasi.");
  }

  if (!data || data.length === 0) {
    return [];
  }

  const wilayah = await ambilDataWilayah(supabase);

  return data.map((titik) => petakanTitikAir(titik, wilayah));
});
