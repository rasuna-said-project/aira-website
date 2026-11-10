// DATA SIMULASI untuk Dashboard User (B01). Ganti dengan data Supabase saat endpoint Tria siap
// (households, household_members, catatan monitoring, water_point_contributions).
// Tanggal memakai format ISO agar mudah diganti dengan kolom timestamp dari database.

export const profilKeluargaSimulasi = {
  anggota: 4,
  anggotaMhm: 2,
  kapasitasTandonLiter: 1000,
  kondisiSumberAir: "Terbatas", // pilihan: Normal, Terbatas, Tidak berfungsi, Belum diketahui
};

// Catatan kondisi air manual. Urutan: terbaru lebih dulu.
export const catatanMonitoringSimulasi = [
  { id: 6, tanggal: "2026-10-12", waktu: "06.40", liter: 700, catatan: "Cuaca sangat panas" },
  { id: 5, tanggal: "2026-10-10", waktu: "06.50", liter: 780, catatan: "Anak-anak mandi dua kali sehari" },
  { id: 4, tanggal: "2026-10-08", waktu: "16.20", liter: 950, catatan: "Isi ulang dari mobil tangki BPBD" },
  { id: 3, tanggal: "2026-10-06", waktu: "06.30", liter: 610, catatan: "Air PDAM mati sejak kemarin" },
  { id: 2, tanggal: "2026-10-04", waktu: "07.10", liter: 760, catatan: "Pemakaian normal" },
  { id: 1, tanggal: "2026-10-02", waktu: "06.45", liter: 900, catatan: "Tandon terisi dari PDAM" },
];

export const kontribusiSimulasi = [
  { id: 1, nama: "Posko Bantuan Tangki Air BPBD Rongkop", status: "Menunggu Verifikasi" },
  { id: 2, nama: "Sumur Bor Komunal Padukuhan Bohol", status: "Terverifikasi" },
  { id: 3, nama: "Embung Botodayaan", status: "Perlu Perbaikan" },
  { id: 4, nama: "Sumur Pribadi Keluarga Pak Paijo", status: "Ditolak" },
];
