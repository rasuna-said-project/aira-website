const ZONA_WAKTU = "Asia/Jakarta";
const BULAN_SINGKAT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// Salam sesuai jam di WIB: pagi 04-10, siang 11-14, sore 15-17, malam 18-03.
export function salamWaktu(sekarang = new Date()) {
  const jam = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: ZONA_WAKTU }).format(sekarang)
  ) % 24;

  if (jam >= 4 && jam <= 10) return "Selamat pagi";
  if (jam >= 11 && jam <= 14) return "Selamat siang";
  if (jam >= 15 && jam <= 17) return "Selamat sore";
  return "Selamat malam";
}

// Contoh: "Senin, 12 Oktober 2026".
export function tanggalLengkap(sekarang = new Date()) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONA_WAKTU,
  }).format(sekarang);
}

// "2026-10-12" -> { tanggalSingkat: "12 Okt", tanggalPenuh: "12 Okt 2026" }
export function formatTanggalIso(iso) {
  const [tahun, bulan, hari] = String(iso).split("-").map(Number);
  const nama = BULAN_SINGKAT[bulan - 1] ?? "";
  return { tanggalSingkat: `${hari} ${nama}`, tanggalPenuh: `${hari} ${nama} ${tahun}` };
}
