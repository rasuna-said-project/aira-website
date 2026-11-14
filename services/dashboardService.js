import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { STATUS_LABEL } from "@/lib/kontribusi";
import { SUMBER_AIR_PROFIL, sumberKeKalkulator, sumberKeProfil } from "@/lib/sumberAir";

const ZONA = "Asia/Jakarta";
const KONDISI_VALID = ["Normal", "Terbatas", "Tidak berfungsi", "Belum diketahui"];

// "Tidak Berfungsi" (tampilan) -> "Tidak berfungsi" (calculatorService); nilai asing -> "Belum diketahui".
export const normalisasiKondisi = (k) => {
  const t = String(k ?? "").trim().toLowerCase();
  return KONDISI_VALID.find((v) => v.toLowerCase() === t) ?? "Belum diketahui";
};

// "2026-10-12" (zona WIB)
export const tanggalIsoWib = (iso) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));

// "06.40" (zona WIB)
export const waktuWib = (iso) =>
  new Intl.DateTimeFormat("id-ID", {
    timeZone: ZONA,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));

export const lokasiDariRumah = (h) =>
  [h?.district?.district_name, h?.city?.city_regency_name, h?.province?.province_name]
    .filter(Boolean)
    .join(", ");

const WILAYAH_RUMAH = `
  province:provinces!fk_household_province(province_name),
  city:city_regencies!fk_household_city(city_regency_name),
  district:districts!fk_household_district(district_name)
`;

const SELECT_RUMAH = `
  household_id, household_name, address_detail, member_count, water_source_type,
  source_condition, tank_capacity_liters, water_volume_percentage,
  has_mhm, mhm_member_count, roof_area_m2, updated_at,
  ${WILAYAH_RUMAH}
`;

const SELECT_ASESMEN = `
  assessment_id, household_id, available_water_liters, daily_need_liters,
  estimated_duration_days, water_condition, crisis_mode, assessment_notes,
  assessed_at, input_snapshot,
  household:households!fk_assessment_household(
    member_count, water_source_type, source_condition, tank_capacity_liters,
    has_mhm, mhm_member_count, roof_area_m2,
    ${WILAYAH_RUMAH}
  )
`;

// Satu asesmen -> satu entri. Asesmen lama tanpa snapshot dibaca dari tabel households.
function keEntri(a) {
  const s = a.input_snapshot ?? {};
  const h = a.household ?? {};
  const mhmRumah = h.has_mhm ? Number(h.mhm_member_count ?? 0) : 0;

  return {
    id: a.assessment_id,
    iso: a.assessed_at,
    sumber: s.sumber ?? "kalkulator",
    catatan: s.catatan ?? "",
    liter: Number(a.available_water_liters),
    hari: a.estimated_duration_days != null ? Number(a.estimated_duration_days) : null,
    anggota: Number(s.anggota ?? h.member_count ?? 0),
    anggotaMhm: Number(s.anggotaMhm ?? mhmRumah),
    kondisiSumberAir: normalisasiKondisi(s.kondisi ?? h.source_condition),
    sumberAir: s.sumberAir ?? h.water_source_type ?? "",
    luasAtap: Number(s.luasAtap ?? h.roof_area_m2 ?? 0) || 0,
    kapasitasTandonLiter: Number(s.kapasitas ?? h.tank_capacity_liters ?? 0),
    persen: s.persen != null ? Number(s.persen) : null,
    lokasi: s.lokasi ?? lokasiDariRumah(h),
  };
}

// Data dasar milik pengguna yang login. Dipakai bersama oleh Dashboard, Kondisi Air, dan Monitoring;
// `cache` membuatnya hanya diambil sekali per request.
export const muatDataUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, household: null, entri: [], kontribusi: [] };

  const [rumah, asesmen, kontribusi] = await Promise.all([
    supabase
      .from("households")
      .select(SELECT_RUMAH)
      .eq("owner_user_id", user.id)
      .order("updated_at", { ascending: false })
      .order("household_id", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("water_assessments")
      .select(SELECT_ASESMEN)
      .eq("assessed_by_user_id", user.id)
      .order("assessed_at", { ascending: false })
      .limit(60),
    supabase
      .from("water_point_contributions")
      .select("contribution_id, proposed_point_name, status")
      .eq("contributor_user_id", user.id)
      .order("submitted_at", { ascending: false }),
  ]);

  if (rumah.error) throw new Error(`Gagal memuat rumah tangga: ${rumah.error.message}`);
  if (asesmen.error) throw new Error(`Gagal memuat riwayat: ${asesmen.error.message}`);
  if (kontribusi.error) throw new Error(`Gagal memuat kontribusi: ${kontribusi.error.message}`);

  return {
    user,
    household: rumah.data ?? null,
    entri: (asesmen.data ?? []).map(keEntri),
    kontribusi: kontribusi.data ?? [],
  };
});

// Sumber data Dashboard User. Bentuk keluaran sama dengan versi simulasi sebelumnya,
// jadi komponen tidak berubah.
export const ambilDataDashboard = cache(async () => {
  const { household: h, entri, kontribusi } = await muatDataUser();
  const terbaru = entri[0] ?? null;

  const nama = h?.household_name;

  const keluarga = {
    namaRumahTangga: nama && nama !== "Rumah Tangga Pengguna" ? nama : null,
    wilayahDesa: h?.address_detail || lokasiDariRumah(h) || terbaru?.lokasi || "",
    anggota: h?.member_count ?? terbaru?.anggota ?? null,
    anggotaMhm: h ? (h.has_mhm ? Number(h.mhm_member_count ?? 0) : 0) : terbaru?.anggotaMhm ?? 0,
    sumberAirUtama: sumberKeProfil(h?.water_source_type ?? terbaru?.sumberAir),
    kapasitasTandonLiter: Number(h?.tank_capacity_liters ?? terbaru?.kapasitasTandonLiter ?? 0),
    kondisiSumberAir: terbaru?.kondisiSumberAir ?? normalisasiKondisi(h?.source_condition),
  };

  // Semua pembaruan (kalkulator dan monitoring) menjadi catatan kondisi; yang terbaru di depan.
  const catatan = entri.map((e) => ({
    id: e.id,
    tanggal: tanggalIsoWib(e.iso),
    waktu: waktuWib(e.iso),
    liter: e.liter,
    catatan: e.catatan,
  }));

  // Riwayat perhitungan: hanya yang berasal dari Kalkulator.
  const riwayat = entri
    .filter((e) => e.sumber === "kalkulator")
    .slice(0, 20)
    .map((e) => ({
      id: e.id,
      tanggal: tanggalIsoWib(e.iso),
      waktu: waktuWib(e.iso),
      anggota: e.anggota,
      anggotaMhm: e.anggotaMhm,
      liter: e.liter,
      lokasi: e.lokasi,
      kondisiSumberAir: e.kondisiSumberAir,
      sumberAir: sumberKeKalkulator(e.sumberAir),
      luasAtap: e.luasAtap,
      kapasitasTandonLiter: e.kapasitasTandonLiter,
    }));

  return {
    keluarga,
    catatan,
    riwayat,
    kontribusi: kontribusi.map((k) => ({
      id: k.contribution_id,
      nama: k.proposed_point_name ?? "",
      status: STATUS_LABEL[k.status] ?? "Menunggu Verifikasi",
    })),
  };
});

// Simpan Profil Keluarga (halaman Kondisi Air Rumah Tangga).
// Tidak mengubah asesmen lama: riwayat memakai snapshot masing-masing.
export async function simpanProfilKeluargaUser(input) {
  const i = input ?? {};

  const nama = String(i.namaRumahTangga ?? "").trim().slice(0, 150);
  if (!nama) return { ok: false, error: "Nama rumah tangga wajib diisi." };

  const wilayah = String(i.wilayahDesa ?? "").trim().slice(0, 300);

  const anggota = Number(i.anggota);
  if (!Number.isInteger(anggota) || anggota < 1 || anggota > 30) {
    return { ok: false, error: "Jumlah anggota keluarga harus 1 sampai 30." };
  }

  const mhm = Boolean(i.mhm);
  const perempuan = mhm ? Number(i.anggotaMhm) : 0;
  if (!Number.isInteger(perempuan) || perempuan < 0 || perempuan > anggota) {
    return { ok: false, error: "Jumlah perempuan usia subur tidak boleh melebihi jumlah anggota." };
  }

  const sumber = String(i.sumberAir ?? "");
  if (!SUMBER_AIR_PROFIL.includes(sumber)) {
    return { ok: false, error: "Sumber air utama tidak valid." };
  }

  const kapasitas = Number(i.kapasitas);
  if (!Number.isFinite(kapasitas) || kapasitas < 0 || kapasitas > 100000) {
    return { ok: false, error: "Kapasitas tandon harus 0 sampai 100.000 liter." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Silakan masuk terlebih dahulu." };

  const nilai = {
    household_name: nama,
    address_detail: wilayah || null,
    member_count: anggota,
    water_source_type: sumber,
    tank_capacity_liters: kapasitas,
    has_mhm: mhm && perempuan > 0,
    mhm_member_count: perempuan,
  };

  const { data: ada, error: errCari } = await supabase
    .from("households")
    .select("household_id")
    .eq("owner_user_id", user.id)
    .order("updated_at", { ascending: false })
    .order("household_id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (errCari) {
    console.error("[simpanProfilKeluargaUser]", errCari);
    return { ok: false, error: "Profil keluarga belum dapat disimpan. Coba lagi." };
  }

  const { error } = ada
    ? await supabase
        .from("households")
        .update({ ...nilai, updated_at: new Date().toISOString() })
        .eq("household_id", ada.household_id)
        .eq("owner_user_id", user.id)
    : await supabase.from("households").insert({ owner_user_id: user.id, ...nilai });

  if (error) {
    console.error("[simpanProfilKeluargaUser]", error);
    return { ok: false, error: "Profil keluarga belum dapat disimpan. Coba lagi." };
  }

  return { ok: true };
}

// Nilai awal Kalkulator untuk pengguna yang sudah pernah mengisi.
// Sumbernya kondisi rumah tangga saat ini (diperbarui kalkulator, monitoring, dan profil keluarga).
// Riwayat lama tidak disentuh: setiap perhitungan baru menambah satu asesmen.
// Mengembalikan null untuk tamu atau pengguna yang belum pernah mengisi.
const KONDISI_KE_FORM = { "Tidak berfungsi": "Tidak Berfungsi" };

export const ambilInputKalkulatorTerakhir = cache(async () => {
  const { household: h, entri } = await muatDataUser();
  const terbaru = entri[0] ?? null;

  if (!h && !terbaru) return null;

  const anggota = Number(h?.member_count ?? terbaru?.anggota ?? 0);
  if (!Number.isInteger(anggota) || anggota < 1) return null;

  const mhm = h
    ? h.has_mhm
      ? Number(h.mhm_member_count ?? 0)
      : 0
    : Number(terbaru?.anggotaMhm ?? 0);

  const kondisi = normalisasiKondisi(h?.source_condition ?? terbaru?.kondisiSumberAir);

  const persenMentah =
    h?.water_volume_percentage != null
      ? Number(h.water_volume_percentage)
      : Number(terbaru?.persen ?? 0);
  const persen = Math.min(100, Math.max(0, Math.round(persenMentah / 5) * 5));

  // RegionSelect hanya dapat memulihkan lokasi berformat "Kecamatan, Kabupaten, Provinsi".
  const lokasiMentah = lokasiDariRumah(h) || terbaru?.lokasi || "";
  const lokasi = lokasiMentah.split(",").length === 3 ? lokasiMentah : "";

  const kapasitas = Math.round(
    Number(h?.tank_capacity_liters ?? terbaru?.kapasitasTandonLiter ?? 0)
  );
  const atap = Number(h?.roof_area_m2 ?? terbaru?.luasAtap ?? 0) || 0;

  return {
    lokasi,
    anggota,
    sumberAir: sumberKeKalkulator(h?.water_source_type ?? terbaru?.sumberAir),
    kondisi: KONDISI_KE_FORM[kondisi] ?? kondisi,
    kapasitas: String(kapasitas),
    persen,
    mhm: mhm > 0,
    anggotaMhm: mhm,
    luasAtap: atap > 0 ? String(atap) : "",
  };
});