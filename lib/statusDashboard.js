import {
  KEBUTUHAN_PER_ORANG_LITER_HARI,
  TAMBAHAN_AIR_MHM_PER_ORANG_LITER_HARI,
  klasifikasikanStatus,
  STATUS_AMAN,
  STATUS_KRISIS,
  STATUS_TIDAK_DITENTUKAN,
  STATUS_WASPADA,
} from "@/services/calculatorService";

// Tampilan status pada Dashboard User (mengikuti Figma Make). Aturan klasifikasi memakai
// klasifikasikanStatus milik services/calculatorService.js agar sama dengan kalkulator.
export const TAMPILAN_STATUS_DASHBOARD = {
  aman: {
    label: "Aman / Relatif Mencukupi",
    chip: "bg-aira-sage text-aira-primary-dark",
    bar: "bg-aira-primary",
    panel: "bg-aira-sage/35 border-aira-sage",
  },
  waspada: {
    label: "Waspada",
    chip: "bg-aira-warning-border text-aira-warning-text",
    bar: "bg-aira-warning-strong",
    panel: "bg-aira-warning border-aira-warning-line",
  },
  belum: {
    label: "Belum Dapat Ditentukan",
    chip: "bg-white text-aira-text",
    bar: "bg-aira-text/30",
    panel: "bg-aira-sand border-aira-sand-dark",
  },
  krisis: {
    label: "Mode Krisis",
    chip: "bg-aira-peach text-aira-danger-text",
    bar: "bg-aira-danger",
    panel: "bg-aira-peach/25 border-aira-peach",
  },
};

const KUNCI_DARI_LABEL = {
  [STATUS_AMAN]: "aman",
  [STATUS_WASPADA]: "waspada",
  [STATUS_KRISIS]: "krisis",
  [STATUS_TIDAK_DITENTUKAN]: "belum",
};

export function hitungKebutuhanHarian(anggota, anggotaMhm = 0) {
  return (
    Number(anggota) * KEBUTUHAN_PER_ORANG_LITER_HARI +
    Number(anggotaMhm) * TAMBAHAN_AIR_MHM_PER_ORANG_LITER_HARI
  );
}

// Menghitung hari tersisa, status, dan catatan penjelas status dari satu catatan volume.
export function hitungStatusDashboard({ liter, anggota, anggotaMhm, kondisiSumberAir }) {
  const kebutuhanHarian = hitungKebutuhanHarian(anggota, anggotaMhm);
  const hari = kebutuhanHarian > 0 ? Number(liter) / kebutuhanHarian : 0;
  const { statusDurasi, statusAkhir } = klasifikasikanStatus(hari, kondisiSumberAir);
  const statusKey = KUNCI_DARI_LABEL[statusAkhir] ?? "belum";

  let catatanStatus = null;
  if (kondisiSumberAir === "Tidak berfungsi") {
    catatanStatus = "Status Mode Krisis karena kondisi sumber terakhir Tidak Berfungsi.";
  } else if (kondisiSumberAir === "Terbatas" && statusDurasi === STATUS_AMAN) {
    catatanStatus = "Status dibatasi Waspada karena kondisi sumber terakhir Terbatas.";
  }

  return { hari, kebutuhanHarian, statusKey, tampilan: TAMPILAN_STATUS_DASHBOARD[statusKey], catatanStatus };
}

// Angka desimal berkoma, contoh 10 -> "10,0".
export const formatDesimal = (angka, digit = 1) => Number(angka).toFixed(digit).replace(".", ",");
