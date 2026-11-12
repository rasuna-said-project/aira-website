"use client";

import { Info } from "lucide-react";

export default function RekomendasiCard({ hasil, status }) {
  const itemsKatalog = hasil?.rekomendasi?.items;

  // Satu sumber kebenaran: katalog (Supabase -> cache -> KATALOG_FALLBACK) dari server.
  // Jika kosong, pakai daftar dasar per status dari StatusConfig, maksimal 5.
  const daftarTindakan =
    Array.isArray(itemsKatalog) && itemsKatalog.length > 0
      ? itemsKatalog
      : (status?.rekomendasi || []).slice(0, 5);

  const sumberKatalog = hasil?.rekomendasi?.sumberKatalog || "fallback";
  const pemilih = hasil?.rekomendasi?.pemilih || "aturan";

  return (
    <section
      className="rounded-[28px] border border-aira-primary/5 bg-white p-6 shadow-soft sm:p-8"
      data-sumber-katalog={sumberKatalog}
      data-pemilih={pemilih}
    >
      {/* HEADER KARTU */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-heading text-xl font-bold text-aira-primary">
          Langkah yang Disarankan
        </h3>

        <span className="rounded-full bg-aira-primary/10 px-3 py-1 text-xs font-semibold text-aira-primary">
          Berdasarkan data Anda
        </span>
      </div>

      <p className="mt-1 text-[15px] leading-relaxed text-aira-text/65">
        Tindakan praktis yang dapat dilakukan untuk menjaga ketahanan air keluarga Anda.
      </p>

      {/* DAFTAR TINDAKAN */}
      {daftarTindakan.length > 0 ? (
        <ol className="mt-5 divide-y divide-aira-primary/10">
          {daftarTindakan.map((item, index) => {
            const judul =
              typeof item === "string"
                ? null
                : item.nama || item.judul || item.title || null;

            const teksTindakan =
              typeof item === "string"
                ? item
                : item.teks || item.deskripsi || item.teks_tindakan || "";

            const pesanPengguna =
              typeof item === "object"
                ? item.pesanPengguna || item.pesan_pengguna || null
                : null;

            const isWarning = item?.isWarning === true;
            const alasan =
              typeof item === "object" && typeof item.alasan === "string"
                ? item.alasan
                : null;
            // Prioritas = tindakan wajib dari sistem (keselamatan / kebutuhan dasar), bukan sekadar nomor urut.
            const adalahPrioritas = typeof item === "object" && item.wajib === true;

            return (
              <li
                key={item?.id || `tindakan-${index}`}
                className="py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-start gap-4">
                  {/* NOMOR URUT BULAT */}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-aira-primary text-sm font-bold text-white">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1 space-y-1">
                    {/* JUDUL TINDAKAN */}
                    {judul && (
                      <h4 className="font-heading text-base font-bold leading-snug text-aira-primary">
                        {judul}
                        {adalahPrioritas && (
                          <span
                            title="Selalu ditampilkan sistem karena menyangkut keselamatan atau kebutuhan dasar"
                            className="ml-2 rounded-full bg-aira-primary/10 px-2.5 py-1 align-middle text-xs font-semibold text-aira-primary"
                          >
                            Prioritas
                          </span>
                        )}
                      </h4>
                    )}

                    {/* DESKRIPSI TINDAKAN */}
                    {teksTindakan && (
                      <p className="text-[15px] leading-relaxed text-aira-text/80">
                        {teksTindakan}
                      </p>
                    )}

                    {/* ALASAN SINGKAT DARI AI (opsional; teks tindakan tidak diubah) */}
                    {alasan && (
                      <p className="text-[13px] leading-relaxed text-aira-primary/80">
                        <span className="font-semibold">Mengapa untuk Anda: </span>
                        {alasan}
                      </p>
                    )}

                    {/* PESAN TAMBAHAN UNTUK PENGGUNA */}
                    {pesanPengguna && (
                      <div
                        className={`mt-2 flex items-start gap-2 rounded-xl border px-3 py-2 text-[13px] leading-relaxed ${
                          isWarning
                            ? "border-amber-500/20 bg-amber-500/10 text-amber-950"
                            : "border-teal-500/20 bg-teal-500/10 text-teal-950"
                        }`}
                      >
                        <Info
                          className={`mt-0.5 size-4 shrink-0 ${
                            isWarning ? "text-amber-600" : "text-teal-600"
                          }`}
                        />
                        <div className="space-y-0.5">
                          <span
                            className={`block font-semibold ${
                              isWarning ? "text-amber-900" : "text-teal-900"
                            }`}
                          >
                            Catatan penting
                          </span>
                          <p className="opacity-90">{pesanPengguna}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="mt-5 rounded-2xl border border-aira-primary/10 bg-aira-bg/30 p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-5 shrink-0 text-aira-primary" />
            <div>
              <h4 className="font-heading text-sm font-semibold text-aira-primary">
                Rekomendasi belum tersedia
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-aira-text/70">
                Silakan periksa kembali data perhitungan Anda.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}