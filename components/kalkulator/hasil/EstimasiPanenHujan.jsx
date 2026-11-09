"use client";

import Link from "next/link";
import { CloudRain } from "lucide-react";

const formatAngka = (angka) =>
  Number(angka).toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  });

export default function EstimasiPanenHujan({ hasil, masukan }) {
  const potensi = hasil?.potensiPanenAirHujanLiter;
  const curahHujan = hasil?.curahHujanMmPerBulan;
  const wilayah = hasil?.wilayah || masukan?.lokasi || "";
  const luasAtap = Number(masukan?.luasAtap) || 0;

  return (
    <section
      className="rounded-[28px] border-2 border-aira-sage bg-aira-sage/15 p-6 shadow-soft sm:p-7"
      aria-labelledby="rain-result"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-aira-sage">
          <CloudRain className="size-6 text-aira-primary-dark" />
        </span>

        <div>
          <h3
            id="rain-result"
            className="font-heading text-xl font-semibold text-aira-primary"
          >
            Estimasi Panen Air Hujan
          </h3>

          <p className="mt-1 text-sm text-aira-text/65">
            Potensi tambahan air dari atap rumah.
          </p>
        </div>
      </div>

      {potensi != null ? (
        <div className="mt-5 lg:grid lg:grid-cols-2 lg:gap-6">
          <div>
            <p className="font-heading text-4xl font-extrabold leading-none text-aira-primary">
              {formatAngka(potensi)}
              <span className="ml-2 text-base font-semibold">
                liter/bulan
              </span>
            </p>

            {Number(hasil?.kebutuhanHarianLiter) > 0 && (
              <p className="mt-2 text-sm text-aira-text/75">
                Setara sekitar{" "}
                <strong>
                  {(potensi / hasil.kebutuhanHarianLiter).toLocaleString(
                    "id-ID",
                    { minimumFractionDigits: 1, maximumFractionDigits: 1 }
                  )}{" "}
                  hari
                </strong>{" "}
                kebutuhan air rumah tangga Anda.
              </p>
            )}

            {wilayah && (
              <p className="mt-2 text-sm text-aira-text/75">
                Berdasarkan wilayah {wilayah}.
              </p>
            )}
          </div>

          <div className="mt-5 rounded-2xl bg-white/80 px-4 py-3 text-sm leading-relaxed text-aira-text/80 lg:mt-0">
            <p className="font-semibold text-aira-primary">
              Dasar estimasi:
            </p>

            <ul className="mt-2 space-y-0.5">
              <li>Luas atap: {formatAngka(luasAtap)} m²</li>
              <li>Curah hujan: {formatAngka(curahHujan)} mm/bulan</li>
              <li>Koefisien tampung: 0,8</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl bg-white/80 p-4">
          <p className="text-sm leading-relaxed text-aira-text/80">
            Estimasi panen air hujan belum dapat dihitung. Pilih lokasi dan
            isi luas atap rumah pada kalkulator untuk memperoleh estimasinya.
          </p>

          <Link
            href="/kalkulator-air"
            className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-aira-primary underline"
          >
            Lengkapi data panen hujan
          </Link>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-aira-text/60">
        Estimasi menggunakan data curah hujan wilayah yang bersifat simulasi.
        Hasil aktual bergantung pada kondisi cuaca dan efektivitas penampungan.
        Air hujan perlu diolah sebelum dikonsumsi.
      </p>
    </section>
  );
}