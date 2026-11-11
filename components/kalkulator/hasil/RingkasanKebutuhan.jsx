"use client";

import PenjelasanAira from "@/components/kalkulator/hasil/PenjelasanAira";

const formatLiter = (angka) =>
  `${Number(angka).toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  })} L`;

const formatTanggal = (iso) => {
  const d = new Date(iso);

  if (!iso || Number.isNaN(d.getTime())) return null;

  const p = Object.fromEntries(
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    })
      .formatToParts(d)
      .map((x) => [x.type, x.value])
  );

  return `${p.day} ${p.month} ${p.year}`;
};

export default function RingkasanKebutuhan({
  hasil,
  masukan,
  status,
}) {
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

  let pesanStatus = status?.pesan || "";

  if (valid && masukan?.kondisi === "Tidak Berfungsi") {
    pesanStatus =
      "Sumber air utama tidak berfungsi, sehingga status tetap Mode Krisis meskipun cadangan masih tersedia.";
  } else if (
    valid &&
    masukan?.kondisi === "Terbatas" &&
    hasil.statusDurasi === "Aman / Relatif Mencukupi"
  ) {
    pesanStatus =
      "Durasi cadangan lebih dari 3 hari, tetapi kondisi sumber air terbatas sehingga status akhir dibatasi pada Waspada.";
  } else if (valid && masukan?.kondisi === "Belum diketahui") {
    pesanStatus =
      "Kondisi sumber air utama belum diketahui, sehingga status akhir belum dapat ditentukan. Pilih kondisinya pada kalkulator lalu hitung ulang.";
  }

  return (
    <div aria-labelledby="ringkasan-kebutuhan">
      <h3
        id="ringkasan-kebutuhan"
        className="font-heading text-xs font-bold uppercase tracking-wider text-aira-primary/70"
      >
        Ringkasan Kebutuhan Air
      </h3>

      <dl className="mt-4 grid grid-cols-2 gap-y-4 text-center sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-aira-primary/10">
        {ringkasan.map((item) => (
          <div key={item.label} className="px-2">
            <dd className="font-heading text-lg font-bold text-aira-primary sm:text-xl">
              {item.value}
            </dd>

            <dt className="mt-0.5 text-xs text-aira-text/75">
              {item.label}
            </dt>
          </div>
        ))}
      </dl>

      {/* Pesan status dan penjelasan AI */}
      <div className="mt-6 border-t border-aira-primary/10 pt-5">
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-aira-text/85">
            {pesanStatus}
          </p>

          <PenjelasanAira
            key={hasil?.waktuPerhitunganUtc}
            hasil={hasil}
            masukan={masukan}
          />
        </div>
      </div>

      {/* Disclaimer dan tanggal perhitungan */}
      <p className="mt-6 border-t border-aira-primary/10 pt-4 text-xs leading-relaxed text-aira-text/60">
        Hasil berupa estimasi berdasarkan asumsi kebutuhan harian
        dan bukan jaminan kualitas air minum.
        {valid && formatTanggal(hasil.waktuPerhitunganUtc)
          ? ` Dihitung ${formatTanggal(hasil.waktuPerhitunganUtc)}`
          : ""}
      </p>
    </div>
  );
}
