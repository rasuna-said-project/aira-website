# AIRA — Smart Water Resilience for Every Woman

**AIRA (Access, Intelligence, Resilience, Action)** adalah platform digital yang dirancang untuk membantu perempuan dan keluarga, khususnya di daerah rawan kekeringan, memahami kondisi cadangan air rumah tangga, memperoleh rekomendasi tindakan, serta menemukan informasi titik air alternatif dan panduan sanitasi, termasuk Kebersihan Menstruasi (*Menstrual Hygiene Management* atau MHM).

AIRA dikembangkan dengan fokus pada kemudahan akses informasi, ketahanan rumah tangga dalam menghadapi krisis air, dan panduan praktis berbasis AI. Fitur utama dapat diakses tanpa wajib login, sedangkan fitur personal seperti penyimpanan riwayat dan pengelolaan data pengguna tersedia melalui akun.

---

## 🚀 Fitur Utama

### 1. Cek Air — Kalkulator Ketahanan Air

Membantu pengguna memperkirakan lama ketahanan cadangan air rumah tangga berdasarkan informasi yang dimasukkan, seperti jumlah cadangan air, jumlah anggota keluarga, dan kebutuhan air harian.

Hasil perhitungan menampilkan status kondisi air, termasuk Mode Krisis apabila kriteria krisis terpenuhi, serta rekomendasi tindakan yang sesuai. Jika informasi yang dimasukkan belum mencukupi, sistem tidak boleh memberikan status aman secara otomatis.

### 2. Navigasi Air

Membantu pengguna mencari informasi titik air alternatif melalui daftar titik air, pencarian, filter, dan halaman detail lokasi.

Jika informasi lokasi tersedia, pengguna dapat membuka petunjuk arah melalui Google Maps. Informasi ketersediaan, jam operasional, status verifikasi, dan waktu pembaruan data perlu dibedakan dengan jelas.

### 3. AIRA Assistant

Asisten berbasis AI yang membantu pengguna mendapatkan jawaban, rekomendasi tindakan, dan panduan praktis terkait pengelolaan air rumah tangga, sanitasi, MHM, serta tindakan yang dapat dilakukan saat terjadi krisis air.

Rekomendasi AI berfungsi sebagai pendamping informasi dan tidak menggantikan hasil perhitungan sistem atau informasi resmi yang relevan.

### 4. Dashboard User — Memerlukan Login

Area personal pengguna yang menyediakan:
- Ringkasan kondisi air rumah tangga.
- Riwayat perhitungan Kalkulator Ketahanan Air.
- Monitoring kondisi air berdasarkan data yang dicatat pengguna.
- Pengelolaan data keluarga.
- Kontribusi informasi titik air.
- Pengaturan akun.

### 5. Dashboard Admin — Akses Khusus

Panel pengelolaan untuk admin yang menyediakan:
- Ringkasan dashboard dan riwayat perubahan data.
- Antrean verifikasi kontribusi titik air.
- Pemeriksaan detail kontribusi.
- Pengelolaan titik air yang telah diverifikasi.
- Pembaruan informasi titik air dan status verifikasi.

Kontribusi yang belum diverifikasi tidak boleh ditampilkan sebagai informasi titik air yang telah terkonfirmasi.

---

## 🛠️ Tech Stack & Konfigurasi

Teknologi yang digunakan dalam proyek mengikuti konfigurasi repositori AIRA.

- **Framework:** Next.js dengan App Router.
- **Programming Language:** JavaScript.
- **UI Library:** React.
- **Styling:** Tailwind CSS v4.
- **UI Component Library:** shadcn/ui berbasis Radix UI.
- **Icons:** Lucide React.
- **Typography:** Plus Jakarta Sans dan Inter, sesuai konfigurasi font proyek.

### 🎨 Palet Warna AIRA

Tema warna dikelola melalui konfigurasi CSS di `app/globals.css` menggunakan pendekatan `@theme inline` pada Tailwind CSS v4.

| Peran | Nama Token | Kode Warna |
|---|---|---|
| Primary — Deep Ocean | `aira-primary` | `#176B78` |
| Secondary — Aqua Clean | `aira-secondary` | `#4EA8DE` |
| Sustainability — Soft Sage | `aira-sage` | `#94D2BD` |
| Background — Ice White | `aira-bg` | `#F9FBFB` |
| Text — Deep Charcoal | `aira-text` | `#26363B` |
| Feminine Accent — Coral Peach | `aira-peach` | `#E99AB3` |
| Card Accent — Soft Sand | `aira-sand` | `#F4EBDD` |

Gunakan token warna yang telah didefinisikan, seperti `bg-aira-primary`, `text-aira-primary`, `bg-aira-bg`, dan `text-aira-text`, daripada menuliskan kode warna berulang kali di setiap komponen.

Nama token, font, dan kode warna di atas perlu sesuai dengan definisi yang benar-benar tersedia di `app/globals.css`.

---

## 📁 Struktur Folder Proyek

Proyek AIRA menggunakan **Next.js App Router pada direktori root**, tanpa folder `src/`.

```text
aira-website/
├── public/                         # Aset statis
│
├── app/                            # Routing, halaman, layout, dan CSS global
│   ├── font/                       # Font lokal jika disimpan di sini
│   ├── layout.js                   # Root layout aplikasi
│   ├── page.js                     # Landing page
│   ├── globals.css                 # CSS global dan tema warna AIRA
│   │
│   ├── fitur-kami/
│   │   └── page.js                 # Informasi fitur AIRA
│   ├── cara-kerja/
│   │   └── page.js                 # Penjelasan cara kerja AIRA
│   ├── masuk/
│   │   └── page.js                 # Login
│   ├── daftar/
│   │   └── page.js                 # Registrasi
│   │
│   ├── kalkulator-air/
│   │   ├── page.js                 # Form kalkulator
│   │   ├── hasil/
│   │   │   └── page.js             # Hasil dan status kondisi air
│   │   └── rekomendasi/
│   │       └── page.js             # Rekomendasi tindakan
│   │
│   ├── navigasi-air/
│   │   ├── page.js                 # Daftar, pencarian, dan filter titik air
│   │   └── [id]/
│   │       └── page.js             # Detail titik air
│   │
│   ├── assistant/
│   │   └── page.js                 # AIRA Assistant
│   │
│   ├── dashboard/
│   │   ├── page.js                 # Ringkasan kondisi dan riwayat
│   │   ├── monitoring/
│   │   │   └── page.js             # Monitoring kondisi air
│   │   ├── kontribusi/
│   │   │   └── page.js             # Kontribusi titik air
│   │   └── pengaturan/
│   │       └── page.js             # Pengaturan akun
│   │
│   └── admin/
│       ├── page.js                 # Ringkasan dashboard admin
│       ├── verifikasi/
│       │   └── page.js             # Antrean verifikasi kontribusi
│       └── kelola-titik-air/
│           └── page.js             # Pengelolaan titik air
│
├── components/                     # Komponen antarmuka yang digunakan ulang
│   ├── ui/                         # Komponen dasar shadcn/ui
│   ├── Navbar.jsx                  # Navigasi utama
│   ├── Footer.jsx                  # Footer aplikasi
│   ├── RoundChart.jsx              # Komponen grafik lingkaran
│   └── LineChart.jsx               # Komponen grafik garis
│
├── data/                           # Data statis atau mock data
│   ├── titikAir.json               # Contoh data titik air
│   └── riwayatKalkulator.json      # Contoh riwayat perhitungan
│
├── lib/                            # Helper dan utilitas
│   └── utils.js                    # Utilitas, termasuk cn() shadcn/ui
│
├── services/                       # Logika layanan dan integrasi
│   ├── aiService.js                # Integrasi layanan AI jika tersedia
│   ├── calculatorService.js        # Logika perhitungan ketahanan air
│   └── api.js                      # Helper komunikasi API jika diperlukan
│
├── components.json                 # Konfigurasi shadcn/ui
├── package.json                    # Dependensi dan scripts proyek
└── README.md                       # Dokumentasi proyek
```

**Catatan:** Struktur di atas merupakan acuan pengorganisasian proyek. Tidak semua folder atau file harus sudah tersedia. Buat atau tambahkan file secara bertahap sesuai kebutuhan implementasi dan kesepakatan tim. Pertahankan struktur aktual repositori jika terdapat perbedaan yang telah disepakati.

---

## 📖 Penjelasan Fungsi Folder

### 1. `public/`

Menyimpan aset statis yang dapat diakses langsung oleh browser, seperti logo AIRA, ikon, ilustrasi, dan gambar pendukung.

Contoh:

```text
public/
├── images/
├── icons/
└── logo.svg
```

Contoh di atas bersifat opsional. Gunakan struktur aset yang sudah ada apabila tim telah menetapkannya.

### 2. `app/`

Mengelola halaman, URL, layout, dan CSS global dengan Next.js App Router.

Setiap folder rute yang memiliki `page.js` dapat merepresentasikan halaman website. Sebagai contoh:

- `app/page.js` — halaman utama.
- `app/kalkulator-air/page.js` — form kalkulator.
- `app/kalkulator-air/hasil/page.js` — hasil perhitungan.
- `app/navigasi-air/page.js` — daftar titik air.
- `app/navigasi-air/[id]/page.js` — detail titik air berdasarkan ID.
- `app/assistant/page.js` — AIRA Assistant.
- `app/dashboard/page.js` — dashboard pengguna.
- `app/admin/page.js` — dashboard admin.

File `layout.js` mengatur layout bersama, sedangkan `globals.css` mengatur gaya global dan tema desain.

Folder `app/font/` dapat digunakan untuk menyimpan font lokal apabila memang sesuai dengan konfigurasi proyek.

### 3. `components/`

Menyimpan komponen UI yang digunakan ulang agar tampilan konsisten dan kode lebih mudah dirawat.

Contoh komponen:
- `Navbar.jsx` — navigasi website, dengan tampilan yang menyesuaikan status login jika diperlukan.
- `Footer.jsx` — bagian bawah halaman.
- `components/ui/` — komponen dasar seperti Button, Card, Badge, dan Input dari shadcn/ui.
- `RoundChart.jsx` — grafik lingkaran jika diperlukan pada dashboard.
- `LineChart.jsx` — grafik garis jika diperlukan untuk menampilkan perubahan kondisi air.

Komponen sebaiknya dibuat reusable apabila digunakan di beberapa halaman. Komponen khusus satu halaman tidak harus dipisahkan apabila justru membuat struktur terlalu rumit.

### 4. `data/`

Menyimpan data statis atau data simulasi yang digunakan selama pengembangan dan pengujian.

Contoh:
- `titikAir.json` — data contoh titik air.
- `riwayatKalkulator.json` — data contoh riwayat perhitungan.

Data contoh harus diberi penanda yang jelas. Jangan menyatakan bahwa titik air benar-benar tersedia, aman digunakan, atau sudah diverifikasi apabila informasinya belum didukung oleh sumber yang dapat dipertanggungjawabkan.

Jika aplikasi sudah menggunakan backend atau database, tentukan bersama tim apakah data perlu dipindahkan atau diambil melalui layanan API.

### 5. `lib/`

Menyimpan fungsi utilitas umum yang dapat digunakan oleh bagian aplikasi lain.

Contohnya adalah `utils.js`, yang dapat berisi fungsi `cn()` untuk menggabungkan class CSS saat menggunakan shadcn/ui.

Folder ini digunakan untuk fungsi pendukung yang tidak secara khusus menjadi tanggung jawab satu halaman atau satu layanan.

### 6. `services/`

Menyimpan logika layanan dan fungsi komunikasi dengan sumber data atau layanan eksternal.

- `aiService.js` — mengatur komunikasi dengan layanan AI untuk AIRA Assistant apabila integrasi telah tersedia.
- `calculatorService.js` — mengelola rumus dan proses perhitungan ketahanan air.
- `api.js` — menyediakan helper untuk mengambil atau mengirim data melalui API jika diperlukan.

Pisahkan logika perhitungan dari tampilan antarmuka agar lebih mudah diuji. Hasil kalkulator sebaiknya berasal dari aturan perhitungan yang konsisten; AIRA Assistant tidak boleh mengganti status hasil perhitungan secara bebas.

### 7. `components.json`

File konfigurasi shadcn/ui yang digunakan untuk menentukan pengaturan komponen, alias direktori, dan konfigurasi terkait.

### 8. `package.json`

Mencatat dependensi, informasi proyek, serta scripts yang digunakan untuk menjalankan dan mengembangkan aplikasi, misalnya `dev`, `build`, dan `start`.

---

## 🔄 Gambaran Alur Fitur AIRA

### A. Alur Kalkulator Ketahanan Air

```text
Pengguna membuka Kalkulator Air
             |
             v
Mengisi data cadangan air dan kebutuhan rumah tangga
             |
             v
Sistem memvalidasi input dan menghitung estimasi ketahanan air
             |
             v
Menampilkan hasil dan status kondisi air
             |
             v
Menampilkan rekomendasi tindakan
             |
             v
Jika diperlukan, pengguna membuka Navigasi Air
atau menggunakan AIRA Assistant
```

### B. Alur Navigasi Air

```text
Pengguna membuka Navigasi Air
             |
             v
Mencari atau memfilter daftar titik air
             |
             v
Membuka detail titik air
             |
             v
Memeriksa informasi lokasi dan status data
             |
             v
Membuka petunjuk arah melalui Google Maps
jika lokasi tersedia
```

Navigasi Air pada MVP menggunakan daftar dan halaman detail, bukan peta interaktif dengan marker di dalam website.

### C. Alur Kontribusi Titik Air

```text
Pengguna mengirim kontribusi titik air
             |
             v
Kontribusi masuk ke antrean verifikasi admin
             |
             v
Admin memeriksa informasi yang dikirim
             |
             v
Admin menentukan status verifikasi
             |
             v
Data yang terverifikasi dapat dikelola
dan ditampilkan sesuai aturan publikasi
```

---

## 🔐 Akses Pengguna

| Area | Akses | Fungsi Utama |
|---|---|---|
| Halaman publik | Tanpa login | Mengakses kalkulator, Navigasi Air, dan AIRA Assistant |
| Dashboard User | Memerlukan login | Mengakses riwayat, data keluarga, monitoring, kontribusi, dan pengaturan akun |
| Dashboard Admin | Akses khusus admin | Memverifikasi kontribusi serta mengelola data titik air |

Pembatasan akses tidak cukup hanya dengan menyembunyikan halaman atau menu. Jika backend dan autentikasi sudah diterapkan, izin akses perlu diperiksa pada sisi server atau layanan yang menangani data.

---

## 🧭 Pedoman Pengembangan Tim

1. **Ikuti struktur proyek yang disepakati.** Hindari membuat folder routing duplikat, seperti `src/app/` apabila proyek menggunakan `app/` di root.
2. **Gunakan komponen bersama.** Periksa folder `components/` sebelum membuat komponen baru dengan fungsi serupa.
3. **Konsisten dengan desain Figma.** Gunakan token warna, tipografi, dan komponen desain yang telah disepakati.
4. **Pisahkan tanggung jawab kode.** Halaman berada di `app/`, komponen UI di `components/`, data statis di `data/`, utilitas di `lib/`, dan logika layanan di `services/`.
5. **Jaga konsistensi hasil kalkulator.** Validasi input sebelum menghitung dan jangan memberikan status aman ketika data belum mencukupi.
6. **Jaga keakuratan informasi titik air.** Bedakan status verifikasi dari ketersediaan terkini dan kelayakan air untuk diminum.
7. **Lindungi data pengguna.** Kumpulkan data yang diperlukan saja dan batasi akses berdasarkan peran pengguna.
8. **Koordinasikan perubahan.** Sebelum mengubah struktur utama atau file yang dikerjakan anggota lain, komunikasikan melalui tim dan ikuti alur branch serta pull request yang disepakati.

---

## 📌 Status Pengembangan

AIRA dikembangkan secara bertahap sesuai ruang lingkup Minimum Viable Product (MVP). Struktur folder ini menjadi panduan untuk membantu anggota tim memahami penempatan halaman, komponen UI, data, dan logika layanan.

Implementasi integrasi AI, API, database, autentikasi, dan sumber data titik air dilakukan sesuai ketersediaan layanan serta keputusan teknis tim. Keberadaan nama file dalam dokumentasi tidak berarti integrasi tersebut sudah aktif.

