import { CheckCircle2, Clock3, AlertCircle, XCircle, Droplets } from "lucide-react";

const badgeBase =
  "inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium";

export function VerificationBadge({ status }) {
  const styles = {
    "Menunggu Verifikasi": { className: "bg-sky-100 text-sky-800", icon: Clock3 },
    Terverifikasi: { className: "bg-aira-primary text-white", icon: CheckCircle2 },
    "Perlu Perbaikan": { className: "bg-amber-100 text-amber-800", icon: AlertCircle },
    Ditolak: { className: "bg-[#FCE3DC] text-[#A94D37]", icon: XCircle },
  };

  const config = styles[status] || styles["Menunggu Verifikasi"];
  const Icon = config.icon;

  return (
    <span className={`${badgeBase} ${config.className}`}>
      <Icon size={13} className="shrink-0" />
      {status}
    </span>
  );
}

export function AvailabilityBadge({ status }) {
  const styles = {
    Tersedia: "bg-[#C8E9DF] text-[#286B59]",
    Terbatas: "bg-[#FCE8B5] text-[#87651D]",
    "Belum Diketahui": "bg-[#E9ECEC] text-[#536267]",
  };

  return (
    <span className={`${badgeBase} ${styles[status] || styles["Belum Diketahui"]}`}>
      <Droplets size={13} className="shrink-0" />
      {status}
    </span>
  );
} 