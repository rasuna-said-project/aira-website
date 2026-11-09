// Skala batang "estimasi ketahanan" pada halaman Hasil Kalkulator.
// Label di bawah batang berada pada 0 hari (0%), 1 hari (33,33%), 3 hari (66,67%), dan 10+ hari (100%).
// Skala dibuat bertahap (piecewise linear) supaya ujung batang tepat berada di posisi label yang sesuai,
// contoh: 3 hari = 66,67%, 5 hari = 76,19%, 10 hari atau lebih = 100%.
// Murni fungsi tanpa efek samping, mudah diuji.

export const TITIK_LABEL_BAR = [
  { hari: 0, persen: 0 },
  { hari: 1, persen: 100 / 3 },
  { hari: 3, persen: 200 / 3 },
  { hari: 10, persen: 100 },
];

/** Persentase isi batang (0-100) untuk durasi dalam hari. null / tidak valid / <= 0 menghasilkan 0. */
export function persentaseBar(hari) {
  const d = Number(hari);
  if (hari == null || !Number.isFinite(d) || d <= 0) return 0;
  if (d <= 1) return (d * 100) / 3;
  if (d <= 3) return 100 / 3 + ((d - 1) * 100) / 6;
  if (d < 10) return 200 / 3 + ((d - 3) * 100) / 21;
  return 100;
}
