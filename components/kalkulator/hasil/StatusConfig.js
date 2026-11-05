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
      "Cadangan air diperkirakan dapat memenuhi kebutuhan rumah tangga selama lebih dari 3 hari. Tetap gunakan air secara bijak dan pantau persediaan secara berkala.",
    rekomendasi: [
      "Catat volume air dalam tandon secara berkala.",
      "Pertahankan kebiasaan hemat air dalam aktivitas sehari-hari.",
      "Siapkan penampungan tambahan sebagai antisipasi perubahan kondisi.",
    ],
  },

  waspada: {
    label: "Waspada",
    judul: "Cadangan air mulai perlu diperhatikan",
    ikon: AlertTriangle,
    panel: "border-[#E8C77D] bg-[#FDF4DF]",
    chip: "bg-[#F6DFA8] text-[#74520C]",
    ikonBg: "bg-white",
    bar: "bg-[#D99A1E]",
    pesan:
      "Cadangan air diperkirakan dapat memenuhi kebutuhan selama 1 sampai 3 hari. Mulailah menghemat penggunaan air dan persiapkan sumber air alternatif.",
    rekomendasi: [
      "Prioritaskan penggunaan air untuk minum, memasak, dan kebersihan.",
      "Tampung air ketika sumber air masih tersedia.",
      "Periksa titik air alternatif sebelum persediaan habis.",
    ],
  },

  krisis: {
    label: "Mode Krisis",
    judul: "Segera persiapkan sumber air tambahan",
    ikon: Siren,
    panel: "border-aira-peach bg-aira-peach/20",
    chip: "bg-aira-peach text-[#713421]",
    ikonBg: "bg-white",
    bar: "bg-[#D4573A]",
    pesan:
      "Cadangan air diperkirakan hanya dapat memenuhi kebutuhan kurang dari 1 hari. Utamakan kebutuhan esensial dan segera cari sumber air alternatif.",
    rekomendasi: [
      "Batasi penggunaan air untuk kebutuhan yang paling esensial.",
      "Hubungi RT/RW, tetangga, atau pengelola sumber air setempat.",
      "Cari titik air alternatif untuk memenuhi kebutuhan rumah tangga.",
    ],
  },

  belum: {
    label: "Belum Dapat Ditentukan",
    judul: "Status ketahanan air belum dapat ditentukan",
    ikon: HelpCircle,
    panel: "border-[#D9C9A8] bg-aira-sand",
    chip: "bg-white text-aira-text",
    ikonBg: "bg-white",
    bar: "bg-aira-text/30",
    pesan:
      "Status ketahanan air belum dapat ditentukan berdasarkan informasi yang tersedia. Periksa kembali data atau pastikan kondisi sumber air utama Anda.",
    rekomendasi: [
      "Periksa kembali data yang dimasukkan pada kalkulator.",
      "Pastikan kondisi sumber air utama sudah diketahui.",
      "Sementara itu, periksa ketersediaan titik air alternatif.",
    ],
  },
};

export function ambilStatusTampilan(statusKey) {
  return STATUS_TAMPILAN[statusKey] || STATUS_TAMPILAN.belum;
} 