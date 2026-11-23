# AIRA — Audit Skema Database

Dokumen ini merangkum pemeriksaan struktur database AIRA berdasarkan export schema yang tersedia pada 20 November 2026. Pemeriksaan berfokus pada struktur tabel, relasi, constraint yang tercantum dalam export, serta implikasinya terhadap operasi data yang digunakan aplikasi.

Export yang menjadi dasar dokumentasi mencakup definisi tabel, primary key, foreign key, dan sebagian CHECK constraint. Definisi RLS policies, trigger, function/RPC, grants, serta konfigurasi extension tidak tercakup dalam export tersebut. Oleh karena itu, temuan di bawah menggambarkan struktur yang dapat ditinjau dari sumber schema, bukan hasil audit menyeluruh terhadap konfigurasi database live.

## 1. Relasi yang memengaruhi operasi CRUD

| Resource | Relasi yang terlihat | Implikasi terhadap operasi DELETE |
|---|---|---|
| `households` | `household_members`, `water_assessments`, `assistant_interactions` | Penghapusan rumah tangga dibatasi ketika masih terdapat data turunan. Endpoint mengembalikan HTTP 409 apabila dependensi tersebut masih ada. |
| `water_assessments` | `assessment_recommendations`, `assistant_interactions` | Penghapusan assessment dilakukan melalui fungsi database yang memeriksa kepemilikan dan menghapus dependensi assessment yang ditangani fungsi tersebut. |
| `water_point_contributions` | `contribution_reviews`, `water_point_contribution_reviews` | Pembatalan kontribusi dibatasi pada status `pending` yang belum memiliki histori review. Histori review tetap menjadi bagian dari rekam proses kontribusi. |
| `water_points` | `water_point_contributions` | Admin dapat menghapus record titik air secara permanen. Relasi kontribusi mempertahankan histori dengan `water_point_id` menjadi `NULL` melalui FK `ON DELETE SET NULL`; record kontribusi dan review tidak ikut terhapus. |

## 2. Relasi dan integritas schema

### 2.1 Referensi profil pengguna

Export memperlihatkan dua foreign key pada kolom `users.user_id` yang sama, yaitu `users_user_id_fkey` dan `users_user_id_auth_fkey`, keduanya mengarah ke `auth.users(id)`. Kondisi ini tercatat sebagai relasi berulang pada export schema.

### 2.2 Admin activity logs

Kolom `admin_activity_logs.target_user_id` tercatat wajib diisi, sementara export tidak menampilkan foreign key untuk kolom tersebut. Dengan struktur yang terlihat, pencatatan aktivitas yang tidak memiliki target pengguna memerlukan nilai target atau penyesuaian struktur tabel.

### 2.3 Tabel histori review kontribusi

Schema mencantumkan `contribution_reviews` dan `water_point_contribution_reviews`. Dalam implementasi yang dirujuk dokumentasi aplikasi, `water_point_contribution_reviews` digunakan sebagai histori review aktif, sedangkan `contribution_reviews` merupakan tabel legacy. Perbedaan ini menjadi konteks penting saat membaca relasi maupun histori kontribusi.

### 2.4 Relasi household dan assessment

Export tidak menunjukkan `ON DELETE CASCADE` pada relasi `household_members` ke household, serta pada relasi assessment, recommendation, dan interaksi yang dirujuk. Implementasi endpoint mengakomodasi integritas tersebut dengan membatasi penghapusan parent ketika dependensi masih ada, atau menggunakan fungsi database khusus untuk penghapusan assessment sesuai dependensi yang ditangani.

## 3. Pengelolaan assessment

Penghapusan assessment pengguna ditangani melalui fungsi database `delete_my_water_assessment(bigint)`. Fungsi tersebut menerapkan pemeriksaan kepemilikan dan menghapus assessment beserta `assessment_recommendations` serta `assistant_interactions` yang langsung terkait, dalam satu transaksi.

Mekanisme ini tidak dimaksudkan untuk menghapus household, profil pengguna, guides, ataupun data water points.

## 4. Pengelolaan water points dan histori kontribusi

Pada fitur Admin Water Point, penghapusan record menggunakan hard delete pada tabel `water_points`. Histori kontribusi tidak ikut dihapus: referensi `water_point_id` pada `water_point_contributions` menjadi `NULL` sesuai relasi `ON DELETE SET NULL`, dan record histori review tetap tersimpan bersama kontribusinya.

Dengan demikian, penghapusan titik air dari direktori tidak menghilangkan rekam kontribusi dan proses review yang sebelumnya terkait dengan titik tersebut.

## 5. Konteks akses dan fungsi database

Export schema yang menjadi dasar audit belum mencakup definisi RLS policies, grants, trigger, maupun body function/RPC. Komponen-komponen tersebut merupakan bagian dari konfigurasi database live yang tidak dapat disimpulkan hanya dari definisi tabel.

Fungsi yang berkaitan dengan alur aplikasi dan menjadi referensi dokumentasi antara lain:

- `is_aira_admin` — pemeriksaan hak akses admin.
- `review_water_point_contribution` — proses review kontribusi oleh admin.
- `match_document_chunks` — retrieval chunk dokumen untuk kebutuhan AIRA Assistant.
- `delete_my_water_assessment` — penghapusan assessment berdasarkan kepemilikan dan dependensi yang ditangani fungsi.

Kebijakan akses database AIRA dirancang untuk membatasi data berdasarkan peran dan kepemilikan, termasuk akses pengguna terhadap data miliknya, akses admin pada fungsi pengelolaan, serta akses backend terhadap proses yang memerlukan privilege khusus. Detail policy, grants, dan implementasi function perlu merujuk pada konfigurasi SQL live untuk mendapatkan gambaran yang lengkap.

## 6. Ringkasan temuan

| Area | Temuan dari sumber yang ditinjau |
|---|---|
| Foreign key profil | Terdapat dua FK pada `users.user_id` yang mengarah ke `auth.users(id)`. |
| Admin activity logs | `target_user_id` tercatat wajib diisi dan tidak menampilkan FK pada export. |
| Histori review | Terdapat tabel review legacy dan tabel histori review yang dirujuk implementasi aktif. |
| Household deletion | Operasi penghapusan dibatasi oleh dependensi data anggota dan data terkait. |
| Assessment deletion | Ditangani melalui RPC ownership-checked dengan penghapusan dependensi langsung dalam transaksi. |
| Water point deletion | Admin menggunakan hard delete; histori kontribusi dipertahankan dan referensi titik air menjadi `NULL`. |
| RLS dan grants | Tidak tercantum pada export schema yang menjadi dasar audit ini. |
| Trigger dan function | Definisi lengkap tidak tercantum pada export; referensi function berasal dari dokumentasi alur aplikasi. |

## 7. Ruang lingkup audit

Dokumen ini merupakan ringkasan audit struktur schema berdasarkan export yang tersedia, bukan perubahan langsung terhadap database Supabase. Temuan terkait relasi dan constraint mengikuti informasi pada export, sedangkan perilaku aplikasi yang disebutkan merujuk pada implementasi backend yang didokumentasikan.

Dokumentasi terkait:

- `DATABASE.md` — struktur dan domain database AIRA.
- `DB_MIGRATION_GUIDE.md` — perubahan database dan fungsi yang terkait dengan pengembangan.
- `aira-core.erd.dbml` — representasi relasi database.
- `API.md` dan `BACKEND_TECHNICAL.md` — implementasi backend yang menggunakan schema database.
