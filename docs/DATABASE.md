# Database AIRA — PostgreSQL Supabase

## 1. Platform dan diagram schema

AIRA menggunakan PostgreSQL melalui Supabase sebagai database aplikasi. Diagram relasi database (ERD) didokumentasikan dalam file `aira-core.erd.dbml` dan referensi diagram yang tercantum pada README. Diagram tersebut menggambarkan struktur domain dan relasi database yang menjadi acuan pengembangan backend.

## 2. Domain dan tabel

| Domain | Tabel | Keterangan |
|---|---|---|
| Authentication | `auth.users`, `public.users` | Supabase Auth dan profil aplikasi; `users.user_id` terkait dengan UUID pengguna Auth |
| Region | `provinces`, `city_regencies`, `districts` | Referensi wilayah administratif |
| Household | `households`, `household_members` | Data rumah tangga dan anggota rumah tangga |
| Assessment | `water_assessments`, `assessment_recommendations`, `guides`, `katalog_tindakan` | Hasil kalkulator, rekomendasi berbasis aturan, dan katalog tindakan |
| Assistant | `assistant_interactions` | Riwayat interaksi Assistant, konteks, dan referensi sumber |
| Water Navigation | `water_points` | Data titik air yang dikelola dan ditampilkan melalui fitur Navigasi Air |
| Contribution | `water_point_contributions` | Usulan titik baru atau perubahan informasi titik air |
| Review/audit | `water_point_contribution_reviews`, `water_point_contribution_review_audits`, `admin_activity_logs` | Histori keputusan review, audit review, dan aktivitas admin |
| RAG | `document_registry`, `document_chunks` | Metadata dokumen knowledge base, chunk konten, dan embedding |
| Staging | `osm_water_point_candidates`, `pusdatin_water_point_candidates` | Kandidat data sumber untuk proses staging dan validasi |

## 3. Primary key, foreign key, dan relasi

ERD mendokumentasikan relasi antar-domain, antara lain:

- Referensi wilayah administratif.
- Profil pengguna dengan Supabase Auth.
- Kepemilikan household dan relasi anggota household.
- Assessment dengan household/pengguna; rekomendasi dengan assessment dan guide; interaksi Assistant dengan pengguna, household, assessment, atau guide sesuai relasi yang tersedia.
- Water point dengan wilayah dan data verifikasi.
- Contribution dengan pengirim, water point yang terkait, serta wilayah.
- Review dengan contribution dan admin; audit review dengan record review dan aktor.
- Document chunks dengan document registry.

Detail foreign key, perilaku `ON DELETE`, constraint, dan tipe data mengikuti schema database. Referensi yang digunakan dalam log aplikasi, seperti activity log, tidak selalu berupa foreign key formal.

## 4. Struktur dan fungsi tabel

### User dan household

`users` menyimpan profil pengguna, email, role (`user` atau `admin`), status akun (`active`, `inactive`, atau `suspend`), serta timestamp terkait. `households` memuat data rumah tangga, lokasi, sumber air, kapasitas atau volume air, MHM, dan luas atap sesuai kebutuhan fitur. `household_members` menyimpan informasi anggota rumah tangga yang digunakan dalam perhitungan kebutuhan air.

### Assessment dan recommendation

`water_assessments` menyimpan hasil kalkulator, kebutuhan air harian, estimasi durasi ketahanan air, status kondisi, mode crisis, snapshot input, dan waktu assessment. `assessment_recommendations` menghubungkan assessment dengan guide opsional serta menyimpan informasi rekomendasi, prioritas, dan status tindakan. `guides` menyimpan konten rekomendasi yang dikelola aplikasi. `katalog_tindakan` menjadi referensi tindakan untuk sistem rekomendasi berbasis aturan.

### Assistant dan knowledge base

`assistant_interactions` menyimpan konteks interaksi Assistant, termasuk pengguna (nullable), household, assessment, guide, pertanyaan, respons, referensi sumber, dan response mode sesuai struktur yang diterapkan.

`document_registry` mengelola metadata dokumen dan status pemrosesan. `document_chunks` menyimpan potongan konten, index chunk, rentang halaman, metadata, checksum, dan vector embedding. Dokumentasi schema menyebut dimensi `vector(768)`; dimensi database perlu konsisten dengan model embedding dan proses retrieval.

### Water points dan kontribusi

`water_points` menyimpan informasi titik air, termasuk availability, status verifikasi, active flag, akses publik, lokasi, kontak, metadata sumber, status simulasi, dan URL peta. Data yang tampil pada Navigasi Air mengikuti kriteria publikasi yang diterapkan backend.

`water_point_contributions` menyimpan usulan titik baru atau perubahan informasi, termasuk data yang diajukan, evidence, status kontribusi, catatan review, sumber submission, dan metadata terkait. Record kontribusi merupakan histori pengajuan, bukan publikasi langsung pada direktori water point.

### Review dan log

`water_point_contribution_reviews` menyimpan histori keputusan review. `water_point_contribution_review_audits` mendokumentasikan perubahan terkait review. `admin_activity_logs` digunakan untuk pencatatan aktivitas admin yang diimplementasikan pada backend.

### Staging

`osm_water_point_candidates` dan `pusdatin_water_point_candidates` menyimpan kandidat data dari sumber untuk proses staging, pemeriksaan, dan validasi sebelum data diproses lebih lanjut. Data staging dibedakan dari direktori publik Navigasi Air.

## 5. Normalisasi dan integritas data

Struktur database memisahkan domain profil, household, assessment, recommendation, water point, contribution/review, dan knowledge base. Pemisahan ini mendukung pengelolaan data sesuai fungsi masing-masing domain.

Integritas data ditentukan oleh primary key, foreign key, UNIQUE, CHECK, NOT NULL, allowed-value constraints, delete behavior, index, dan trigger yang diterapkan pada schema. ERD berfungsi sebagai dokumentasi struktur dan bukan SQL migration yang dapat langsung dieksekusi.

## 6. Row Level Security (RLS) dan akses data

AIRA menggunakan Supabase Auth, pemeriksaan otorisasi pada backend, serta RLS/policy database sebagai lapisan pengendalian akses sesuai konfigurasi yang diterapkan.

Ruang lingkup akses yang dirancang meliputi:

- Data direktori publik dibatasi pada informasi water point yang memenuhi kriteria publikasi.
- Data household, assessment, interaksi, dan kontribusi pengguna dibatasi berdasarkan kepemilikan serta aturan akses aplikasi.
- Operasi admin memerlukan otorisasi admin melalui pemeriksaan server/backend.
- Service role digunakan pada proses backend tepercaya, bukan pada client aplikasi.
- Data profil mengikuti hak akses pengguna dan aturan role.
- Data knowledge base dan chunk retrieval digunakan melalui jalur backend yang sesuai.
- Data audit dan log admin tidak menjadi data yang dapat diubah bebas oleh pengguna biasa.

Verifikasi konfigurasi RLS, policy, dan grants dilakukan berdasarkan schema live dan pengujian akses. ERD saja tidak menunjukkan hasil pengujian kebijakan akses. Tabel internal Supabase pada schema `auth` merupakan bagian dari layanan platform.

## 7. RAG dan vector database

Knowledge base AIRA menggunakan PostgreSQL dan pgvector untuk penyimpanan embedding dan retrieval konten.

- Dimensi embedding yang tercantum pada diagram: 768.
- `document_chunks` menyimpan hubungan dokumen, chunk index, konten, rentang halaman, metadata, checksum, dan embedding.
- Retrieval menggunakan fungsi database seperti `match_document_chunks` sesuai konfigurasi backend.
- Pipeline ingestion mengelola pemrosesan dokumen dan statusnya; checksum digunakan sebagai salah satu metadata identifikasi dokumen.

Dimensi embedding, model, signature RPC, dan index vector perlu selaras antara database dan implementasi retrieval.

## 8. Seed dan data awal

Data referensi wilayah, guides, `katalog_tindakan`, water point yang memenuhi kriteria publikasi, dan dokumen knowledge base merupakan data pendukung fitur aplikasi. Data awal dan proses seed dikelola sesuai kebutuhan environment pengembangan dan deployment.

## 9. Schema audit dan migration

Dokumentasi schema dan perubahan database AIRA meliputi:

- `DB_SCHEMA_AUDIT.md` — dokumentasi pemeriksaan struktur schema dan relasi database.
- `DB_MIGRATION_GUIDE.md` — penjelasan perubahan database yang dirujuk backend, beserta preflight dan verifikasi.
- `aira-core.erd.dbml` — diagram relasi database dalam format DBML.

Migration dan schema live menjadi acuan penerapan perubahan database. Dokumentasi ini menjelaskan struktur dan perubahan yang dirujuk aplikasi, bukan pengganti schema aktual pada Supabase.

## 10. Ringkasan area verifikasi database

| Area | Fokus pemeriksaan |
|---|---|
| Environment | Supabase project yang digunakan aplikasi |
| Schema dan ERD | Kesesuaian tabel, kolom, dan relasi |
| Integritas | PK, FK, ON DELETE, NOT NULL, UNIQUE, CHECK, index |
| RLS | RLS enabled dan policy pada tabel yang relevan |
| Akses | Pengujian anon, user, admin, dan backend service |
| RPC dan trigger | Definisi fungsi, trigger, serta security definer |
| Kepemilikan data | Pengujian akses lintas pengguna |
| Staging | Keterpisahan kandidat data dari direktori publik |
| AI/knowledge base | Akses dokumen, chunk, embedding, dan histori interaksi |
| Seed dan pemulihan | Ketersediaan data awal dan strategi backup/recovery |
