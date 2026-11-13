
function kapitalisasiKata(teks = "") {
  return teks
    .toLowerCase()
    .replace(/\b\p{L}/gu, (huruf) => huruf.toUpperCase());
}

export function formatNamaKecamatan(nama = "") {
  return kapitalisasiKata(nama.trim().replace(/\s+/g, " "));
}

export function formatNamaKabupaten(nama = "") {
  const bersih = nama.trim().replace(/\s+/g, " ");

  const tanpaAwalan = bersih.replace(
    /^(kabupaten administrasi|kabupaten|kota administrasi|kota)\s+/i,
    ""
  );

  const namaNormal = tanpaAwalan.toLowerCase();

  const namaBaku = {
    "gunung kidul": "Gunungkidul",
    gunungkidul: "Gunungkidul",
  };

  const hasil =
    namaBaku[namaNormal] || kapitalisasiKata(tanpaAwalan);

  if (/^kota administrasi\s+/i.test(bersih)) {
    return `Kota Administrasi ${hasil}`;
  }

  if (/^kabupaten administrasi\s+/i.test(bersih)) {
    return `Kabupaten Administrasi ${hasil}`;
  }

  if (/^kabupaten\s+/i.test(bersih)) {
    return `Kabupaten ${hasil}`;
  }

  if (/^kota\s+/i.test(bersih)) {
    return `Kota ${hasil}`;
  }

  return hasil;
}

export function formatNamaProvinsi(nama = "") {
  const bersih = nama.trim().replace(/\s+/g, " ");
  const namaNormal = bersih.toLowerCase();

  const namaBaku = {
    "di yogyakarta": "Daerah Istimewa Yogyakarta",
    "d.i. yogyakarta": "Daerah Istimewa Yogyakarta",
    "daerah istimewa yogyakarta": "Daerah Istimewa Yogyakarta",
    "dki jakarta": "Daerah Khusus Ibukota Jakarta",
  };

  return namaBaku[namaNormal] || kapitalisasiKata(bersih);
}

export function formatLokasiWilayah(lokasi = "") {
  if (!lokasi || typeof lokasi !== "string") return "";

  const bagian = lokasi.split(",").map((item) => item.trim());

  if (bagian.length !== 3) {
    return bagian.map(kapitalisasiKata).join(", ");
  }

  const [kecamatan, kabupaten, provinsi] = bagian;

  return [
    formatNamaKecamatan(kecamatan),
    formatNamaKabupaten(kabupaten),
    formatNamaProvinsi(provinsi),
  ].join(", ");
}
