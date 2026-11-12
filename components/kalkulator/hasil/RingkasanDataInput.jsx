import {
  Container,
  Droplets,
  Home,
  MapPin,
  Percent,
  ShieldCheck,
  Users,
} from "lucide-react";

import { formatLokasiWilayah } from "@/lib/formatWilayah";

const formatAngka = (angka) =>
  Number(angka).toLocaleString("id-ID", { maximumFractionDigits: 2 });

// Warna chip "Kondisi sumber" mengikuti Figma.
const CHIP_KONDISI = {
  Normal: "bg-aira-sage/40 text-aira-primary-dark",
  Terbatas: "bg-aira-peach/30 text-[#9a4a33]",
  "Tidak Berfungsi": "bg-[#fbe3dc] text-aira-coral-dark",
};

// Card "Ringkasan Data Input": data yang dimasukkan pengguna pada kalkulator.
export default function RingkasanDataInput({ masukan }) {
  const kapasitas = Number(masukan?.kapasitas) || 0;
  const adaKapasitas = kapasitas > 0;
  const persen = Math.min(100, Math.max(0, Number(masukan?.persen) || 0));
  const luasAtap = Number(masukan?.luasAtap) || 0;
  const lokasi = formatLokasiWilayah(masukan?.lokasi || "");

  const baris = [
    { kunci: "lokasi", ikon: MapPin, label: "Lokasi", nilai: lokasi || "—" },
    {
      kunci: "anggota",
      ikon: Users,
      label: "Jumlah anggota keluarga",
      nilai: `${masukan?.anggota ?? "—"} orang`,
    },
    {
      kunci: "sumber",
      ikon: Droplets,
      label: "Sumber air utama",
      nilai: masukan?.sumberAir || "—",
    },
    {
      kunci: "kondisi",
      ikon: ShieldCheck,
      label: "Kondisi sumber",
      nilai: masukan?.kondisi || "—",
    },
    ...(adaKapasitas
      ? [
          {
            kunci: "kapasitas",
            ikon: Container,
            label: "Kapasitas wadah",
            nilai: `${formatAngka(kapasitas)} L`,
          },
          {
            kunci: "persen",
            ikon: Percent,
            label: "Persentase isi",
            nilai: `${formatAngka(persen)}%`,
          },
        ]
      : []),
    {
      kunci: "atap",
      ikon: Home,
      label: "Luas atap",
      nilai: luasAtap ? `${formatAngka(luasAtap)} m²` : "—",
    },
  ];

  return (
    <section
      className="rounded-[28px] border border-aira-primary/12 bg-white p-7 shadow-soft"
      aria-labelledby="ringkasan-input"
    >
      <h3
        id="ringkasan-input"
        className="font-heading text-xl font-bold text-aira-primary"
      >
        Ringkasan Data Input
      </h3>

      <p className="mt-1 text-sm text-aira-text/65">
        Data yang Anda masukkan untuk perhitungan ini.
      </p>

      <dl className="mt-3 divide-y divide-aira-primary/10">
        {baris.map((item) => (
          <div
            key={item.kunci}
            className="flex min-h-11 items-center justify-between gap-4 py-2"
          >
            <dt className="flex items-center gap-3 text-sm text-aira-text/65">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-aira-primary/10">
                <item.ikon
                  className="size-4 text-aira-primary"
                  aria-hidden="true"
                />
              </span>
              {item.label}
            </dt>

            <dd className="text-right text-[15px] font-semibold text-aira-text">
              {item.kunci === "kondisi" ? (
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    CHIP_KONDISI[masukan?.kondisi] ||
                    "bg-aira-sand text-aira-text/80"
                  }`}
                >
                  {item.nilai}
                </span>
              ) : item.kunci === "persen" ? (
                <div className="ml-auto w-28">
                  <span>{item.nilai}</span>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-aira-primary/10">
                    <div
                      className="h-full rounded-full bg-aira-secondary"
                      style={{ width: `${persen}%` }}
                    />
                  </div>
                </div>
              ) : (
                item.nilai
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
