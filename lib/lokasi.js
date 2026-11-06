// Deteksi wilayah dari lokasi perangkat (Geolocation API), dicocokkan ke daftar wilayah Kalkulator.
// Privasi: koordinat HANYA dipakai di browser untuk mencari wilayah terdekat. Koordinat tidak
// disimpan, tidak dikirim ke server, dan tidak dikirim ke AI; hanya nama wilayah yang masuk ke form.
import { WILAYAH_CURAH_HUJAN } from "@/data/curahHujan";

export const MAKS_JARAK_KM = 60;

const rad = (derajat) => (derajat * Math.PI) / 180;

/** Jarak lingkaran besar (km) antara dua titik. */
export function jarakKm(lat1, lng1, lat2, lng2) {
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

/** Wilayah terdekat dalam batas jarak, atau null. Mengembalikan { nama, jarakKm }. */
export function wilayahTerdekat(lat, lng, daftar = WILAYAH_CURAH_HUJAN, maksKm = MAKS_JARAK_KM) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  let terbaik = null;
  for (const w of daftar) {
    if (!Number.isFinite(w.lat) || !Number.isFinite(w.lng)) continue;
    const km = jarakKm(lat, lng, w.lat, w.lng);
    if (!terbaik || km < terbaik.jarakKm) terbaik = { nama: w.nama, jarakKm: km };
  }
  return terbaik && terbaik.jarakKm <= maksKm ? terbaik : null;
}

/**
 * Meminta lokasi perangkat lalu mencocokkannya ke wilayah. Tidak pernah melempar error.
 * status: "ok" (ada `nama`) | "di-luar-jangkauan" | "ditolak" | "tidak-didukung" | "gagal"
 * Opsi `geolocation` dipakai untuk pengujian.
 */
export function deteksiWilayah({
  geolocation = typeof navigator !== "undefined" ? navigator.geolocation : undefined,
  daftar = WILAYAH_CURAH_HUJAN,
  maksKm = MAKS_JARAK_KM,
} = {}) {
  return new Promise((resolve) => {
    if (!geolocation) return resolve({ status: "tidak-didukung" });
    try {
      geolocation.getCurrentPosition(
        ({ coords }) => {
          const w = wilayahTerdekat(coords.latitude, coords.longitude, daftar, maksKm);
          resolve(w ? { status: "ok", nama: w.nama } : { status: "di-luar-jangkauan" });
        },
        (err) => resolve({ status: err?.code === 1 ? "ditolak" : "gagal" }), // 1 = PERMISSION_DENIED
        // Akurasi kasar sudah cukup untuk tingkat kabupaten, lebih cepat dan hemat baterai.
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 10 * 60 * 1000 }
      );
    } catch {
      resolve({ status: "gagal" });
    }
  });
}
