import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Siren,
} from "lucide-react";

export const STATUS_TAMPILAN = {
  aman: {
    label: "Aman / Relatif Mencukupi",
    judul: "Cadangan air Anda relatif mencukupi",
    ikon: CheckCircle2,
    panel: "border-aira-sage bg-aira-sage/25",
    chip: "bg-aira-sage text-aira-primary-dark",
    ikonBg: "bg-white",
    bar: "bg-aira-primary",
    pesan:
      "Cadangan diperkirakan bertahan lebih dari 3 hari pada tingkat pemakaian saat ini. Tetap jaga kebiasaan hemat dan pantau secara berkala.",
    rekomendasi: [
      "Catat volume tandon setiap minggu",
      "Siapkan wadah penampung air hujan",
      "Bagikan informasi titik air ke tetangga",
    ],
  },

  waspada: {
    label: "Waspada",
    judul: "Cadangan air mulai menipis",
    ikon: AlertTriangle,
    panel: "border-[#E8C77D] bg-[#FDF4DF]",
    chip: "bg-[#F6DFA8] text-[#74520C]",
    ikonBg: "bg-white",
    bar: "bg-[#D99A1E]",
    pesan:
      "Cadangan diperkirakan bertahan antara 1 sampai 3 hari. Mulailah menghemat dan siapkan sumber air alternatif.",
    rekomendasi: [
      "Prioritaskan air untuk minum, memasak, dan kebersihan",
      "Gunakan ulang air bilasan untuk menyiram atau menyiram toilet",
      "Cek titik air terdekat sebelum cadangan habis",
    ],
  },

  krisis: {
    label: "Mode Krisis",
    judul: "Segera cari sumber air tambahan",
    ikon: Siren,
    panel: "border-aira-peach bg-aira-peach/20",
    chip: "bg-aira-peach text-[#713421]",
    ikonBg: "bg-white",
    bar: "bg-[#D4573A]",
    pesan:
      "Cadangan diperkirakan bertahan kurang dari 1 hari. Batasi pemakaian ke kebutuhan esensial dan carilah titik air alternatif hari ini.",
    rekomendasi: [
      "Batasi pemakaian ke kebutuhan dasar (minum dan sanitasi)",
      "Hubungi tetangga, RT/RW, atau layanan air darurat setempat",
      "Ikuti petunjuk resmi untuk mengolah air sebelum diminum",
    ],
  },

  belum: {
    label: "Belum Dapat Ditentukan",
    judul: "Status belum dapat ditentukan",
    ikon: HelpCircle,
    panel: "border-[#D9C9A8] bg-aira-sand",
    chip: "bg-white text-aira-text",
    ikonBg: "bg-white",
    bar: "bg-aira-text/30",
    pesan:
      "Status belum dapat ditentukan dari data yang tersedia.",
    rekomendasi: [
      "Periksa kembali data pada kalkulator",
      "Pilih kondisi sumber air bila belum diketahui",
      "Sementara itu, cek titik air terdekat",
    ],
  },
};

export function ambilStatusTampilan(statusKey) {
  return STATUS_TAMPILAN[statusKey] || STATUS_TAMPILAN.belum;
}
