"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calculator } from "lucide-react";

import { simpanDraftKalkulator } from "@/lib/hasilKalkulator";
import { formatDesimal } from "@/lib/statusDashboard";

// Penulisan kondisi sumber air pada tampilan Kalkulator.
const KONDISI_TAMPILAN = { "Tidak berfungsi": "Tidak Berfungsi" };
const kondisiTampilan = (kondisi) => KONDISI_TAMPILAN[kondisi] ?? kondisi;

const formatLiter = (angka) => Number(angka).toLocaleString("id-ID");

const teksMasukan = (r) =>
  `${r.anggota} anggota · atap ${r.luasAtap ? `${r.luasAtap} m²` : "—"} · MHM ${r.anggotaMhm ? `${r.anggotaMhm} orang` : "—"}`;

const labelStatus = (status) => status.tampilan.label.split(" / ")[0];

// `riwayat`: [{ ...catatan perhitungan, tanggalPenuh, status }] (status = hasil hitungStatusDashboard).
export default function RiwayatPerhitungan({ riwayat }) {
  const router = useRouter();

  // "Hitung ulang": isi draft Kalkulator dengan data perhitungan ini, lalu buka Kalkulator.
  function hitungUlang(r) {
    const persen = Math.min(100, Math.round((r.liter / r.kapasitasTandonLiter) * 20) * 5);

    simpanDraftKalkulator({
      lokasi: r.lokasi,
      anggota: r.anggota,
      sumberAir: r.sumberAir,
      kondisi: kondisiTampilan(r.kondisiSumberAir),
      kapasitas: String(r.kapasitasTandonLiter),
      persen,
      mhm: r.anggotaMhm > 0,
      anggotaMhm: r.anggotaMhm,
      luasAtap: r.luasAtap ? String(r.luasAtap) : "",
    });
    router.push("/kalkulator-air");
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-[28px] border border-aira-primary/5 bg-white p-6 shadow-soft sm:p-8">
      <h2 className="text-xl font-semibold text-aira-primary">Riwayat perhitungan</h2>
      <p className="mt-1 text-sm text-aira-text/70">
        Pilih &quot;Hitung ulang&quot; untuk membuka kalkulator dengan data yang sudah terisi.
      </p>

      {riwayat.length === 0 ? (
        <div className="mt-5 rounded-2xl bg-aira-bg p-8 text-center">
          <p className="font-semibold text-aira-primary">Belum ada riwayat perhitungan</p>
          <Link
            href="/kalkulator-air"
            className="mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-aira-primary px-6 py-3 font-semibold text-white hover:bg-aira-primary-dark"
          >
            <Calculator className="size-4" /> Hitung kondisi air
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-4 hidden rounded-2xl border border-aira-primary/10 lg:block">
            <table
              className="w-full table-fixed text-left text-[13px]"
              aria-label="Riwayat perhitungan ketahanan air"
            >
              <caption className="sr-only">Riwayat data dan hasil perhitungan ketahanan air rumah tangga</caption>
              <colgroup>
                <col className="w-[12%]" />
                <col className="w-[16%]" />
                <col className="w-[20%]" />
                <col className="w-[12%]" />
                <col className="w-[11%]" />
                <col className="w-[12%]" />
                <col className="w-[17%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-aira-primary/10 bg-aira-bg align-bottom text-[11px] uppercase tracking-wide text-aira-text/60">
                  <th className="px-2.5 py-3 font-semibold">Tanggal</th>
                  <th className="px-2.5 py-3 font-semibold">Lokasi</th>
                  <th className="px-2.5 py-3 font-semibold">Masukan</th>
                  <th className="px-2.5 py-3 font-semibold">Volume</th>
                  <th className="px-2.5 py-3 font-semibold">Ketahanan</th>
                  <th className="px-2.5 py-3 font-semibold">Status</th>
                  <th className="px-2.5 py-3 font-semibold">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {riwayat.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-aira-primary/5 last:border-0 odd:bg-white even:bg-aira-bg/60 hover:bg-aira-sage/10"
                  >
                    <td className="px-2.5 py-3.5 align-middle">
                      <span className="font-medium">{r.tanggalPenuh}</span>
                      {r.waktu && <span className="block text-xs text-aira-text/60">{r.waktu}</span>}
                    </td>
                    <td className="break-words px-2.5 py-3.5 align-middle">
                      {r.lokasi || <span className="text-aira-text/50">Tidak diisi</span>}
                      <span className="block text-xs text-aira-text/60">
                        Sumber: {kondisiTampilan(r.kondisiSumberAir)}
                      </span>
                    </td>
                    <td className="break-words px-2.5 py-3.5 align-middle text-xs text-aira-text/80">
                      {teksMasukan(r)}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3.5 align-middle">
                      {formatLiter(r.liter)} L
                      <span className="block text-xs text-aira-text/60">{r.status.kebutuhanHarian} L/hari</span>
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3.5 align-middle font-semibold text-aira-primary">
                      {formatDesimal(r.status.hari)} hari
                    </td>
                    <td className="px-2.5 py-3.5 align-middle">
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-center text-xs font-semibold ${r.status.tampilan.chip}`}
                      >
                        {labelStatus(r.status)}
                      </span>
                    </td>
                    <td className="px-2.5 py-3.5 text-right align-middle">
                      <button
                        type="button"
                        onClick={() => hitungUlang(r)}
                        className="min-h-[36px] whitespace-nowrap rounded-full border border-aira-primary/30 px-3 py-1.5 text-xs font-semibold text-aira-primary hover:bg-aira-primary/10"
                      >
                        Hitung ulang
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-4 space-y-3 lg:hidden" aria-label="Riwayat perhitungan ketahanan air">
            {riwayat.map((r) => (
              <li key={r.id} className="rounded-2xl border border-aira-primary/10 bg-aira-bg/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{r.tanggalPenuh}</p>
                    {r.waktu && <p className="text-xs text-aira-text/60">{r.waktu}</p>}
                  </div>
                  <span
                    className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${r.status.tampilan.chip}`}
                  >
                    {labelStatus(r.status)}
                  </span>
                </div>

                <dl className="mt-3 space-y-2 text-sm">
                  <div className="grid grid-cols-[110px_1fr] gap-2">
                    <dt className="text-aira-text/60">Lokasi</dt>
                    <dd>
                      {r.lokasi || <span className="text-aira-text/50">Tidak diisi</span>}
                      <span className="block text-xs text-aira-text/60">
                        Sumber: {kondisiTampilan(r.kondisiSumberAir)}
                      </span>
                    </dd>
                  </div>
                  <div className="grid grid-cols-[110px_1fr] gap-2">
                    <dt className="text-aira-text/60">Masukan</dt>
                    <dd>{teksMasukan(r)}</dd>
                  </div>
                  <div className="grid grid-cols-[110px_1fr] gap-2">
                    <dt className="text-aira-text/60">Volume dan kebutuhan</dt>
                    <dd>
                      {formatLiter(r.liter)} L · {r.status.kebutuhanHarian} L/hari
                    </dd>
                  </div>
                  <div className="grid grid-cols-[110px_1fr] gap-2">
                    <dt className="text-aira-text/60">Ketahanan</dt>
                    <dd className="font-semibold text-aira-primary">{formatDesimal(r.status.hari)} hari</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => hitungUlang(r)}
                  className="mt-4 min-h-[44px] w-full rounded-full border border-aira-primary/30 px-4 py-2.5 text-sm font-semibold text-aira-primary hover:bg-aira-primary/10"
                >
                  Hitung ulang
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
