"use client";

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

export default function StatusCard({ hasil, masukan, status }) {
  const IconStatus = status.ikon;
  const valid = hasil?.valid === true;
  const durasi = valid ? Number(hasil.durasiHari) : null;

  const persentaseBar =
    durasi == null
      ? 0
      : Math.min(100, Math.max(0, (durasi / 10) * 100));

  let pesanStatus = status.pesan;

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
  } else if (
    valid &&
    masukan?.kondisi === "Belum diketahui"
  ) {
    pesanStatus =
      "Kondisi sumber air utama belum diketahui, sehingga status akhir belum dapat ditentukan. Pilih kondisinya pada kalkulator lalu hitung ulang.";
  }

  return (
    <section
      className={`self-start rounded-[28px] border-2 p-6 shadow-soft sm:p-8 ${status.panel}`}
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`grid size-12 place-items-center rounded-2xl ${status.ikonBg}`}
        >
          <IconStatus className="size-6 text-aira-primary" />
        </span>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${status.chip}`}
        >
          {status.label}
        </span>
      </div>

      <h2 className="mt-6 font-heading text-2xl font-bold leading-snug text-aira-primary sm:text-3xl">
        {status.judul}
      </h2>

      <div className="mt-7 flex flex-wrap items-end gap-3">
        <span className="font-heading text-6xl font-extrabold leading-none text-aira-primary sm:text-7xl">
          {durasi == null
            ? "—"
            : durasi.toLocaleString("id-ID", {
                maximumFractionDigits: 2,
              })}
        </span>

        <span className="pb-2 text-base text-aira-text/75 sm:text-lg">
          hari estimasi ketahanan
        </span>
      </div>

      <div
        className="mt-6 h-3.5 overflow-hidden rounded-full bg-white/80"
        role="img"
        aria-label={
          durasi == null
            ? "Durasi ketahanan air belum tersedia"
            : `Estimasi ketahanan air ${durasi} hari`
        }
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ${status.bar}`}
          style={{ width: `${persentaseBar}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-aira-text/65">
        <span>0 hari</span>
        <span>1 hari</span>
        <span>3 hari</span>
        <span>10+ hari</span>
      </div>

      <p className="mt-6 leading-relaxed text-aira-text/85">
        {pesanStatus}
      </p>

      {!valid && (
        <div
          className="mt-5 rounded-2xl border border-aira-peach/50 bg-white/80 p-4 text-sm text-aira-danger-dark"
          role="alert"
        >
          <p className="font-semibold">
            Data yang perlu diperbaiki:
          </p>

          <ul className="mt-2 list-disc space-y-1 pl-5">
            {(hasil.errors || []).map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Rangkuman Disclaimer Ringkas & Tanggal Perhitungan */}
      <p className="mt-5 text-xs leading-relaxed text-aira-text/60">
        Hasil berupa estimasi berdasarkan asumsi kebutuhan harian
        dan bukan jaminan kualitas air minum.
        {valid && formatTanggal(hasil.waktuPerhitunganUtc)
          ? ` Dihitung ${formatTanggal(hasil.waktuPerhitunganUtc)}`
          : ""} 
      </p>
    </section>
  );
}