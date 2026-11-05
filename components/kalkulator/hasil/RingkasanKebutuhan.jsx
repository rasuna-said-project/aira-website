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
    <section>
      <h3 className="mb-3 font-semibold text-aira-primary">
        Ringkasan Kebutuhan Air
      </h3>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ringkasan.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-white/85 px-3 py-4 text-center"
          >
            <dd className="font-heading text-lg font-bold text-aira-primary sm:text-xl">
              {item.value}
            </dd>

            <dt className="mt-1 text-xs leading-snug text-aira-text/70">
              {item.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
} 