const MHM_LITER_PER_ORANG = 5;

function buatRekomendasi(masukan, hasil, status, statusKey) {
  const dasar = status.rekomendasi;

  // Data belum lengkap/valid atau kondisi belum diketahui: tampilkan langkah dasar saja.
  if (statusKey === "belum" || !hasil?.valid) return dasar;

  const out = [];

  if (statusKey === "krisis") out.push(...dasar.slice(0, 2));

  if (masukan?.kondisi === "Tidak Berfungsi") {
    out.push(
      `Sumber utama (${masukan.sumberAir}) tidak berfungsi: laporkan ke RT/RW atau pengelola dan cari titik air alternatif hari ini`
    );
  } else if (masukan?.kondisi === "Terbatas") {
    out.push(
      "Sumber air terbatas: tampung air saat mengalir dan simpan di wadah tertutup"
    );
  }

  if (masukan?.mhm && Number(masukan?.anggotaMhm) > 0) {
    out.push(
      `Sisihkan ${Number(masukan.anggotaMhm) * MHM_LITER_PER_ORANG} liter per hari untuk kebutuhan MHM (${masukan.anggotaMhm} orang), pakai air bersih dan jaga privasi tempat mencuci`
    );
  }

  const hujan = hasil.potensiPanenAirHujanLiter;
  const kebutuhan = hasil.kebutuhanHarianLiter;
  if (hujan != null && hujan > 0 && kebutuhan > 0) {
    out.push(
      `Pasang talang dan penampung air hujan: panen sebulan (data simulasi) setara kira-kira ${Math.round(hujan / kebutuhan)} hari kebutuhan rumah tangga`
    );
  } else {
    out.push(
      "Isi lokasi dan luas atap di kalkulator untuk menghitung estimasi panen hujan"
    );
  }

  if (statusKey !== "krisis") out.push(...dasar.slice(0, 2));

  return [...new Set(out)].slice(0, 5);
}

export default function RekomendasiCard({ masukan, hasil, status, statusKey }) {
  const rekomendasi = buatRekomendasi(masukan, hasil, status, statusKey);

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