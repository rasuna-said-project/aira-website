// aira-website/app/kalkulator-air/hasil/page.js
'use client';

import { useEffect, useState } from 'react';
import { dapatkanRekomendasiAturan, dapatkanPenjelasanAI } from '@/services/aiService';

export default function HasilKalkulatorPage({ hasilKalkulatorData }) {
  const [penjelasan, setPenjelasan] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(true);

  // 1. DERIVED STATE: Rekomendasi aturan langsung dihitung tanpa useState / useEffect (Bebas Error ESLint!)
  const rekomendasi = hasilKalkulatorData?.status
    ? dapatkanRekomendasiAturan(hasilKalkulatorData.status)
    : [];

  // 2. useEffect KHUSUS UNTUK PROSES ASYNCHRONOUS (Fetch Penjelasan AI)
  useEffect(() => {
    if (!hasilKalkulatorData) return;

    let isMounted = true;

    async function loadAiExplanation() {
      setIsLoadingAi(true);
      const res = await dapatkanPenjelasanAI(hasilKalkulatorData);
      
      if (isMounted) {
        setPenjelasan(res.penjelasan);
        setIsLoadingAi(false);
      }
    }

    loadAiExplanation();

    return () => {
      isMounted = false;
    };
  }, [hasilKalkulatorData]);

  return (
    <div className="hasil-container">
      {/* Status Utama */}
      <h2>Status: {hasilKalkulatorData?.status}</h2>
      <p>Ketahanan Air: <strong>{hasilKalkulatorData?.durasiHari} Hari</strong></p>

      {/* Penjelasan AI / Fallback */}
      <section className="penjelasan-section">
        <h3>Penjelasan Kondisi</h3>
        {isLoadingAi ? (
          <p>Memuat penjelasan...</p>
        ) : (
          <p>{penjelasan}</p>
        )}
      </section>

      {/* Rekomendasi Aturan */}
      <section className="rekomendasi-section">
        <h3>Langkah yang Disarankan</h3>
        <ul>
          {rekomendasi.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
