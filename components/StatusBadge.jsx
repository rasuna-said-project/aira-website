import { Droplet, ShieldAlert, ShieldCheck } from "lucide-react";

const base = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold";

// Ketersediaan titik air.
const availability = {
  Tersedia: "bg-aira-sage/60 text-aira-primary-dark",
  Terbatas: "bg-aira-warning-border text-aira-warning-text",
  "Tidak Tersedia": "bg-aira-peach/50 text-aira-danger-text",
  "Belum Diketahui": "bg-aira-text/10 text-aira-text",
};

// Status verifikasi data titik air.
const verification = {
  Terverifikasi: "bg-aira-primary text-white",
  "Menunggu Verifikasi": "bg-aira-secondary/20 text-aira-info-text",
  "Perlu Perbaikan": "bg-aira-warning-border text-aira-warning-text",
  Ditolak: "bg-aira-peach/50 text-aira-danger-text",
};

// Ukuran badge status ketahanan air.
const sizes = {
  lg: "rounded-full px-4 py-1.5 text-sm font-semibold",
  md: "rounded-full px-3 py-1 text-sm font-semibold",
  sm: "inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold",
};

export function AvailabilityBadge({ v }) {
  return (
    <span className={`${base} ${availability[v]}`}>
      <Droplet className="size-3.5" /> {v}
    </span>
  );
}

export function VerificationBadge({ v }) {
  const Icon = v === "Terverifikasi" ? ShieldCheck : ShieldAlert;
  return (
    <span className={`${base} ${verification[v]}`}>
      <Icon className="size-3.5" /> {v}
    </span>
  );
}

// Status ketahanan air (Aman, Waspada, Mode Krisis, Belum Dapat Ditentukan).
// `status` adalah hasil statusOf() di data/dashData.js: { label, chip, ... }.
// `short` memotong label menjadi kata pertama sebelum " / ".
export function WaterStatusBadge({ status, size = "lg", short = false }) {
  const label = short ? status.label.split(" / ")[0] : status.label;
  return <span className={`${sizes[size]} ${status.chip}`}>{label}</span>;
}
