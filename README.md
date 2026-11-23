# AIRA — Smart Water Resilience for Every Woman

**AIRA (Access, Intelligence, Resilience, Action)** adalah platform digital untuk membantu perempuan dan keluarga memahami ketahanan air rumah tangga, mengambil langkah yang sesuai saat menghadapi keterbatasan air, dan menemukan informasi titik air alternatif. AIRA dirancang dengan mempertimbangkan kebutuhan masyarakat di wilayah yang berisiko mengalami kekeringan atau memiliki akses air bersih terbatas.

**Live website:** https://aira-for-every-woman.vercel.app

## Fitur Utama

- **Kalkulator Ketahanan Air** — memperkirakan kondisi dan durasi cadangan air rumah tangga berdasarkan data yang dimasukkan, serta menampilkan status dan rekomendasi berbasis aturan.
- **Estimasi Panen Air Hujan** — menyediakan estimasi potensi air hujan berdasarkan data curah hujan dan luas atap ketika data wilayah tersedia.
- **Navigasi Air** — mencari, memfilter, dan melihat detail titik air yang tersedia untuk publik, termasuk akses ke petunjuk lokasi melalui peta.
- **AIRA Assistant** — menjawab pertanyaan seputar air, sanitasi, dan Menstrual Hygiene Management (MHM) dengan dukungan AI dan knowledge base (RAG), serta sumber rujukan bila tersedia.
- **Kontribusi Komunitas** — pengguna dapat mengusulkan titik air baru atau perubahan data. Kontribusi ditinjau admin sebelum dipublikasikan.
- **Dashboard User** — menyediakan ringkasan kondisi, riwayat kalkulator, data keluarga, riwayat kontribusi, dan pengaturan akun.
- **Dashboard Admin** — mendukung peninjauan kontribusi, pengelolaan titik air, pengguna, serta informasi aktivitas administrasi.

## Teknologi
| Area | Stack |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), JavaScript |
| UI library | React 19 |
| Styling | Tailwind CSS v4 (token desain kustom `aira-*`) |
| Komponen UI | shadcn/ui (style `radix-nova`) + Radix UI, class-variance-authority, tailwind-merge, tw-animate-css |
| Ikon & konten | Lucide React, react-markdown (jawaban AIRA Assistant) |
| Backend | Route Handlers, Server Actions, service layer |
| Database | Supabase PostgreSQL, RLS, RPC, pgvector |
| AI | Google Gemini, retrieval dan embedding (RAG) |
| Data cuaca | Open-Meteo (estimasi curah hujan) |
| Testing/linting | Node.js built-in test runner, ESLint |
| Deployment | Vercel (branch `master`) |

## Setup lokal
1. Clone repository, masuk ke folder `aira-website`, lalu `git checkout development`.
2. Install dependency: `npm install`.
3. Siapkan environment variables sesuai bagian **Environment variables** di dokumentasi teknis dan konfigurasi project Supabase/Gemini.
4. Jalankan development server: `npm run dev`.
5. Buka `http://localhost:3000`.

## Environment Variables

Buat file `.env.local` dan konfigurasi variabel sesuai kebutuhan aplikasi dan environment Supabase/Gemini. Variabel yang dipakai kode:

| Variabel | Fungsi |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` atau `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Kunci publik untuk client Supabase |
| `SUPABASE_URL` | URL Supabase untuk konfigurasi server bila digunakan |
| `SUPABASE_SERVICE_ROLE_KEY` | Kunci service-role untuk operasi server yang memerlukan hak khusus; rahasia |
| `NEXT_PUBLIC_SITE_URL` | URL aplikasi untuk callback/tautan |
| `GEMINI_API_KEY` | API key Gemini untuk pemanggilan model dari server |
| `GEMINI_MODELS`, `GEMINI_ASSISTANT_MODELS` | Konfigurasi model Gemini |
| `GEMINI_EMBEDDING_MODEL`, `EMBEDDING_DIMENSION` | Konfigurasi embedding |
| `GEMINI_MODEL_TIMEOUT_MS` | Batas waktu pemanggilan model |
| `TOP_K`, `EXACT_DOCUMENT_CHUNKS`, `SIMILARITY_THRESHOLD` | Parameter retrieval RAG |

Variabel tambahan dapat digunakan sesuai konfigurasi deployment. Jangan memasukkan nilai rahasia ke repository, dokumentasi publik, atau client bundle. Jangan commit `.env.local`.

## Commands

```bash
npm run dev      # Menjalankan development server
npm test         # Menjalankan test yang tersedia
npm run lint     # Menjalankan lint
npm run build    # Membuat production build
npm run start    # Menjalankan server production lokal
```
## AI dan Batasan

AIRA menggunakan AI untuk membantu menjelaskan informasi dan menjawab pertanyaan, bukan untuk menggantikan pemeriksaan atau keputusan ahli. Pada Kalkulator Ketahanan Air, perhitungan status dan rekomendasi ditentukan oleh aturan aplikasi; AI digunakan untuk membantu menjelaskan hasil bila fitur tersebut tersedia. AIRA Assistant memanfaatkan retrieval dari knowledge base dan model Gemini, namun jawaban AI dapat tidak lengkap atau keliru.

Estimasi ketahanan air dan panen air hujan merupakan estimasi, bukan pengukuran langsung. Informasi titik air yang ditampilkan juga bergantung pada ketersediaan dan kelengkapan data. Informasi potabilitas air tidak boleh dianggap sebagai hasil uji laboratorium.

## UAT (User Acceptance Test)

UAT dilakukan dengan **10 pengguna**. **Enam pengguna** mengisi formulir feedback, sedangkan **empat pengguna lainnya** memberikan feedback secara langsung. Rekap skor kuantitatif dalam laporan berasal dari enam respons formulir; feedback lisan digunakan sebagai masukan kualitatif dan tidak dihitung sebagai skor formulir.

Hasil formulir menunjukkan penilaian positif pada beberapa aspek utama, termasuk kecocokan informasi dengan input dan manfaat aplikasi dalam membantu memahami serta mengantisipasi kondisi kekurangan air. Masukan pengguna juga menjadi bahan perbaikan pada aspek pengalaman penggunaan, navigasi, kecepatan respons, dan akses/login.

Lihat [UAT Report](docs/UAT_REPORT.md) untuk ringkasan pelaksanaan dan hasil feedback. Checklist skenario pengguna dan teknis tersedia di [UAT Checklist](docs/UAT_CHACKELIST.md), apabila file tersebut tersedia di repository.

## Dokumentasi Repository

- [Backend Technical Documentation](docs/BACKEND_TECHNICAL.md)
- [API Documentation](docs/API.md) — API UI tersedia di `/api-docs`; OpenAPI di `/api/openapi` bila tersedia pada deployment.
- [Database Documentation](docs/DATABASE.md)
- [Database Schema Audit](docs/DB_SCHEMA_AUDIT.md)
- [Database Migration Guide](docs/DB_MIGRATION_GUIDE.md)
- [ERD (DBML)](docs/aira-core.erd.dbml)
- [Frontend Documentation](docs/DOKUMENTASI_FRONTEND.md)
- [AI Documentation and Evaluation](docs/AI_DOCUMENTATION.md)
- [UAT Report](docs/UAT_REPORT.md)
- [UAT Checklist](docs/UAT_CHACKELIST.md)

> Nama atau lokasi beberapa dokumen dapat menyesuaikan struktur file yang benar-benar tersedia pada repository.

## Project Resources

| Resource | Link |
|---|---|
| Website AIRA | https://aira-for-every-woman.vercel.app |
| Repository Website | https://github.com/rasuna-said-project/aira-website |
| PRD, User Story, dan Dokumentasi AI | [Google Docs](https://docs.google.com/document/d/1qOyyvHvcriWqDCqpoYySpHlFvHtMnJex/edit#heading=h.61ai02tx800c) |
| User Flow | [Figma](https://www.figma.com/design/osyN8RKVx4K3zZrLT7eg0R/User-Flow-AIRA?node-id=1-7&t=eBK3Ywkesp6Udbje-1) |
| Prototype | [Figma](https://www.figma.com/make/ex5k2NGQq0ftB6BsxDRC4S/AIRA-Water-Resilience-Platform-Design?fullscreen=1&t=kT9P4VtxVGaDMymQ-1&code-node-id=0-6) |
| ERD Documentation | [Google Docs](https://docs.google.com/document/d/185Yeddy9Jr0-utp8sI8LSuPtsB1dvA2R69jkg8kEfFA/edit?usp=sharing) |
| Schema Diagram | [dbdiagram.io](https://dbdiagram.io/d/6b02a8815cb51eed0762cc80) |
| SQL Script | [Google Docs](https://docs.google.com/document/d/1wIqJKOJ9EQ_26ZVcrDOlJ9cy87YAC_ST6KyUpLrSPO8/edit?usp=drive_link) |
| Seed Data | [Google Drive](https://drive.google.com/drive/folders/1XNthoj10KdeyZJVQ6TA_7FZSVPrKqjGX) |
| API Documentation | [API Docs](https://aira-for-every-woman.vercel.app/api-docs) |
| AI Pipeline Repository | [GitHub](https://github.com/blacurly/rasuna-said) |
| Presentation Deck | [Google Slides](https://docs.google.com/presentation/d/1BYh97y4oUebioXvYiacLo9SLA9H8vH-7OOmid00t0_E/edit?usp=sharing) |
| Presentation and Product Demo Video | [Google Drive](https://drive.google.com/drive/folders/1DLoZDqhTxpNmAzOx5-w_Ftb3yfjzRbQI?usp=sharing) |

## Security

- Verifikasi autentikasi, kepemilikan data, dan hak admin dilakukan di sisi server sesuai alur aplikasi.
- Lindungi API keys, service-role keys, dan konfigurasi rahasia; jangan commit ke repository.
- Data kandidat atau kontribusi yang belum disetujui tidak otomatis ditampilkan sebagai titik air publik terverifikasi.
- Hapus data pengguna hanya melalui alur aplikasi yang sesuai dan pemeriksaan kepemilikan.
