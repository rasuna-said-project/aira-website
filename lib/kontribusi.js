// Pemetaan label tampilan <-> nilai database untuk fitur kontribusi.
// Aman dipakai di server maupun client (tidak ada akses database).

export const JENIS_KONTRIBUSI = [
  { label: "Sumur bor", value: "public_well" },
  { label: "Mata air", value: "spring" },
  { label: "Tandon umum", value: "storage_tank" },
  { label: "Tangki BPBD", value: "emergency_tank" },
  { label: "Hidran umum", value: "hydrant" },
  { label: "Embung", value: "reservoir" },
  { label: "Lainnya", value: "other" },
];

export const KETERSEDIAAN = [
  { label: "Tersedia", value: "available" },
  { label: "Terbatas", value: "limited" },
  { label: "Tidak Tersedia", value: "unavailable" },
  { label: "Belum Diketahui", value: "unknown" },
];

export const SUMBER_INFORMASI = [
  "Pengamatan langsung",
  "Pengelola sumber air",
  "Masyarakat sekitar",
  "Pemerintah desa",
  "Sumber lainnya",
];

// Status kontribusi di database -> label yang tampil
export const STATUS_LABEL = {
  pending: "Menunggu Verifikasi",
  approved: "Terverifikasi",
  needs_revision: "Perlu Perbaikan",
  rejected: "Ditolak",
};

// Label keputusan admin -> nilai database
export const KEPUTUSAN_DARI_LABEL = {
  Terverifikasi: "approved",
  "Perlu Perbaikan": "needs_revision",
  Ditolak: "rejected",
};

const norm = (s) => String(s ?? "").trim().toLowerCase();

export const jenisKeDb = (label) =>
  JENIS_KONTRIBUSI.find((j) => norm(j.label) === norm(label))?.value ?? null;

export const jenisKeLabel = (value) =>
  JENIS_KONTRIBUSI.find((j) => j.value === value)?.label ?? "Lainnya";

export const ketersediaanKeDb = (label) =>
  KETERSEDIAAN.find((k) => norm(k.label) === norm(label))?.value ?? null;

export const ketersediaanKeLabel = (value) =>
  KETERSEDIAAN.find((k) => k.value === value)?.label ?? "Belum Diketahui";

// Mengambil koordinat dari tautan Google Maps yang sudah panjang.
// Tautan pendek (maps.app.goo.gl) diselesaikan di server (lihat contributionService).
export function parseKoordinat(url) {
  if (!url) return null;
  let s = String(url);
  try {
    s = decodeURIComponent(s);
  } catch {}

  const pola = [
    /@(-?\d{1,3}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/,
    /!3d(-?\d{1,3}(?:\.\d+)?)!4d(-?\d{1,3}(?:\.\d+)?)/,
    /[?&](?:q|query|ll|destination|center)=(-?\d{1,3}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)/,
  ];

  for (const re of pola) {
    const m = s.match(re);
    if (!m) continue;
    const latitude = Number(m[1]);
    const longitude = Number(m[2]);
    if (Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180) {
      return { latitude, longitude };
    }
  }
  return null;
}

// Dasar perubahan saat admin mengedit titik air (Kelola Titik Air)
export const SUMBER_PEMBARUAN = [
  "Pantauan langsung admin",
  "Pengelola setempat",
  "Laporan warga",
  "Lainnya",
];