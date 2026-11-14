export const JENIS_SEMUA = "Semua jenis";

export const JENIS_TITIK_AIR = [
  JENIS_SEMUA,
  "Sumur umum",
  "Water station",
];

export const LABEL_KECOCOKAN = {
  kecamatan: "Cocok kecamatan",
  kabupaten: "Cocok kabupaten/kota",
  provinsi: "Cocok provinsi",
};

const URUTAN_TINGKAT = {
  kecamatan: 0,
  kabupaten: 1,
  provinsi: 2,
};

function urutanKetersediaan(value) {
  return value === "Tersedia" || value === "Terbatas" ? 0 : 1;
}

function waktuPembaruan(titik) {
  const waktu = new Date(titik.updatedAt || 0).getTime();

  return Number.isNaN(waktu) ? 0 : waktu;
}

export function tingkatKecocokan(titik, kataKunci) {
  if (!kataKunci) return null;

  if (
    (titik.kecamatan || "")
      .toLowerCase()
      .includes(kataKunci)
  ) {
    return "kecamatan";
  }

  if (
    (titik.kabupaten || "")
      .toLowerCase()
      .includes(kataKunci)
  ) {
    return "kabupaten";
  }

  if (
    (titik.provinsi || "")
      .toLowerCase()
      .includes(kataKunci)
  ) {
    return "provinsi";
  }

  return null;
}

export function cariTitikAir(
  daftar,
  {
    kataKunci = "",
    jenis = JENIS_SEMUA,
    adaAirSaja = false,
    provinsi = "",
    kabupaten = "",
    kecamatan = "",
  } = {}
) {
  const q = kataKunci.trim().toLowerCase();

  const daftarAman = Array.isArray(daftar) ? daftar : [];

  const hasil = daftarAman
    .filter((titik) => {
      const cocokJenis =
        jenis === JENIS_SEMUA || titik.type === jenis;

      const cocokKetersediaan =
        !adaAirSaja ||
        titik.availability === "Tersedia" ||
        titik.availability === "Terbatas";

      const cocokProvinsi =
        !provinsi || titik.provinsi === provinsi;

      const cocokKabupaten =
        !kabupaten || titik.kabupaten === kabupaten;

      const cocokKecamatan =
        !kecamatan || titik.kecamatan === kecamatan;

      const teksPencarian = [
        titik.name,
        titik.address,
        titik.area,
        titik.kecamatan,
        titik.kabupaten,
        titik.provinsi,
        titik.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        cocokJenis &&
        cocokKetersediaan &&
        cocokProvinsi &&
        cocokKabupaten &&
        cocokKecamatan &&
        (!q || teksPencarian.includes(q))
      );
    })
    .map((titik) => ({
      titik,
      tingkat: tingkatKecocokan(titik, q),
    }));

  hasil.sort(
    (a, b) =>
      (URUTAN_TINGKAT[a.tingkat] ?? 3) -
        (URUTAN_TINGKAT[b.tingkat] ?? 3) ||
      urutanKetersediaan(a.titik.availability) -
        urutanKetersediaan(b.titik.availability) ||
      waktuPembaruan(b.titik) - waktuPembaruan(a.titik)
  );

  return hasil;
}