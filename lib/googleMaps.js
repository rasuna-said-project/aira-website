// Pembuat tautan Google Maps untuk tombol "Buka di Google Maps" pada halaman Detail Titik Air.
// Murni fungsi tanpa efek samping, mudah diuji. Format tautan mengikuti PRD:
//   https://www.google.com/maps/dir/?api=1&destination={lat},{lng}
// Urutan: koordinat dulu; bila tidak ada, alamat; bila keduanya tidak ada, tombol tidak ditampilkan.

const URL_MAPS = "https://www.google.com/maps/dir/?api=1&destination=";

const adalahAngka = (n) => typeof n === "number" && Number.isFinite(n);

/** true bila latitude dan longitude berupa angka yang valid (lat -90..90, lng -180..180). */
export function punyaKoordinat(titik) {
  return (
    adalahAngka(titik.latitude) &&
    adalahAngka(titik.longitude) &&
    Math.abs(titik.latitude) <= 90 &&
    Math.abs(titik.longitude) <= 180
  );
}

/**
 * Hasil: { href, dasar }
 * - dasar "koordinat": tautan dari latitude,longitude
 * - dasar "alamat": tautan dari alamat (lokasi kurang presisi, tampilkan catatan)
 * - dasar null: tidak ada lokasi, href kosong (tombol harus disembunyikan)
 */
export function buatTautanMaps(titik) {
  if (punyaKoordinat(titik)) {
    return { href: `${URL_MAPS}${titik.latitude},${titik.longitude}`, dasar: "koordinat" };
  }
  const alamat = (titik.address || "").trim();
  if (alamat) {
    return { href: `${URL_MAPS}${encodeURIComponent(alamat)}`, dasar: "alamat" };
  }
  return { href: "", dasar: null };
}

/** Teks koordinat untuk tampilan, contoh "-8.1325, 110.9381". */
export function formatKoordinat(titik) {
  return punyaKoordinat(titik) ? `${titik.latitude.toFixed(4)}, ${titik.longitude.toFixed(4)}` : "";
}
