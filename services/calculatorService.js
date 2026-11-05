// aira-website/services/calculatorService.js

// 1. KONSTANTA AMBANG BATAS & ASUMSI
export const KEBUTUHAN_PER_ORANG_LITER_HARI = 15;
export const TAMBAHAN_AIR_MHM_PER_ORANG_LITER_HARI = 5;
export const KOEFISIEN_PANEN_AIR_HUJAN = 0.8;
export const CURAH_HUJAN_STATIS_METER = 0.01; // 10 mm = 0.01 m

export const BATAS_KRISIS_HARI = 1;
export const BATAS_WASPADA_HARI = 3;

export const STATUS_AMAN = "Aman / Relatif Mencukupi";
export const STATUS_WASPADA = "Waspada";
export const STATUS_KRISIS = "Mode Krisis";
export const STATUS_TIDAK_DITENTUKAN = "Belum Dapat Ditentukan";

// Helper internal
const isInt = (val) => Number.isInteger(val) && typeof val === "number";
const isAngka = (val) => typeof val === "number" && !isNaN(val) && isFinite(val);

// 2. FUNGSI PANEN AIR HUJAN (V = P x A x C)
export function hitungPotensiPanenAirHujan(luasAtapM2) {
  if (!isAngka(luasAtapM2) || luasAtapM2 <= 0) return 0.0;
  const volumeLiter = CURAH_HUJAN_STATIS_METER * luasAtapM2 * KOEFISIEN_PANEN_AIR_HUJAN * 1000;
  return Number(volumeLiter.toFixed(2));
}

// 3. FUNGSI KLASIFIKASI STATUS
export function klasifikasikanStatus(durasi, kondisiSumberAir) {
  let statusDurasi = STATUS_AMAN;
  let alasan = "";

  if (durasi < BATAS_KRISIS_HARI) {
    statusDurasi = STATUS_KRISIS;
    alasan = "Estimasi cadangan kurang dari 1 hari total kebutuhan air harian.";
  } else if (durasi <= BATAS_WASPADA_HARI) {
    statusDurasi = STATUS_WASPADA;
    alasan = "Estimasi cadangan berada pada rentang 1 sampai 3 hari total kebutuhan air harian.";
  } else {
    statusDurasi = STATUS_AMAN;
    alasan = "Estimasi cadangan lebih dari 3 hari berdasarkan total kebutuhan air harian.";
  }

  if (kondisiSumberAir === "Belum diketahui") {
    return { statusDurasi, statusAkhir: STATUS_TIDAK_DITENTUKAN, alasan: "Kondisi sumber air utama belum diketahui." };
  }
  if (kondisiSumberAir === "Tidak berfungsi") {
    return { statusDurasi, statusAkhir: STATUS_KRISIS, alasan: "Sumber air utama dilaporkan tidak berfungsi." };
  }
  if (kondisiSumberAir === "Terbatas" && statusDurasi === STATUS_AMAN) {
    return { statusDurasi, statusAkhir: STATUS_WASPADA, alasan: "Cadangan cukup >3 hari, namun sumber air utama sedang terbatas." };
  }

  return { statusDurasi, statusAkhir: statusDurasi, alasan };
}

// 4. FUNGSI KALKULASI UTAMA (Dipanggil oleh Halaman Frontend Next.js)
export function hitungKetahananAir({
  jumlahAnggota,
  sumberAirUtama,
  kondisiSumberAir,
  volumeCadanganLiter = null,
  kapasitasTangkiLiter = null,
  persentaseIsi = null,
  luasAtapM2 = null,
  kebutuhanMhm = false,
  jumlahAnggotaMhm = 0,
}) {
  const errors = [];

  // Validasi Input Wajib
  if (!isInt(jumlahAnggota) || jumlahAnggota <= 0) {
    errors.push("Jumlah anggota keluarga harus berupa bilangan bulat > 0.");
  }
  if (typeof sumberAirUtama !== "string" || !sumberAirUtama.trim()) {
    errors.push("Sumber air utama wajib diisi.");
  }

  // Validasi MHM
  if (typeof kebutuhanMhm !== "boolean") {
    errors.push("kebutuhanMhm harus boolean.");
  }
  if (!isInt(jumlahAnggotaMhm) || jumlahAnggotaMhm < 0) {
    errors.push("Jumlah anggota MHM harus >= 0.");
  } else if (isInt(jumlahAnggota) && jumlahAnggota > 0 && jumlahAnggotaMhm > jumlahAnggota) {
    errors.push("Jumlah anggota MHM tidak boleh melebihi total anggota keluarga.");
  }

  // Validasi Kondisi Sumber Air
  const pilihanKondisi = new Set(["Normal", "Terbatas", "Tidak berfungsi", "Belum diketahui"]);
  if (!pilihanKondisi.has(kondisiSumberAir)) {
    errors.push("Kondisi sumber air tidak valid.");
  }

  // Validasi Volume Cadangan
  let cadangan = null;
  const pakaiVolumeAktual = volumeCadanganLiter !== null;

  if (pakaiVolumeAktual) {
    if (!isAngka(volumeCadanganLiter) || volumeCadanganLiter < 0) {
      errors.push("Volume cadangan aktual harus >= 0.");
    } else {
      cadangan = Number(volumeCadanganLiter);
    }
  } else {
    if (!isAngka(kapasitasTangkiLiter) || kapasitasTangkiLiter <= 0) {
      errors.push("Kapasitas tangki harus > 0.");
    }
    if (!isAngka(persentaseIsi) || persentaseIsi < 0 || persentaseIsi > 100) {
      errors.push("Persentase isi tangki harus 0 - 100%.");
    }
    if (errors.length === 0) {
      cadangan = Number(kapasitasTangkiLiter) * (Number(persentaseIsi) / 100);
    }
  }

  // JIKA TIDAK VALID -> RETURN BELUM DAPAT DITENTUKAN
  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      status: STATUS_TIDAK_DITENTUKAN,
      alasanStatus: "Data tidak lengkap atau tidak valid.",
    };
  }

  // PERHITUNGAN UTAMA
  const kebutuhanDasar = jumlahAnggota * KEBUTUHAN_PER_ORANG_LITER_HARI;
  const tambahanMhm = kebutuhanMhm ? jumlahAnggotaMhm * TAMBAHAN_AIR_MHM_PER_ORANG_LITER_HARI : 0;
  const kebutuhanHarian = kebutuhanDasar + tambahanMhm;
  const durasi = cadangan / kebutuhanHarian;
  const potensiPanenHujan = hitungPotensiPanenAirHujan(luasAtapM2);

  const { statusDurasi, statusAkhir, alasan } = klasifikasikanStatus(durasi, kondisiSumberAir);

  return {
    valid: true,
    errors: [],
    jumlahAnggota,
    jumlahAnggotaMhm,
    kebutuhanDasarLiter: Number(kebutuhanDasar.toFixed(2)),
    tambahanMhmLiter: Number(tambahanMhm.toFixed(2)),
    kebutuhanHarianLiter: Number(kebutuhanHarian.toFixed(2)),
    cadanganAirLiter: Number(cadangan.toFixed(2)),
    durasiHari: Number(durasi.toFixed(2)),
    potensiPanenAirHujanLiter: potensiPanenHujan,
    statusDurasi,
    status: statusAkhir,
    alasanStatus: alasan,
    waktuPerhitunganUtc: new Date().toISOString(),
  };
}