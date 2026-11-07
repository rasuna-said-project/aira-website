// Penjelasan singkat hasil kalkulator untuk kartu "Penjelasan AIRA".
// PENTING: penjelasan hanya membantu memahami hasil. Status SELALU ditentukan oleh perhitungan (calculatorService).
//
// Alur:
// - Status "Belum Dapat Ditentukan" / data tidak valid: memakai template aturan (tanpa memanggil AI).
// - Status lain: meminta penjelasan Gemini lewat Server Action. Jika AI gagal, fungsi MELEMPAR error
//   sehingga kartu menampilkan pesan fallback-nya ( state "gagal" ). Teks template tidak dipakai menggantikan AI,
//   agar tidak tampil seolah-olah berasal dari AI (PRD 11.4). Bagian lain halaman Hasil tetap tampil (TC-K18).

import { jelaskanHasilAI } from "@/app/actions/penjelasan";

const formatAngka = (n) =>
  Number(n).toLocaleString("id-ID", { maximumFractionDigits: 2 });

const formatHari = (n) =>
  Number(n).toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

export function buatPenjelasanAturan(hasil, masukan) {
  const statusKey = hasil?.statusKey || "belum";

  if (statusKey === "belum") {
    return hasil?.valid
      ? "Kondisi sumber air belum diketahui, sehingga AIRA belum bisa menentukan status. Setelah kondisi dipilih dan dihitung ulang, hasilnya akan tampil lengkap dengan langkah yang sesuai."
      : "Ada data yang belum sesuai sehingga perhitungan belum bisa dilakukan. Perbaiki data yang tercantum pada panel hasil, lalu hitung ulang agar AIRA dapat memberi estimasi.";
  }

  const penutup =
    statusKey === "aman"
      ? "Ini berarti cadangan Anda relatif mencukupi untuk beberapa hari ke depan."
      : statusKey === "waspada"
        ? "Ini berarti cadangan mulai menipis, jadi mulailah berhemat dan siapkan sumber cadangan."
        : "Ini berarti cadangan sangat terbatas, jadi utamakan kebutuhan esensial dan segera cari sumber air tambahan.";

  const kondisi =
    masukan?.kondisi === "Terbatas" || masukan?.kondisi === "Tidak Berfungsi"
      ? ` Kondisi sumber air (${masukan.kondisi.toLowerCase()}) ikut dipertimbangkan dalam status.`
      : "";

  return `Dengan cadangan sekitar ${formatAngka(hasil.cadanganAirLiter)} liter dan kebutuhan keluarga ${formatAngka(hasil.kebutuhanHarianLiter)} liter per hari, air diperkirakan cukup untuk ${formatHari(hasil.durasiHari)} hari. ${penutup}${kondisi}`;
}

// Mode demo: buka halaman Hasil dengan ?ai=gagal untuk menyimulasikan kegagalan layanan AI.
export function simulasiAiGagal() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("ai") === "gagal";
}

/**
 * Pembersih string jika Gemini mengembalikan string JSON yang terbungkus markdown ```json ... ```
 */
function bersihkanStringPenjelasan(teks) {
  if (!teks || typeof teks !== "string") return teks;

  // Bersihkan pemformatan markdown json jika ada
  let hasil = teks
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/, "")
    .trim();

  // Coba parse jika string tersebut berbentuk JSON {"penjelasan": "..."} atau {"teks": "..."}
  if (hasil.startsWith("{") && hasil.endsWith("}")) {
    try {
      const obj = JSON.parse(hasil);
      return obj.penjelasan || obj.teks || obj.message || hasil;
    } catch {
      // Jika parse gagal, gunakan string aslinya
      return hasil;
    }
  }

  return hasil;
}

export async function mintaPenjelasanAira(hasil, masukan) {
  if (simulasiAiGagal()) {
    throw new Error("Simulasi kegagalan layanan AI");
  }

  // Jika data tidak valid atau status belum ditentukan, gunakan penjelasan aturan (Rule-based)
  if (!hasil?.valid || (hasil.statusKey || "belum") === "belum") {
    return buatPenjelasanAturan(hasil, masukan);
  }

  try {
    const respons = await jelaskanHasilAI(masukan);

    if (!respons?.ok) {
      throw new Error(respons?.alasan || "Layanan AI tidak tersedia");
    }

    const teksBersih = bersihkanStringPenjelasan(respons.penjelasan);

    if (!teksBersih) {
      throw new Error("keluaran AI bukan JSON valid atau teks kosong");
    }

    return teksBersih;
  } catch (err) {
    console.warn("[mintaPenjelasanAira] Gagal mengambil penjelasan AI:", err.message);
    
    // Lempar error agar komponen UI (PenjelasanAira.jsx) menangkapnya di .catch()
    // dan masuk ke tampilan state "gagal" sesuai ketentuan PRD 11.4
    throw err;
  }
}