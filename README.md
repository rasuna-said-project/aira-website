# AIRA — Smart Water Resilience for Every Woman

**AIRA (Access, Intelligence, Resilience, Action)** merupakan platform digital untuk membantu perempuan dan keluarga, terutama di wilayah yang menghadapi kekeringan atau keterbatasan akses air bersih, memahami kondisi cadangan air, memperoleh rekomendasi tindakan, dan menemukan informasi titik air alternatif.

## Fitur
- **Kalkulator Ketahanan Air:** memperkirakan ketahanan cadangan air rumah tangga dan memberikan status serta rekomendasi berbasis aturan.
- **Navigasi Air:** pencarian, filter, detail, dan petunjuk lokasi titik air yang memenuhi kriteria publikasi.
- **AIRA Assistant:** bantuan informasi air, sanitasi, dan MHM dengan dukungan AI dan sumber dokumen.
- **Dashboard User:** ringkasan, riwayat perhitungan, monitoring, data keluarga, kontribusi, dan pengaturan akun.
- **Dashboard Admin:** verifikasi kontribusi, pengelolaan titik air, serta pengawasan data.

## Teknologi
| Area | Stack |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), JavaScript |
| UI library | React 19 |
| Styling | Tailwind CSS v4 (token desain kustom `aira-*`) |
| Komponen UI | shadcn/ui (style `radix-nova`) + Radix UI, class-variance-authority, tailwind-merge, tw-animate-css |
| Ikon & konten | Lucide React, react-markdown (jawaban AIRA Assistant) |
| Backend/database | Supabase (Auth, Postgres, RLS, RPC) via `@supabase/ssr` dan `@supabase/supabase-js` |
| AI | Google Gemini + RAG/embedding (server-side) |
| Data cuaca | Open-Meteo (estimasi curah hujan) |
| Linting & testing | ESLint 9, Node.js built-in test runner |
| Deployment | Vercel (branch `master`) |

## Setup lokal
1. Clone repository, masuk ke folder `aira-website`, lalu `git checkout development`.
2. Install dependency: `npm install`.
3. Siapkan environment variables sesuai bagian **Environment variables** di dokumentasi teknis dan konfigurasi project Supabase/Gemini.
4. Jalankan development server: `npm run dev`.
5. Buka `http://localhost:3000`.

## Environment variables
Buat file `.env.local` di root proyek. Variabel yang dipakai kode:

| Variabel | Fungsi |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` (atau `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) | Kunci publik Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Kunci service role (hanya server, rahasia) |
| `NEXT_PUBLIC_SITE_URL` | URL situs (callback auth, tautan) |
| `GEMINI_API_KEY` | API key Gemini (hanya server) |
| `GEMINI_MODELS`, `GEMINI_ASSISTANT_MODELS`, `GEMINI_EMBEDDING_MODEL`, `GEMINI_MODEL_TIMEOUT_MS` | Konfigurasi model AI |
| `EMBEDDING_DIMENSION`, `SIMILARITY_THRESHOLD`, `TOP_K`, `EXACT_DOCUMENT_CHUNKS` | Pengaturan RAG |

Nilai sebenarnya diminta ke PIC backend. Jangan commit `.env.local`, API keys, service-role keys, atau credential.

## Commands
```bash
npm run dev
npm test
npm run lint
npm run build
npm run start
```

## Dokumentasi
- [API reference](docs/API.md)
- [Backend technical notes](docs/BACKEND_TECHNICAL.md)
- [Database schema audit](docs/DB_SCHEMA_AUDIT.md)
- [Database ERD (DBML)](docs/aira-core.erd.dbml)
- [Review workflow](docs/REVIEW_WORKFLOW.md)
- [Migration guide](docs/DB_MIGRATION_GUIDE.md)
- [Repair audit report](docs/REPAIR_AUDIT_REPORT.md)
- [UAT checklist](docs/UAT_CHACKELIST.md)
- API docs/Swagger page: `/api-docs`
- [Dokumentasi Front-End](docs/DOKUMENTASI_FRONTEND.md)

## Security notes
- Authenticated identity and admin authorization must be verified on the server.
- User-owned resources must be constrained by authenticated user ID and RLS or secure RPC.
- Public Water Navigation data must not include inactive, unverified, or simulation points.
- Admin removal of a water point is a soft deactivation (`is_active=false`) to preserve data and relationships.
- Assessment history deletion is permanently destructive for the assessment and directly linked recommendations/Assistant interactions; it is ownership-checked and transactional.
- Never commit secrets or service-role credentials.

## Project links
| Resource | Link |
|---|---|
| Deployment | https://aira-for-every-woman.vercel.app |
| Repository | https://github.com/rasuna-said-project/aira-website |
| PRD & User Story | [PRD and User Story Link](https://docs.google.com/document/d/1qOyyvHvcriWqDCqpoYySpHlFvHtMnJex/edit?usp=sharing&ouid=105520435052131408445&rtpof=true&sd=true) |
| ERD | [Entity Relationship Diagram Link](https://docs.google.com/document/d/185Yeddy9Jr0-utp8sI8LSuPtsB1dvA2R69jkg8kEfFA/edit?usp=sharing) |
| Schema Diagram | [Schema Diagram Link](https://dbdiagram.io/d/6b02a8815cb51eed0762cc80) |
| Prototype | [Prototype AIRA Website](https://www.figma.com/make/ex5k2NGQq0ftB6BsxDRC4S/AIRA-Water-Resilience-Platform-Design?fullscreen=1&t=ImAUKE6k4teo97z7-1&code-node-id=0-6) |
| User Flow | [User Flow AIRA Website](https://www.figma.com/design/osyN8RKVx4K3zZrLT7eg0R/User-Flow-AIRA?node-id=0-1&t=UwsGNkAbfOLN04nf-1) |
| Presentation | [Rasuna Said Presentation Link](https://docs.google.com/presentation/d/1BYh97y4oUebioXvYiacLo9SLA9H8vH-7OOmid00t0_E/edit?usp=sharing) |