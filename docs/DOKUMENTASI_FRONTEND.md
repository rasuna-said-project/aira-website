# Dokumentasi Front-End AIRA

Dokumen ini menjelaskan sisi front-end AIRA (Air, Sanitasi, dan Ketahanan Iklim): teknologi, struktur proyek, halaman, komponen, state, validasi, integrasi data, fitur AI, dan alur kerja Git. Untuk sisi server lihat [API.md](./API.md) dan [BACKEND\_TECHNICAL.md](./BACKEND_TECHNICAL.md).

## 1\. Ringkasan

AIRA adalah aplikasi web untuk menghitung ketahanan air rumah tangga, mencari titik air terdekat, berkontribusi data titik air, dan bertanya kepada AIRA Assistant (AI). Antarmuka mengikuti desain Figma tim (prototipe Figma Make); logika web dan backend tetap menjadi acuan data.

## 2\. Teknologi

| Kebutuhan | Teknologi |
| :---- | :---- |
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Bahasa | JavaScript |
| Styling | Tailwind CSS v4 \+ token kustom `aira-*` di `app/globals.css` |
| Komponen dasar | shadcn/ui (style `radix-nova`) \+ Radix UI, `class-variance-authority`, `tailwind-merge`, `tw-animate-css` |
| Ikon | `lucide-react` |
| Render markdown | `react-markdown` (jawaban AIRA Assistant) |
| Backend/Auth/DB | Supabase (Auth, Postgres, RLS, RPC) |
| AI | Gemini \+ RAG (lewat Server Action/service) |
| Data cuaca | Open-Meteo |
| Deploy | Vercel (branch `master`) |

## 3\. Menjalankan proyek

```sh
npm install
cp .env.example .env.local   # isi kunci Supabase & AI (jangan di-commit)
npm run dev      # development di http://localhost:3000
npm run lint     # ESLint
npm test         # node --test pada tests/**/*.test.mjs
npm run build    # build produksi
npm run start    # jalankan hasil build
```

Catatan: `proxy.js` membutuhkan `NEXT_PUBLIC_SUPABASE_URL` dan kunci anon Supabase; tanpa itu halaman akan error 500\. Jangan pernah commit `.env*`.

## 4\. Struktur folder

```
app/                 Halaman (App Router), layout, Server Actions, Route Handlers
  actions/           Server Actions (auth, kalkulator, assistant, kontribusi, admin, dst.)
  api/               Route Handlers REST (lihat API.md)
  dashboard/         Halaman dashboard pengguna
  admin/             Halaman dashboard admin
components/
  ui/                Komponen dasar (shadcn/ui + ButtonLink, SectionHeading)
  home/ kalkulator/ navigasi/ assistant/ auth/ dashboard/ admin/
  Navbar.jsx Footer.jsx ConditionalFooter.jsx LogoutDialog.jsx StatusBadge.jsx ...
hooks/               useAssistantChat, useHasilKalkulator
lib/                 Utilitas, validasi (lib/validation*), klien Supabase, format
services/            Logika bisnis sisi server (kalkulator, AI, kontribusi, admin)
proxy.js             Proteksi rute & sesi Supabase
public/              Aset statis (logo, gambar)
tests/               Unit test (`*.test.mjs`)
docs/                Dokumentasi
```

Alias impor: `@/` menunjuk ke root proyek (mis. `@/components/ui/button`).

## 5\. Routing & halaman

### Publik

| Rute | Fungsi |
| :---- | :---- |
| `/` , `/beranda` | Landing page (hero, tentang, fitur, nilai) |
| `/cara-kerja` | Penjelasan cara kerja AIRA |
| `/fitur-kami` | Daftar fitur |
| `/kalkulator-air` | Form kalkulator ketahanan air (multi-langkah) |
| `/kalkulator-air/hasil` | Hasil perhitungan (status, estimasi hari) |
| `/kalkulator-air/rekomendasi` | Rekomendasi tindakan (termasuk estimasi panen hujan) |
| `/navigasi-air` , `/navigasi-air/[id]` | Pencarian & detail titik air, laporkan informasi |
| `/assistant` | Chat AIRA Assistant |
| `/api-docs` | Swagger UI (dokumentasi API) |

### Autentikasi

`/masuk`, `/masuk/reset-password`, `/daftar`, `/auth/callback` (route handler).

### Dashboard pengguna (wajib login) — `/dashboard`

`/dashboard` (beranda), `/dashboard/kondisi-air`, `/dashboard/kontribusi`, `/dashboard/monitoring`, `/dashboard/pengaturan`.

### Dashboard admin (wajib login \+ role admin) — `/admin`

`/admin`, `/admin/kelola-titik-air` (+ `/[id]`), `/admin/titik-air`, `/admin/pengguna`, `/admin/verifikasi` (+ `/[id]`).

### Proteksi rute

Dilakukan di `proxy.js`:

- Belum login membuka `/dashboard` atau `/admin` → redirect `/masuk`.  
- Akun tidak aktif / profil tidak ditemukan / role tidak dikenal → redirect `/masuk?error=inactive|profile|role`.  
- Sudah login membuka `/masuk` atau `/daftar` → diarahkan ke `/admin` (admin) atau `/dashboard` (user).  
- User biasa membuka `/admin` → `/dashboard`; admin membuka dashboard user → `/admin`.

## 6\. Layout global

`app/layout.js` memuat font, `Navbar` (sesi dibaca di server lewat `ambilSesiNavbar` lalu dikirim sebagai prop `sesi`), konten halaman, dan `ConditionalFooter` (footer disembunyikan pada halaman tertentu seperti dashboard). `Navbar` menandai menu aktif dengan `usePathname`, memiliki menu mobile (hamburger), tombol Kalkulator sebagai aksi utama, dan `LogoutDialog` untuk konfirmasi keluar. Dashboard dan admin memakai layout sendiri (`DashboardLayout` \+ `Sidebar`, `AdminShell` \+ `AdminSidebar`).

## 7\. Sistem desain

- **Font:** Plus Jakarta Sans (judul, `--font-plus-jakarta`) dan Inter (isi, `--font-inter`).  
- **Warna (token Tailwind):** Deep Ocean `#176B78` (`aira-primary`), primary dark `#0F525C`, Aqua `#4EA8DE`, Sage `#94D2BD`, Ice `#F9FBFB` (`aira-bg`), Charcoal `#26363B` (`aira-text`), Peach `#E99A83`, Sand `#F4EBDD`. Status: `aira-warning*`, `aira-danger*`. Bayangan `shadow-soft`.  
- **Aturan:** ikuti Figma; hindari warna ungu/oranye di luar token.  
- **Responsif:** pendekatan mobile-first dengan breakpoint Tailwind (`sm`, `md`, `lg`); navbar berubah menjadi menu hamburger di layar kecil, grid kartu menyesuaikan kolom, halaman AI Assistant juga responsif.  
- **Aksesibilitas:** atribut `aria-*`/`role` dipakai pada banyak komponen (mis. `role="note"` pada disclaimer AI, dialog dengan `role="dialog"`), fokus terlihat dari kelas `focus-visible`.

## 8\. Komponen

### 8.1 shadcn/ui (`components/ui`)

`button`, `card`, `input`, `badge`, `accordion`, ditambah `ButtonLink` dan `SectionHeading`. Varian dikelola dengan `cva`, class digabung via `cn()` dari `lib/utils`.

```
import { Button } from "@/components/ui/button";
<Button variant="outline" size="sm">Simpan</Button>
```

### 8.2 Komponen domain (reusable, berbasis props)

| Folder | Isi utama |
| :---- | :---- |
| `home/` | `HeroSection`, `HeroStatusCard`, `FeatureCard`, `ValueCard`, `AboutSection` |
| `kalkulator/` | `KalkulatorForm`, `Stepper`, `RegionSelect`, `FieldLabel`, `HasilKalkulator`, `hasil/*` (`StatusCard`, `StatusConfig`, `RekomendasiCard`, `EstimasiPanenHujan`) |
| `navigasi/` | `Combobox`, `DaftarTitikAir`, `KartuTitikAir`, `DetailTitikAir`, `LaporkanInformasi`, `TitikAirTidakDitemukan` |
| `assistant/` | `AssistantClient`, `ChatPanel`, `ChatMessage`, `ChatInput`, `SuggestedPrompts`, `TypingIndicator`, `AssistantNotice`, `AssistantHeader`, `AssistantAvatar`, `AssistantQuickLinks` |
| `auth/` | `AuthCard`, `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPassword`, `FormField`, `PasswordField`, `FormMessage`, `TermsPrivacyDialog` |
| `dashboard/` | `DashboardLayout`, `Header`, `Sidebar`, `PageHead`, subfolder per halaman (`kondisi-air`, `kontribusi`, `monitoring`, `pengaturan`) |
| `admin/` | `AdminShell`, `AdminSidebar`, `AdminPageHeader`, `AdminDashboard`, `pengguna/`, `titik-air/`, `verifikasi-titik-air/` |
| root | `Navbar`, `Footer`, `StatusBadge`, `LineCard`, `RoundChart`, `LogoutDialog` |

Konvensi: nama komponen PascalCase `.jsx`; komponen interaktif diberi `"use client"` di baris pertama, selebihnya Server Component.

### 8.3 Pola dialog / overlay

Dialog kustom (mis. `DialogCatatan`, `DialogKonfirmasi` di `components/dashboard/kondisi-air/DialogDashboard.jsx`, dan `Modal`/`DeleteDialog` di admin) memakai pola yang sama:

- dirender lewat portal ke `document.body`;  
- overlay `fixed` setinggi `100dvh`, kartu berada di tengah dengan jarak atas setara posisi "eye level" mengikuti Figma;  
- scroll `html` dan `body` dikunci selama dialog terbuka;  
- animasi fade/translate ±180 ms;  
- dialog tidak diletakkan di dalam `<form>` agar event tidak menjalar lewat portal.

## 9\. State management

Pendekatan yang dipakai saat ini:

- **State lokal dengan Hooks** (`useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`) pada komponen client.  
- **Custom hooks** di `hooks/`:  
  - `useAssistantChat` — pesan, input, `loading`, `error`, `retryMessage`, pemuatan riwayat, auto-scroll.  
  - `useHasilKalkulator` — membaca hasil kalkulator dari `sessionStorage` memakai `useSyncExternalStore` (aman SSR).  
- **Server state:** data diambil di Server Component atau lewat Server Action, lalu dikirim ke komponen client sebagai props.  
- **Props drilling** antar komponen (mis. `sesi` dari layout ke `Navbar`).

>   
> **Catatan jujur / rekomendasi:** hingga dokumen ini ditulis, proyek belum memakai **React Context** (`createContext`/`useContext`). Panduan teknis bootcamp menyebut state via Hooks *dan* Context. Jika waktu memungkinkan, kandidat yang cocok untuk Context adalah sesi/profil pengguna (agar tidak perlu props drilling `sesi`) atau pengaturan UI dashboard.

## 10\. Form & validasi sisi klien

- Aturan umum di `lib/validation.js` (`validateEmail`, `validatePassword`, `normalizeEmail`, `MIN_PASSWORD = 8`) — pesan error disamakan dengan prototipe Figma.  
- Validasi domain di `lib/validation/` (`common.js`, `contribution.js`, `navigation.js`, `waterAssessment.js`) dan `lib/phone.js`; dipakai di klien maupun server, sehingga aturan sama di kedua sisi.  
- Komponen form menampilkan: pesan error per field (`FormField`/`FormMessage`), status **loading** pada tombol saat submit, pesan sukses/gagal dari Server Action, dan tombol dinonaktifkan selama proses.  
- Validasi server tetap dijalankan ulang (jangan mengandalkan klien saja).

## 11\. Pengambilan data

- **Server Actions** (`app/actions/*.js`): `auth`, `kalkulator`, `assistant`, `riwayat`, `contribution`, `kontribusi-user`, `navigasi-air`, `penjelasan`, `profile`, `dashboard`, `admin-titik-air`, `admin-verifikasi`.  
- **Route Handlers** (`app/api/**`): REST untuk kebutuhan eksternal/Swagger; kontrak lengkap di [API.md](./API.md).  
- **Services** (`services/*`) memuat logika bisnis; komponen tidak memanggil Supabase langsung untuk operasi tulis sensitif.  
- Format respons Server Action: `{ ok, data?, error? }` (contoh: `response?.ok` di `useAssistantChat`).

## 12\. Fitur utama di UI

### 12.1 Kalkulator ketahanan air

Form multi-langkah (`Stepper`) → hasil → rekomendasi. Aturan perhitungan: kebutuhan dasar **15 L/orang/hari**, tambahan **\+5 L** untuk anggota dengan kebutuhan MHM (manajemen kebersihan menstruasi); status (aman/waspada/kritis) ditentukan dari estimasi durasi persediaan terhadap ambang batas di `components/kalkulator/hasil/StatusConfig`. Hasil disimpan sementara di `sessionStorage` dan dibaca `useHasilKalkulator`. Pengguna login dapat menyimpan riwayat (Dashboard → Kondisi Air).

### 12.2 Navigasi Air

Cari titik air berdasarkan wilayah (`RegionSelect`/`Combobox`), lihat daftar kartu, detail, tautan Google Maps, dan laporkan informasi (`LaporkanInformasi`). Titik nonaktif atau belum terverifikasi tidak ditampilkan publik.

### 12.3 AIRA Assistant (fitur AI)

UI memenuhi kebutuhan antarmuka fitur AI:

| Elemen | Implementasi |
| :---- | :---- |
| Input | `ChatInput` \+ `SuggestedPrompts` |
| Loading | `TypingIndicator`, state `loading` pada `useAssistantChat` |
| Hasil | `ChatMessage` merender jawaban dengan `react-markdown` |
| Error | state `error` \+ `retryMessage` untuk kirim ulang |
| Penanda AI | `AssistantHeader`/`AssistantAvatar` dan disclaimer `AssistantNotice` (`role="note"`) |
| Riwayat | dimuat lewat `ambilRiwayatAssistant` saat halaman dibuka |

Responsif untuk mobile maupun desktop.

### 12.4 Dashboard pengguna

Beranda ringkasan, Kondisi Air (profil keluarga, riwayat perhitungan dengan dialog catatan & hapus), Kontribusi (ajukan titik air baru/koreksi), Monitoring, Pengaturan profil.

### 12.5 Dashboard admin

Ringkasan statistik, Kelola Titik Air (CRUD; "hapus" \= nonaktifkan `is_active=false`, bukan hapus permanen), Verifikasi Kontribusi (setujui/tolak/minta revisi \+ status ketersediaan final), Manajemen Pengguna (kelola status akun).

## 13\. Pemetaan layar Figma ke kode

| Kode layar | Halaman/komponen |
| :---- | :---- |
| A01–A08 | Halaman publik & autentikasi (`app/`, `components/home`, `kalkulator`, `navigasi`, `assistant`, `auth`) |
| B01 | `/dashboard` (`components/dashboard/beranda`) |
| B02 | `/dashboard/kondisi-air` (`components/dashboard/kondisi-air`) |
| B03–B05 | Kontribusi, Monitoring, Pengaturan |
| C01 | `/admin/pengguna` & dashboard admin |
| C02 | `/admin/verifikasi` |
| C03 | `/admin/kelola-titik-air` |

> Sesuaikan pemetaan A/B/C di atas dengan penomoran final di berkas Figma tim bila berbeda.

## 14\. Pengujian

- Unit test: `npm test` (validasi kontribusi, lokasi, telepon, rekomendasi).  
- UAT manual: lihat [UAT\_CHACKELIST.md](./UAT_CHACKELIST.md).  
- Sebelum PR: jalankan `npm run lint` dan `npm run build`.  
- Catatan: beberapa tes rekomendasi/AI sempat gagal pada audit sebelumnya (lihat [REPAIR\_AUDIT\_REPORT.md](./REPAIR_AUDIT_REPORT.md)); periksa status terbaru dengan `npm test`.

## 15\. Alur kerja Git

| Branch | Fungsi |
| :---- | :---- |
| `master` | Produksi, otomatis dideploy ke Vercel |
| `development` | Integrasi; tempat push, PR, dan merge perubahan |
| `feature/*`, `revisi-*`, dst. | Branch tugas, dibuat dari `development` |

Aturan:

1. Jangan bekerja langsung di `master` atau `development`.  
2. Buat branch dari `development` → commit dengan pesan jelas → push → buka **Pull Request ke `development`**.  
3. Setelah `development` stabil, merge ke `master` untuk deploy.  
4. Jangan commit `.env*`, `node_modules`, atau file besar.  
5. Cek *preview* Vercel pada PR dapat gagal bagi kontributor yang tidak punya akses tim Vercel; ini bisa diabaikan.

Contoh pesan commit: `docs: tambah dokumentasi front-end`, `feat(kondisi-air): dialog catatan di tengah layar`, `fix(navbar): menu aktif pada sub-rute`.

## 16\. Konvensi & batasan yang diketahui

- JavaScript saja; gunakan alias `@/`.  
- Satu komponen satu file; props dijelaskan lewat penamaan jelas; hindari duplikasi, ekstrak ke komponen reusable.  
- Teks antarmuka berbahasa Indonesia.  
- Batasan: belum ada React Context (lihat bagian 9); beberapa tes AI/rekomendasi perlu diperiksa; migrasi database harus dijalankan sesuai [DB\_MIGRATION\_GUIDE.md](./DB_MIGRATION_GUIDE.md).

## 17\. Dokumen terkait

[API.md](./API.md) · [BACKEND\_TECHNICAL.md](./BACKEND_TECHNICAL.md) · [DB\_SCHEMA\_AUDIT.md](./DB_SCHEMA_AUDIT.md) · [DB\_MIGRATION\_GUIDE.md](./DB_MIGRATION_GUIDE.md) · [INSTALL\_ADMIN\_WATER\_POINT\_CRUD.md](./INSTALL_ADMIN_WATER_POINT_CRUD.md) · [UAT\_CHACKELIST.md](./UAT_CHACKELIST.md) · [aira-core.erd.dbml](./aira-core.erd.dbml)