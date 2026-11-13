import { ShieldCheck, Clock3, AlertCircle, XCircle } from "lucide-react";

const statusConfig = {
  "Menunggu Verifikasi": {
    className: "bg-[#DCEEF8] text-[#34799A]",
    icon: Clock3,
  },
  Terverifikasi: {
    className: "bg-[#176B78] text-white",
    icon: ShieldCheck,
  },
  "Perlu Perbaikan": {
    className: "bg-[#F9D989] text-[#76591C]",
    icon: AlertCircle,
  },
  Ditolak: {
    className: "bg-[#F4C9BD] text-[#8C5143]",
    icon: XCircle,
  },
};

export default function VerificationBadge({ status }) {
  const config = statusConfig[status] || statusConfig["Menunggu Verifikasi"];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ${config.className}`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
} 