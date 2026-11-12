export default function HasilHeader() {
  return (
    <header>
      <p className="text-sm font-semibold uppercase tracking-wide text-aira-secondary">
        Kalkulator Ketahanan Air
      </p>

      <h1 className="mt-2 font-heading text-4xl font-bold leading-tight text-aira-primary sm:text-[2.5rem]">
        Hasil Perhitungan
      </h1>

      {/* Tanpa max-width: kalimat memanjang selebar card di bawahnya. */}
      <p className="mt-3 text-base leading-relaxed text-aira-text/75">
        Berikut gambaran estimasi ketersediaan air rumah tangga berdasarkan
        data yang telah Anda masukkan.
      </p>
    </header>
  );
}
