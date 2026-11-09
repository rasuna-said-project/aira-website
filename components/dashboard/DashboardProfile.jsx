export default function DashboardProfile({ profile }) {
  const fullName = profile?.full_name || "Pengguna AIRA";

  const initials = fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_5px_20px_rgba(23,107,120,0.08)]">
      {/* Avatar */}
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-aira-primary text-sm font-bold text-white">
        {initials || "AR"}
      </div>

      {/* Informasi pengguna */}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-aira-text">
          {fullName}
        </p>

        <p className="truncate text-xs text-aira-text/50">
          {profile?.email || "Pengguna AIRA"}
        </p>
      </div>
    </div>
  );
} 