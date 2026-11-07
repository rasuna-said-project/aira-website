"use client";

const formatLiter = (angka) =>
  `${Number(angka).toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  })} L`;

export default function RingkasanKebutuhan({ hasil }) {
  const valid = hasil?.valid === true;

  const ringkasan = [
    {
      label: "Volume cadangan",
      value: valid ? formatLiter(hasil.cadanganAirLiter) : "—",
    },
    {
      label: "Kebutuhan dasar",
      value: valid ? formatLiter(hasil.kebutuhanDasarLiter) : "—",
    },
    {
      label: "Tambahan MHM",
      value: valid ? formatLiter(hasil.tambahanMhmLiter) : "—",
    },
    {
      label: "Total per hari",
      value: valid ? formatLiter(hasil.kebutuhanHarianLiter) : "—",
    },
  ];

  return (
    <div className="rounded-2xl border border-aira-primary/10 bg-white/70 p-4 shadow-soft">
      <h3 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-aira-primary/70">
        Ringkasan Kebutuhan Air
      </h3>

      <div className="grid grid-cols-2 gap-y-3 divide-y divide-gray-200/60 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {ringkasan.map((item, idx) => (
          <div
            key={item.label}
            className={`text-center ${idx > 0 ? "pt-2 sm:pt-0 sm:pl-2" : ""}`}
          >
            <dd className="font-heading text-lg font-bold text-aira-primary sm:text-xl">
              {item.value}
            </dd>
            <dt className="mt-0.5 text-xs text-aira-text/75">
              {item.label}
            </dt>
          </div>
        ))}
      </div>
    </div>
  );
}