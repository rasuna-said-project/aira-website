// Kepala halaman Dashboard User (judul, deskripsi, dan aksi opsional) sesuai Figma Make.
export default function DashboardPageHead({ title, desc, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold leading-tight text-aira-primary sm:text-4xl">{title}</h1>
        {desc && <p className="mt-3 text-aira-text/80">{desc}</p>}
      </div>
      {action}
    </div>
  );
}
