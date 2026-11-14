import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { hitungKetahananAir } from "@/services/calculatorService";
import { formatLokasiWilayah } from "@/lib/formatWilayah";
import { hitungKebutuhanHarian } from "@/lib/statusDashboard";
import { sumberKeKalkulator } from "@/lib/sumberAir";
import { formatTanggalIso } from "@/lib/waktuDashboard";
import {
  lokasiDariRumah,
  muatDataUser,
  normalisasiKondisi,
  tanggalIsoWib,
  waktuWib,
} from "@/services/dashboardService";

const STATUS_DB = {
  "Aman / Relatif Mencukupi": "safe",
  Waspada: "limited",
  "Mode Krisis": "critical",
  "Belum Dapat Ditentukan": "undetermined",
};

const BATAS_TITIK_GRAFIK = 8;

// Data halaman Monitoring Kondisi Air.
// Setiap pembaruan (kalkulator maupun catatan manual) adalah satu titik pada grafik.
export const ambilDataMonitoring = cache(async () => {
  const { household: h, entri } = await muatDataUser();
  const terbaru = entri[0] ?? null;

  if (!h || !terbaru) return { adaData: false };

  const anggota = Number(h.member_count ?? terbaru.anggota);
  const anggotaMhm = h.has_mhm ? Number(h.mhm_member_count ?? 0) : 0;
  const kebutuhan = hitungKebutuhanHarian(anggota, anggotaMhm);
  const kapasitas = Number(h.tank_capacity_liters ?? terbaru.kapasitasTandonLiter ?? 0);

  const volume =
    terbaru.persen ??
    (h.water_volume_percentage != null
      ? Number(h.water_volume_percentage)
      : kapasitas > 0
        ? Math.round((terbaru.liter / kapasitas) * 100)
        : 0);

  const chartData = entri
    .slice(0, BATAS_TITIK_GRAFIK)
    .reverse()
    .map((e) => ({
      id: e.id,
      date: formatTanggalIso(tanggalIsoWib(e.iso)).tanggalSingkat,
      value: Number(
        (e.hari ?? (kebutuhan > 0 ? e.liter / kebutuhan : 0)).toFixed(1)
      ),
    }));

  const kondisi = terbaru.kondisiSumberAir;
  const lokasi = terbaru.lokasi || lokasiDariRumah(h);

  const parameter = [
    lokasi ? formatLokasiWilayah(lokasi) : "",
    `sumber ${kondisi.toLowerCase()}`,
    terbaru.luasAtap > 0 ? `atap ${terbaru.luasAtap} m²` : "",
    anggotaMhm > 0 ? `MHM ${anggotaMhm} orang` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    adaData: true,
    volume,
    liters: terbaru.liter,
    note: terbaru.catatan,
    lastUpdate: `${formatTanggalIso(tanggalIsoWib(terbaru.iso)).tanggalPenuh}, ${waktuWib(terbaru.iso)}`,
    chartData,
    anggota,
    anggotaMhm,
    kondisiSumberAir: kondisi,
    tankCapacity: kapasitas,
    parameter,
  };
});

// Catat kondisi air saat ini. Hasil dihitung dengan rumus kalkulator yang sama
// (calculatorService), lalu disimpan sebagai satu asesmen bertanda sumber "monitoring".
export async function simpanCatatanMonitoring({ volume, note }) {
  const persen = Number(volume);
  if (!Number.isFinite(persen) || persen < 0 || persen > 100) {
    return { ok: false, error: "Volume air harus 0 sampai 100 persen." };
  }
  const catatan = String(note ?? "").trim().slice(0, 200);

  const { user, household: h, entri } = await muatDataUser();
  if (!user) return { ok: false, error: "Silakan masuk terlebih dahulu." };
  if (!h?.member_count) {
    return { ok: false, error: "Lengkapi profil keluarga atau jalankan kalkulator terlebih dahulu." };
  }

  const kapasitas = Number(h.tank_capacity_liters ?? 0);
  if (!(kapasitas > 0)) {
    return { ok: false, error: "Isi kapasitas tandon pada profil keluarga terlebih dahulu." };
  }

  const anggota = Number(h.member_count);
  const mhm = h.has_mhm ? Math.min(Number(h.mhm_member_count ?? 0), anggota) : 0;
  const kondisi = normalisasiKondisi(entri[0]?.kondisiSumberAir ?? h.source_condition);
  const liter = (kapasitas * persen) / 100;

  const hasil = hitungKetahananAir({
    jumlahAnggota: anggota,
    sumberAirUtama: sumberKeKalkulator(h.water_source_type),
    kondisiSumberAir: kondisi,
    volumeCadanganLiter: liter,
    kebutuhanMhm: mhm > 0,
    jumlahAnggotaMhm: mhm,
  });

  if (!hasil.valid) {
    return { ok: false, error: hasil.errors?.join(" ") || "Data belum valid." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("water_assessments").insert({
    household_id: h.household_id,
    assessed_by_user_id: user.id,
    available_water_liters: hasil.cadanganAirLiter,
    daily_need_liters: hasil.kebutuhanHarianLiter,
    estimated_duration_days: hasil.durasiHari,
    water_condition: STATUS_DB[hasil.status] ?? "undetermined",
    crisis_mode: hasil.status === "Mode Krisis",
    assessment_notes: hasil.alasanStatus ?? null,
    input_snapshot: {
      sumber: "monitoring",
      catatan,
      anggota,
      anggotaMhm: mhm,
      sumberAir: h.water_source_type ?? "",
      kondisi,
      kapasitas,
      persen,
      luasAtap: Number(h.roof_area_m2 ?? 0) || 0,
      lokasi: entri[0]?.lokasi || lokasiDariRumah(h),
    },
  });

  if (error) {
    console.error("[simpanCatatanMonitoring]", error);
    return { ok: false, error: "Catatan belum dapat disimpan. Coba lagi." };
  }

  // Menjaga persentase terbaru pada profil rumah tangga (kegagalan di sini tidak membatalkan catatan).
  const { error: errRumah } = await supabase
    .from("households")
    .update({ water_volume_percentage: persen, updated_at: new Date().toISOString() })
    .eq("household_id", h.household_id)
    .eq("owner_user_id", user.id);

  if (errRumah) console.error("[simpanCatatanMonitoring] rumah tangga:", errRumah);

  return { ok: true };
}