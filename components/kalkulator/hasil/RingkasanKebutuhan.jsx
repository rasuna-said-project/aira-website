"use client";

const formatLiter = (angka) =>
  `${Number(angka).toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  })} L`;

// Kotak putih "Ringkasan Kebutuhan Air" di dalam card status.
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
    <section
      className="mt-6 rounded-2xl border border-aira-primary/10 bg-white/70 p-4"
      aria-labelledby="ringkasan-kebutuhan"
    >
      <h3
        id="ringkasan-kebutuhan"
        className="text-[13px] font-bold uppercase tracking-wider text-aira-primary/70"
      >
        Ringkasan Kebutuhan Air
      </h3>

      <dl className="mt-3 grid grid-cols-2 gap-y-4 text-center sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-aira-primary/10">
        {ringkasan.map((item) => (
          <div key={item.label} className="px-2">
            <dd className="font-heading text-2xl font-semibold text-aira-primary">
              {item.value}
            </dd>

            <dt className="mt-0.5 text-[13px] text-aira-text/75">
              {item.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
