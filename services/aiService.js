import { STATUS_KRISIS, STATUS_WASPADA, STATUS_AMAN } from './calculatorService';

// 1. REKOMENDASI BERBASIS ATURAN (RULE-BASED RECOMMENDATIONS)
export const REKOMENDASI_ATURAN = {
  [STATUS_KRISIS]: [
    "Segera jatah penggunaan air harian hanya untuk kebutuhan minum dan sanitasi vital.",
    "Cari bantuan titik sumber air bersih darurat atau layanan distribusi air terdekat.",
    "Siapkan penampung air darurat untuk mengantisipasi kelangkaan lebih lanjut."
  ],
  [STATUS_WASPADA]: [
    "Mulai lakukan penghematan air rumah tangga (gunakan air bekas cuci untuk menyiram/toilet).",
    "Periksa dan perbaiki kebocoran tangki atau pipa air tersimpan.",
    "Pertimbangkan untuk memasang penampung panen air hujan sebagai sumber cadangan."
  ],
  [STATUS_AMAN]: [
    "Pertahankan kebiasaan penggunaan air yang hemat dan bijak.",
    "Lakukan pembersihan dan perawatan rutin pada tangki penampung air.",
    "Pantau kondisi sumber air secara berkala terutama saat pergantian musim."
  ],
  "DEFAULT": [
    "Lengkapi data cadangan dan kondisi sumber air untuk mendapatkan rekomendasi tindakan yang tepat."
  ]
};

/**
 * Mengambil rekomendasi berbasis aturan berdasarkan status kalkulator.
 */
export function dapatkanRekomendasiAturan(status) {
  return REKOMENDASI_ATURAN[status] || REKOMENDASI_ATURAN["DEFAULT"];
}

// 2. PENJELASAN AI DENGAN FALLBACK SAFEGUARD
/**
 * Memanggil layanan AI untuk memberikan penjelasan kontekstual.
 * Jika AI gagal/error, fungsi otomatis mengembalikan penjelasan standar (rule-based fallback).
 */
export async function dapatkanPenjelasanAI(hasilKalkulator) {
  const { status, durasiHari, kebutuhanHarianLiter, cadanganAirLiter, alasanStatus } = hasilKalkulator;

  // Penjelasan Fallback (Digunakan jika layanan AI gagal)
  const penjelasanFallback = `Berdasarkan kalkulasi, estimasi cadangan air Anda (${cadanganAirLiter} Liter) diperkirakan bertahan selama ${durasiHari} hari dengan kebutuhan harian ${kebutuhanHarianLiter} Liter. ${alasanStatus}`;

  try {
    // Panggil API Backend / AI Service (Ganti endpoint sesuai konfigurasi backend Next.js/Server Action)
    const response = await fetch('/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hasilKalkulator),
      // Set timeout agar AI tidak membuat loading terlalu lama
      signal: AbortSignal.timeout(4000) 
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      penjelasan: data.penjelasan || penjelasanFallback,
      isAiGenerated: true
    };
  } catch (error) {
    console.warn("Layanan AI gagal/timeout, menggunakan penjelasan fallback aturan:", error.message);
    
    // Syarat RTL: Layanan AI gagal TIDAK BOHLEH menghalangi hasil!
    return {
      success: true,
      penjelasan: penjelasanFallback,
      isAiGenerated: false // Penanda bahwa ini memakai fallback standar
    };
  }
}