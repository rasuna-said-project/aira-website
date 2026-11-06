// Penjelasan singkat hasil kalkulator untuk kartu "Penjelasan AIRA".
// PENTING: penjelasan hanya membantu memahami hasil. Status SELALU ditentukan oleh perhitungan (calculatorService).
//
// Alur:
// - Status "Belum Dapat Ditentukan" / data tidak valid: memakai template aturan (tanpa memanggil AI).
// - Status lain: meminta penjelasan Gemini lewat Server Action. Jika AI gagal, fungsi MELEMPAR error
//   sehingga kartu menampilkan pesan fallback-nya. Teks template tidak dipakai menggantikan AI,
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

export async function mintaPenjelasanAira(hasil, masukan) {
  if (simulasiAiGagal()) {
    throw new Error("Simulasi kegagalan layanan AI");
  }
  if (!hasil?.valid || (hasil.statusKey || "belum") === "belum") {
    return buatPenjelasanAturan(hasil, masukan);
  }
  const respons = await jelaskanHasilAI(masukan);
  if (!respons?.ok) throw new Error(respons?.alasan || "Layanan AI tidak tersedia");
  return respons.penjelasan;
}