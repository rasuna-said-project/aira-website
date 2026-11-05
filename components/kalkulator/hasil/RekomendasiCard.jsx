function buatRekomendasi(masukan, hasil, status) {
  const rekomendasi = [...status.rekomendasi];

  if (!hasil?.valid) {
    return rekomendasi;
  }

  if (masukan?.kondisi === "Tidak Berfungsi") {
    rekomendasi.unshift(
      `Sumber air utama (${masukan.sumberAir}) tidak berfungsi. Laporkan kondisi tersebut kepada RT/RW atau pengelola sumber air.`
    );
  } else if (masukan?.kondisi === "Terbatas") {
    rekomendasi.unshift(
      "Sumber air sedang terbatas. Tampung air ketika tersedia dan simpan dalam wadah tertutup."
    );
  }

  if (masukan?.mhm && Number(masukan?.anggotaMhm) > 0) {
    rekomendasi.push(
      `Perhatikan kebutuhan air tambahan untuk ${masukan.anggotaMhm} anggota keluarga yang membutuhkan MHM.`
    );
  }

  return [...new Set(rekomendasi)].slice(0, 5);
}

export default function RekomendasiCard({ masukan, hasil, status }) {
  const rekomendasi = buatRekomendasi(masukan, hasil, status);

  return (
    <section className="rounded-[28px] border border-aira-primary/5 bg-white p-6 shadow-soft sm:p-7">
      <h3 className="font-heading text-xl font-bold text-aira-primary">
        Langkah yang Disarankan
      </h3>

      <p className="mt-2 text-sm text-aira-text/65">
        Beberapa tindakan yang dapat dilakukan berdasarkan hasil perhitungan.
      </p>

      <ol className="mt-5 space-y-4">
        {rekomendasi.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-aira-sage/50 text-sm font-bold text-aira-primary">
              {index + 1}
            </span>

            <span className="text-sm leading-relaxed text-aira-text/85">
              {item}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
} 