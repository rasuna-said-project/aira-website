"use client";

import Link from "next/link";
import { CloudRain, Gauge, Home, MapPin } from "lucide-react";

import { formatLokasiWilayah } from "@/lib/formatWilayah";
import { KOEFISIEN_PANEN_AIR_HUJAN } from "@/services/calculatorService";

const formatAngka = (angka) =>
  Number(angka).toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  });

const CATATAN_SIMULASI =
  "Estimasi menggunakan data curah hujan wilayah yang bersifat simulasi. Hasil aktual bergantung pada kondisi cuaca dan efektivitas penampungan. Air hujan perlu diolah sebelum dikonsumsi.";

export default function EstimasiPanenHujan({ hasil, masukan }) {
  const potensi = hasil?.potensiPanenAirHujanLiter;
  const curahHujan = hasil?.curahHujanMmPerBulan;
  const bisaDihitung = potensi != null && curahHujan != null;

  // Format nama wilayah dari lib/formatWilayah (hanya untuk tampilan).
  const wilayah = formatLokasiWilayah(
    hasil?.wilayah || masukan?.lokasi || ""
  );

  const luasAtap = Number(masukan?.luasAtap) || 0;
  const kebutuhanHarian = Number(hasil?.kebutuhanHarianLiter) || 0;

  const dasarEstimasi = [
    { ikon: Home, label: "Luas atap", nilai: `${formatAngka(luasAtap)} m²` },
    {
      ikon: CloudRain,
      label: "Curah hujan",
      nilai: `${formatAngka(curahHujan)} mm/bulan`,
    },
    {
      ikon: Gauge,
      label: "Koefisien tampung",
      nilai: formatAngka(KOEFISIEN_PANEN_AIR_HUJAN),
    },
  ];

  return (
    <section
      className="rounded-[28px] border-2 border-aira-sage bg-aira-sage/15 p-6 shadow-soft sm:p-8"
      aria-labelledby="rain-result"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-aira-sage">
            <CloudRain
              className="size-6 text-aira-primary-dark"
              aria-hidden="true"
            />
          </span>

          <div>
            <h3
              id="rain-result"
              className="text-xl font-semibold text-aira-primary"
            >
              Estimasi Panen Air Hujan
            </h3>

            <p className="text-sm text-aira-text/70">
              Potensi tambahan air dari atap rumah.
            </p>
          </div>
        </div>

        {bisaDihitung && (
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-aira-primary">
            Estimasi bulanan
          </span>
        )}
      </div>

      {bisaDihitung ? (
        <>
          <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-stretch">
            <div className="flex flex-col justify-center gap-3">
              <p className="flex flex-wrap items-baseline gap-x-2 font-heading text-[56px] font-extrabold leading-none text-aira-primary">
                {formatAngka(potensi)}
                <span className="text-lg font-semibold">liter/bulan</span>
              </p>

              {kebutuhanHarian > 0 && (
                <p className="text-base leading-relaxed text-aira-text/80">
                  Setara sekitar{" "}
                  <strong className="font-semibold">
                    {(potensi / kebutuhanHarian).toLocaleString("id-ID", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}{" "}
                    hari
                  </strong>{" "}
                  kebutuhan air rumah tangga Anda.
                </p>
              )}
            </div>

            <div className="flex flex-col rounded-2xl bg-white/80 p-6">
              <p className="text-sm font-semibold text-aira-primary">
                Dasar estimasi
              </p>

              <ul className="mt-2 flex flex-1 flex-col divide-y divide-aira-primary/10 text-[15px] text-aira-text/80">
                {dasarEstimasi.map((item) => (
                  <li
                    key={item.label}
                    className="flex flex-1 items-center justify-between gap-4 py-3"
                  >
                    <span className="inline-flex items-center gap-2">
                      <item.ikon
                        className="size-4 text-aira-primary"
                        aria-hidden="true"
                      />
                      {item.label}
                    </span>

                    <span className="text-right font-semibold text-aira-text">
                      {item.nilai}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 border-t border-aira-sage/60 pt-4">
            {wilayah && (
              <p className="flex items-center gap-2 text-[15px] text-aira-text/80">
                <MapPin
                  className="size-4 shrink-0 text-aira-primary"
                  aria-hidden="true"
                />
                Berdasarkan wilayah {wilayah}
              </p>
            )}

            <p className="mt-2 text-[13px] leading-relaxed text-aira-text/70">
              {CATATAN_SIMULASI}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="mt-5 rounded-2xl bg-white/80 px-4 py-4 text-[15px] leading-relaxed text-aira-text/80">
            <p>
              Estimasi panen air hujan belum dapat dihitung. Pilih lokasi dan
              isi luas atap rumah pada kalkulator untuk memperoleh
              estimasinya.
            </p>

            <Link
              href="/kalkulator-air"
              className="mt-2 inline-flex min-h-11 items-center text-sm font-bold text-aira-primary underline"
            >
              Lengkapi data panen hujan
            </Link>
          </div>

          <p className="mt-4 text-[13px] leading-relaxed text-aira-text/70">
            {CATATAN_SIMULASI}
          </p>
        </>
      )}
    </section>
  );
}
