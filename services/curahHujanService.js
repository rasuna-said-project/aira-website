const CACHE_TTL = 24 * 60 * 60 * 1000;
const cacheCurahHujan = new Map();

// Koordinat referensi wilayah prioritas AIRA, untuk menghindari geocoding ambigu.
const KOORDINAT_WILAYAH_PRIORITAS = [
  { aliases: ["gunungkidul", "gunung kidul"], latitude: -7.96, longitude: 110.6, label: "Gunungkidul, DI Yogyakarta" },
  { aliases: ["kupang"], latitude: -10.05, longitude: 123.85, label: "Kupang, NTT" },
  { aliases: ["timor tengah selatan", "tts"], latitude: -9.86, longitude: 124.28, label: "Timor Tengah Selatan, NTT" },
  { aliases: ["sumba timur"], latitude: -9.85, longitude: 120.25, label: "Sumba Timur, NTT" },
  { aliases: ["malaka"], latitude: -9.6, longitude: 124.9, label: "Malaka, NTT" },
  { aliases: ["wonogiri"], latitude: -7.82, longitude: 110.92, label: "Wonogiri, Jawa Tengah" },
  { aliases: ["pacitan"], latitude: -8.2, longitude: 111.1, label: "Pacitan, Jawa Timur" },
  { aliases: ["bima"], latitude: -8.5, longitude: 118.6, label: "Bima, NTB" },
  { aliases: ["lombok timur"], latitude: -8.65, longitude: 116.53, label: "Lombok Timur, NTB" },
  { aliases: ["jeneponto"], latitude: -5.67, longitude: 119.73, label: "Jeneponto, Sulawesi Selatan" },
  { aliases: ["indramayu"], latitude: -6.33, longitude: 108.32, label: "Indramayu, Jawa Barat" },
];

function cariKoordinatPrioritas(lokasi) {
  const teks = normalisasiNama(lokasi);
  return KOORDINAT_WILAYAH_PRIORITAS.find((wilayah) =>
    wilayah.aliases.some((alias) => teks.includes(normalisasiNama(alias)))
  );
}

const TAHUN_MULAI = 1991;
const TAHUN_AKHIR = 2020;

async function fetchJson(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Open-Meteo gagal: HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data?.error) {
    throw new Error(data.reason || "Data cuaca tidak tersedia.");
  }

  return data;
}

function normalisasiNama(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(kabupaten|kab|kota|kecamatan|kec|indonesia)\b/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pecahLokasi(lokasi) {
  return lokasi
    .split(",")
    .map((bagian) => bagian.trim())
    .filter(Boolean);
}

function buatKandidatPencarian(lokasi) {
  const bagian = pecahLokasi(lokasi);
  const kandidat = [];

  if (bagian.length > 0) kandidat.push(bagian[0]);
  if (bagian.length > 1) kandidat.push(`${bagian[0]}, ${bagian[1]}`);
  kandidat.push(lokasi);

  return [...new Set(kandidat.filter(Boolean))].slice(0, 3);
}

function cocokDenganLokasi(tempat, lokasi) {
  const bagianInput = pecahLokasi(lokasi)
    .map(normalisasiNama)
    .filter(Boolean);

  const bagianHasil = [
    tempat.name,
    tempat.admin1,
    tempat.admin2,
    tempat.admin3,
    tempat.admin4,
    tempat.country,
  ]
    .map(normalisasiNama)
    .filter(Boolean);

  const gabunganHasil = bagianHasil.join(" ");

  // Input yang hanya berisi nama negara/kosong tidak cukup spesifik.
  if (bagianInput.length === 0) return false;

  // Pastikan seluruh komponen lokasi yang dimasukkan
  // ditemukan pada data administratif hasil geocoding.
  return bagianInput.every((bagian) =>
    gabunganHasil.includes(bagian)
  );
}

// Lokasi harus cocok dengan wilayah yang diminta. Jangan menurunkan tingkat
// pencarian ke kabupaten/provinsi karena dapat memakai data wilayah lain.
async function cariKoordinat(lokasi) {
  const prioritas = cariKoordinatPrioritas(lokasi);
  if (prioritas) {
    return {
      latitude: prioritas.latitude,
      longitude: prioritas.longitude,
      nama: prioritas.label,
      tingkatLokasi: prioritas.label,
      sumberKoordinat: "mapping_wilayah_prioritas",
    };
  }
  return cariKoordinatLangsung(lokasi);
}

async function cariKoordinatLangsung(lokasi) {
  const kandidat = buatKandidatPencarian(lokasi);
  let adaResponsBerhasil = false;
  let errorTerakhir = null;

  for (const nama of kandidat) {
    try {
      const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
      url.searchParams.set("name", nama);
      url.searchParams.set("count", "20");
      url.searchParams.set("language", "id");
      url.searchParams.set("format", "json");
      url.searchParams.set("countryCode", "ID");

      const data = await fetchJson(url.toString());
      adaResponsBerhasil = true;
      const hasil = Array.isArray(data?.results) ? data.results : [];
      if (hasil.length === 0) continue;

      const tempatCocok = hasil.find((item) =>
        item.country_code === "ID" &&
        Number.isFinite(item.latitude) &&
        Number.isFinite(item.longitude) &&
        cocokDenganLokasi(item, lokasi)
      );

      if (!tempatCocok) continue;

      return {
        latitude: tempatCocok.latitude,
        longitude: tempatCocok.longitude,
        nama: [tempatCocok.name, tempatCocok.admin3, tempatCocok.admin2, tempatCocok.admin1, tempatCocok.country]
          .filter(Boolean)
          .join(", "),
        tingkatLokasi: tempatCocok.name,
      };
    } catch (error) {
      errorTerakhir = error;
      console.warn(`[curahHujanService] Geocoding gagal untuk ${nama}:`, error.message);
    }
  }

  // Bedakan "wilayah memang tidak ditemukan" dari "semua request geocoding gagal".
  if (!adaResponsBerhasil && errorTerakhir) throw errorTerakhir;
  return null;
}

async function ambilDataHistoris(latitude, longitude) {
  const url = new URL(
    "https://archive-api.open-meteo.com/v1/archive"
  );

  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("start_date", `${TAHUN_MULAI}-01-01`);
  url.searchParams.set("end_date", `${TAHUN_AKHIR}-12-31`);
  url.searchParams.set("daily", "precipitation_sum");
  url.searchParams.set("timezone", "Asia/Jakarta");
  url.searchParams.set("precipitation_unit", "mm");

  return fetchJson(url.toString());
}

function hitungRataRataBulanan(data) {
  const tanggal = data?.daily?.time;
  const curahHujan = data?.daily?.precipitation_sum;

  if (
    !Array.isArray(tanggal) ||
    !Array.isArray(curahHujan) ||
    tanggal.length === 0 ||
    tanggal.length !== curahHujan.length
  ) {
    return null;
  }

  const totalPerBulan = new Map();

  for (let i = 0; i < tanggal.length; i += 1) {
    const tanggalHari = tanggal[i];
    const nilaiHujan = curahHujan[i];

    if (
      typeof tanggalHari !== "string" ||
      typeof nilaiHujan !== "number" ||
      !Number.isFinite(nilaiHujan)
    ) {
      continue;
    }

    const bulan = tanggalHari.slice(0, 7);

    totalPerBulan.set(
      bulan,
      (totalPerBulan.get(bulan) || 0) + nilaiHujan
    );
  }

  if (totalPerBulan.size === 0) return null;

  const total = [...totalPerBulan.values()].reduce(
    (jumlah, nilai) => jumlah + nilai,
    0
  );

  return Number((total / totalPerBulan.size).toFixed(2));
}

export async function ambilRataRataCurahHujan(lokasi) {
  if (typeof lokasi !== "string" || !lokasi.trim()) {
    return {
      status: "unavailable",
      tersedia: false,
      alasan: "invalid_location",
      lokasi: null,
      curahHujanMmPerBulan: null,
      sumberData: "Open-Meteo Historical Weather API",
    };
  }

  const lokasiBersih = lokasi.trim();
  const cacheKey = normalisasiNama(lokasiBersih);
  const cache = cacheCurahHujan.get(cacheKey);

  if (cache && Date.now() - cache.waktu < CACHE_TTL) {
    return cache.data;
  }

  try {
    console.info("[curahHujanService] Mencari koordinat lokasi:", lokasiBersih);
    const koordinat = await cariKoordinat(lokasiBersih);

    if (!koordinat) {
      const hasilTidakTersedia = {
        status: "unavailable",
        tersedia: false,
        alasan: "location_not_found",
        lokasi: lokasiBersih,
        curahHujanMmPerBulan: null,
        namaLokasiDitemukan: null,
        latitude: null,
        longitude: null,
        periodeData: `${TAHUN_MULAI}-${TAHUN_AKHIR}`,
        sumberData: "Open-Meteo Historical Weather API",
      };
      console.warn("[curahHujanService] Lokasi tidak ditemukan secara spesifik:", lokasiBersih);
      return hasilTidakTersedia;
    }

    const dataHistoris = await ambilDataHistoris(
      koordinat.latitude,
      koordinat.longitude
    );
    const rataRataMm = hitungRataRataBulanan(dataHistoris);

    if (rataRataMm === null) {
      return {
        status: "unavailable",
        tersedia: false,
        alasan: "precipitation_data_not_found",
        lokasi: lokasiBersih,
        namaLokasiDitemukan: koordinat.nama,
        latitude: koordinat.latitude,
        longitude: koordinat.longitude,
        curahHujanMmPerBulan: null,
        periodeData: `${TAHUN_MULAI}-${TAHUN_AKHIR}`,
        sumberData: "Open-Meteo Historical Weather API",
      };
    }

    const hasil = {
      status: "available",
      tersedia: true,
      alasan: null,
      lokasi: lokasiBersih,
      namaLokasiDitemukan: koordinat.nama,
      latitude: koordinat.latitude,
      longitude: koordinat.longitude,
      curahHujanMmPerBulan: rataRataMm,
      potensiData: "historis",
      periodeData: `${TAHUN_MULAI}-${TAHUN_AKHIR}`,
      sumberData: "Open-Meteo Historical Weather API",
    };

    cacheCurahHujan.set(cacheKey, { waktu: Date.now(), data: hasil });
    return hasil;
  } catch (error) {
    console.error("[curahHujanService] Sumber data gagal:", {
      lokasi: lokasiBersih,
      message: error?.message || "Unknown error",
    });

    return {
      status: "error",
      tersedia: false,
      alasan: "external_service_unavailable",
      lokasi: lokasiBersih,
      curahHujanMmPerBulan: null,
      sumberData: "Open-Meteo Historical Weather API",
    };
  }
}
