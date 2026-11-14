"use server";

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

function formatError(error, fallback) {
  console.error(fallback, error);

  return {
    success: false,
    message: error?.message || fallback,
    data: null,
  };
}

function labelJenis(value) {
  const labels = {
    public_well: "Sumur umum",
    water_station: "Water station",
  };

  return labels[value] || value || "Jenis sumber belum diketahui";
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

  return labels[value] || value || "Belum Diketahui";
}

function formatTanggal(value) {
  if (!value) return "Waktu pembaruan belum tersedia";

  const tanggal = new Date(value);

  if (Number.isNaN(tanggal.getTime())) {
    return "Waktu pembaruan belum tersedia";
  }

  return `Diperbarui ${tanggal.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  })}`;
}

function gabungkanAlamat(titik, wilayah) {
  return [
    titik.address_detail,
    titik.village,
    wilayah.districtName,
    wilayah.regencyName,
    wilayah.provinceName,
  ]
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index)
    .join(", ");
}

function petakanTitik(titik, wilayah) {
  const province = wilayah.provinces.find(
    (item) => Number(item.province_id) === Number(titik.province_id)
  );

  const regency = wilayah.regencies.find(
    (item) =>
      Number(item.city_regency_id) === Number(titik.city_regency_id)
  );

  const district = wilayah.districts.find(
    (item) =>
      Number(item.district_id) === Number(titik.district_id)
  );

  const namaWilayah = {
    provinceName: province?.province_name || "",
    regencyName: regency?.city_regency_name || "",
    districtName: district?.district_name || "",
  };

  const alamat = gabungkanAlamat(titik, namaWilayah);

  const tanggalPembaruan =
    titik.last_status_checked_at ||
    titik.updated_at ||
    titik.created_at;

  return {
    id: String(titik.water_point_id),
    name: titik.point_name,
    type: labelJenis(titik.water_source_type),

    area: [
      namaWilayah.districtName,
      namaWilayah.regencyName,
    ]
      .filter(Boolean)
      .join(", "),

    address: alamat,
    kecamatan: namaWilayah.districtName,
    kabupaten: namaWilayah.regencyName,
    provinsi: namaWilayah.provinceName,

    latitude: titik.latitude,
    longitude: titik.longitude,

    availability: labelKetersediaan(titik.availability_status),
    verification: labelVerifikasi(titik.verification_status),

    updated: formatTanggal(tanggalPembaruan),
    updatedAt: tanggalPembaruan,

    hours: titik.opening_hours,
    access: titik.access_information,
    quality: titik.quality_information,

    provider: titik.provider,
    contact: titik.contact_person,
    phone: titik.phone_number,

    locationHint: titik.location_hint,
    usagePurpose: titik.usage_purpose,
    source: titik.information_source,
    note: titik.description,

    isSimulation: titik.is_simulation === true,
  };
}

async function ambilWilayah(supabase) {
  const [
    provincesResult,
    regenciesResult,
    districtsResult,
  ] = await Promise.all([
    supabase
      .from("provinces")
      .select("province_id, province_name")
      .order("province_name"),

    supabase
      .from("city_regencies")
      .select("city_regency_id, provinces_id, city_regency_name")
      .order("city_regency_name"),

    supabase
      .from("districts")
      .select(
        "district_id, province_id, city_regency_id, district_name"
      )
      .order("district_name"),
  ]);

  const error =
    provincesResult.error ||
    regenciesResult.error ||
    districtsResult.error;

  if (error) throw error;

  return {
    provinces: provincesResult.data || [],
    regencies: regenciesResult.data || [],
    districts: districtsResult.data || [],
  };
}

export async function getTitikAirPublikAction() {
  try {
    const supabase = await createClient();

    const [pointsResult, wilayah] = await Promise.all([
      supabase
        .from("water_points")
        .select(KOLOM_TITIK_AIR)
        .eq("verification_status", "verified")
        .eq("is_active", true)
        .eq("is_simulation", false)
        .order("point_name", { ascending: true }),

      ambilWilayah(supabase),
    ]);

    if (pointsResult.error) {
      throw pointsResult.error;
    }

    return {
      success: true,

      data: (pointsResult.data || []).map((titik) =>
        petakanTitik(titik, wilayah)
      ),

      wilayah: {
        provinces: wilayah.provinces,
        regencies: wilayah.regencies,
        districts: wilayah.districts,
      },

      message: "Data titik air berhasil diambil.",
    };
  } catch (error) {
    return formatError(
      error,
      "Gagal mengambil daftar titik air."
    );
  }
}

export async function getDetailTitikAirAction(id) {
  try {
    const waterPointId = Number(id);

    if (
      !Number.isSafeInteger(waterPointId) ||
      waterPointId <= 0
    ) {
      return {
        success: false,
        message: "ID titik air tidak valid.",
        data: null,
      };
    }

    const supabase = await createClient();

    const [pointResult, wilayah] = await Promise.all([
      supabase
        .from("water_points")
        .select(KOLOM_TITIK_AIR)
        .eq("water_point_id", waterPointId)
        .eq("verification_status", "verified")
        .eq("is_active", true)
        .eq("is_simulation", false)
        .maybeSingle(),

      ambilWilayah(supabase),
    ]);

    if (pointResult.error) {
      throw pointResult.error;
    }

    if (!pointResult.data) {
      return {
        success: false,
        message:
          "Titik air tidak ditemukan atau belum tersedia untuk publik.",
        data: null,
      };
    }

    return {
      success: true,
      data: petakanTitik(pointResult.data, wilayah),
      message: "Detail titik air berhasil diambil.",
    };
  } catch (error) {
    return formatError(
      error,
      "Gagal mengambil detail titik air."
    );
  }
}