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

// Catatan kaki card status: sifat estimasi dan tanggal perhitungan.
export default function CatatanPerhitungan({ hasil }) {
  const valid = hasil?.valid === true;
  const tanggal = valid ? formatTanggal(hasil.waktuPerhitunganUtc) : null;

  return (
    <p className="mt-6 text-[13px] leading-relaxed text-aira-text/70">
      Hasil berupa estimasi berdasarkan asumsi kebutuhan harian dan bukan
      jaminan kualitas air minum.
      {tanggal ? ` Dihitung ${tanggal}` : ""}
    </p>
  );
}
