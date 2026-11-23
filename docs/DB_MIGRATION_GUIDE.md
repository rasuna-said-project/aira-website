# Database Migration Guide AIRA

Dokumen ini menjelaskan perubahan database yang menjadi bagian dari penyelarasan backend AIRA, termasuk fungsi RPC terkait asesmen dan proses review kontribusi titik air. Migration perlu dipahami bersama schema database yang digunakan aplikasi.

## Ruang Lingkup Migration

Migration yang dirujuk dalam dokumentasi ini mencakup:

- `delete_my_water_assessment(bigint)`: fungsi untuk menghapus asesmen milik pengguna yang sedang login beserta `assessment_recommendations` dan `assistant_interactions` yang secara langsung terkait dengan asesmen tersebut. Proses dilakukan dalam satu transaksi dan menggunakan pemeriksaan kepemilikan.
- Overload empat argumen `review_water_point_contribution`: wrapper yang menerima status ketersediaan final pilihan admin dan meneruskannya ke fungsi review tiga argumen yang telah tersedia.

Migration ini tidak mengubah mekanisme penghapusan household, akun pengguna, guide, ataupun water point. Pengelolaan penghapusan titik air oleh admin merupakan bagian dari implementasi aplikasi tersendiri.

## Pemeriksaan Schema Sebelum Migration

Pemeriksaan berikut digunakan untuk melihat keberadaan tabel, kolom, dan fungsi yang menjadi dependensi migration.

```sql
select to_regclass('public.water_assessments') as assessments,
       to_regclass('public.assessment_recommendations') as recommendations,
       to_regclass('public.assistant_interactions') as assistant_interactions,
       to_regclass('public.water_point_contributions') as contributions,
       to_regclass('public.water_points') as water_points;

select table_name, column_name, data_type, is_nullable
from information_schema.columns
where table_schema='public'
 and table_name in ('water_assessments','assessment_recommendations',
                    'assistant_interactions','water_point_contributions','water_points')
order by table_name, ordinal_position;

select p.proname, pg_get_function_identity_arguments(p.oid) as arguments,
       p.prosecdef as security_definer
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public'
 and p.proname in ('delete_my_water_assessment','review_water_point_contribution',
                   'is_aira_admin','match_document_chunks');
```

## Pelaksanaan Migration

Perubahan database dirujuk pada SQL migration `database/AIRA_BACKEND_ALIGNMENT.sql`. Sebelum diterapkan pada database yang digunakan aplikasi, perubahan ditinjau terhadap schema aktual dan backup atau recovery point yang tersedia. Pengujian pada environment staging/preview membantu memastikan dependensi dan perilaku RPC sesuai dengan aplikasi.

## Verifikasi Setelah Migration

```sql
select p.proname, pg_get_function_identity_arguments(p.oid) as arguments,
       p.prosecdef as security_definer
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public'
 and p.proname in ('delete_my_water_assessment','review_water_point_contribution');
```

Verifikasi dilengkapi dengan pengujian aplikasi untuk memastikan:

- Pengguna hanya dapat menghapus asesmen miliknya.
- Penghapusan asesmen menghapus dependensi langsung yang ditentukan oleh RPC, tanpa menghapus household.
- Review kontribusi oleh admin menerima status review dan pilihan availability yang valid.
- Riwayat review tetap tersedia sesuai mekanisme penyimpanan yang diterapkan.
- Pengelolaan water point oleh admin sesuai implementasi aplikasi; penghapusan pada direktori `water_points` menggunakan hard delete, sementara catatan kontribusi tetap tersimpan pada tabel kontribusi.

## Dependensi dan Kesesuaian Schema

Migration ini merujuk pada struktur yang digunakan backend AIRA, termasuk `assistant_interactions.user_id`, `water_assessments.assessed_by_user_id`, `assessment_recommendations.assessment_id`, `water_point_contributions.proposed_availability_status`, dan `public.is_aira_admin()`.

Fungsi review empat argumen bergantung pada fungsi review tiga argumen yang sudah ada. Kedua fungsi tersebut merupakan bagian dari rangkaian proses review kontribusi.

## Catatan Penerapan

SQL migration, schema live, dan implementasi backend perlu berada dalam kondisi selaras. Perbedaan struktur atau signature function dapat memengaruhi hasil migration dan operasi aplikasi. Pengujian API dan alur aplikasi setelah penerapan menjadi bagian dari verifikasi perubahan database.
