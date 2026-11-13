export default function DashboardProfile({ nama, inisial, anggotaKeluarga }) {
  return (
    <div className="mb-4 hidden items-center gap-3 rounded-3xl border border-aira-primary/5 bg-white p-4 shadow-soft lg:flex">
      <span className="grid size-12 place-items-center rounded-full bg-aira-primary font-heading font-bold text-white">
        {inisial}
      </span>

      <div className="min-w-0">
        <p className="truncate font-semibold">{nama || "Pengguna AIRA"}</p>
        <p className="text-xs text-aira-text/60">
          {anggotaKeluarga ? `Keluarga ${anggotaKeluarga} orang` : "Profil keluarga belum diisi"}
        </p>
      </div>
    </div>
  );
}
