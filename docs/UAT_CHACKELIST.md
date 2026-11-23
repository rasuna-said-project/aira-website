# AIRA — Checklist Pengujian (UAT dan Teknis)

Dokumen ini digunakan untuk mencatat skenario pengujian fitur AIRA dan pemeriksaan teknis yang perlu dilakukan. Checklist ini bukan bukti bahwa seluruh skenario telah dijalankan. Status setiap skenario perlu diperbarui berdasarkan hasil pengujian dan bukti yang tersedia.

## 1. Fitur utama

| ID | Fitur | Skenario | Kriteria penerimaan | Hasil |
|---|---|---|---|---|
| UAT-01 | Kalkulator Ketahanan Air | Mengisi data rumah tangga dan menjalankan kalkulasi | Pengguna dapat mengisi input dan memperoleh hasil kalkulasi yang dapat dipahami | Belum dicatat |
| UAT-02 | Kalkulator Ketahanan Air | Meninjau status kondisi air, estimasi, dan rekomendasi | Informasi hasil disajikan dengan jelas; rekomendasi sesuai hasil perhitungan | Belum dicatat |
| UAT-03 | Kalkulator Ketahanan Air | Menggunakan kalkulator ketika data estimasi wilayah tidak tersedia atau layanan gagal | Sistem menyampaikan keterbatasan data dengan jelas dan tidak menggunakan data wilayah lain sebagai pengganti | Belum dicatat |
| UAT-04 | AIRA Assistant | Mengajukan pertanyaan seputar air, sanitasi, dan ketahanan air | Assistant memberikan respons yang relevan dan dapat dipahami | Belum dicatat |
| UAT-05 | AIRA Assistant | Meninjau respons dan sumber informasi yang ditampilkan (jika tersedia) | Respons dan sumber ditampilkan secara konsisten; batasan informasi dapat dipahami | Belum dicatat |
| UAT-06 | AIRA Assistant | Menghadapi retrieval atau layanan AI yang gagal | Sistem menampilkan penanganan kegagalan yang sesuai dan tidak menyampaikan sumber seolah-olah berhasil diperoleh | Belum dicatat |
| UAT-07 | Navigasi Air | Mencari dan memfilter titik air | Pengguna dapat menemukan titik air melalui fungsi pencarian/filter yang tersedia | Belum dicatat |
| UAT-08 | Navigasi Air | Membuka detail titik air dan tautan peta | Informasi detail dan tautan lokasi ditampilkan dengan benar | Belum dicatat |
| UAT-09 | Navigasi Air | Meninjau status, keterangan, dan informasi titik air | Informasi status dan keterbatasan data disampaikan dengan jelas | Belum dicatat |
| UAT-10 | Lintas fitur | Meninjau manfaat dan kemudahan penggunaan website secara keseluruhan | Fitur utama dapat dipahami dan dinilai relevan oleh pengguna | Belum dicatat |

## 2. Autentikasi, akun, dan rumah tangga

| ID | Skenario | Kriteria penerimaan | Hasil |
|---|---|---|---|
| TEST-01 | Mengakses endpoint privat tanpa sesi, sebagai user, dan sebagai admin | Akses tanpa sesi dan akses user ke endpoint admin ditolak; admin yang berwenang dapat mengakses | Belum dicatat |
| TEST-02 | User membaca dan memperbarui data rumah tangganya sendiri | Data milik user dapat diakses dan diperbarui sesuai aturan | Belum dicatat |
| TEST-03 | User mencoba mengakses atau mengubah rumah tangga milik user lain | Akses lintas pengguna ditolak | Belum dicatat |
| TEST-04 | Mengirim input rumah tangga yang tidak valid | Validasi menolak input yang tidak sesuai aturan, termasuk nilai wajib, batas jumlah anggota, kapasitas, dan pilihan sumber air | Belum dicatat |
| TEST-05 | Menghapus data rumah tangga | Penghapusan mengikuti aturan relasi dan dependensi yang berlaku; data terkait tidak terhapus atau tertinggal secara tidak semestinya | Belum dicatat |

## 3. Riwayat asesmen

| ID | Skenario | Kriteria penerimaan | Hasil |
|---|---|---|---|
| TEST-06 | User membaca, memperbarui, dan menghapus asesmen miliknya | Operasi hanya berlaku pada asesmen milik pengguna yang terautentikasi | Belum dicatat |
| TEST-07 | Memperbarui catatan asesmen | Hanya field catatan yang diizinkan dapat diubah; nilai kalkulasi dan snapshot input tetap | Belum dicatat |
| TEST-08 | Menghapus asesmen yang memiliki rekomendasi atau interaksi Assistant terkait | Asesmen dan data turunan yang ditetapkan untuk ikut dihapus terhapus secara konsisten melalui mekanisme penghapusan yang tersedia | Belum dicatat |
| TEST-09 | Mencoba menghapus asesmen milik pengguna lain | Penghapusan ditolak dan data tetap terjaga | Belum dicatat |

## 4. Kontribusi dan verifikasi titik air

| ID | Skenario | Kriteria penerimaan | Hasil |
|---|---|---|---|
| TEST-10 | User mengirim kontribusi titik air | Kontribusi tersimpan dengan identitas pengirim dan data yang dikirim | Belum dicatat |
| TEST-11 | Memeriksa identitas pengirim kontribusi | Identitas kontribusi sesuai pengguna yang mengirim; nama profil ditampilkan dari sumber data yang semestinya | Belum dicatat |
| TEST-12 | Mengirim data pengelola dan nomor HP | Data pengelola tersimpan sesuai validasi; nomor kontak yang tidak valid tidak digunakan sebagai kontak | Belum dicatat |
| TEST-13 | Mengirim URL Google Maps atau koordinat | URL/koordinat diproses sesuai validasi; koordinat tidak valid ditolak | Belum dicatat |
| TEST-14 | Admin approve, reject, atau meminta revisi | Status kontribusi, hasil review, dan histori review sesuai keputusan admin | Belum dicatat |
| TEST-15 | User memperbaiki kontribusi berstatus needs_revision dan mengirim ulang | Data perbaikan tersimpan; status dan identitas kontribusi mengikuti alur pengiriman ulang | Belum dicatat |
| TEST-16 | User membatalkan kontribusi pending atau mencoba menghapus kontribusi yang sudah direview | Operasi mengikuti aturan status dan histori review yang berlaku | Belum dicatat |
| TEST-17 | User mencoba mempublikasikan atau mengubah status kontribusi sendiri menjadi approved | User tidak dapat melewati proses verifikasi admin | Belum dicatat |
| TEST-18 | Meninjau titik air yang telah disetujui | Titik air tampil di publik hanya jika memenuhi kriteria publikasi dan status yang berlaku | Belum dicatat |

## 5. Admin — pengelolaan titik air

| ID | Skenario | Kriteria penerimaan | Hasil |
|---|---|---|---|
| TEST-19 | Admin membuka daftar titik air | Daftar dapat diakses oleh admin berwenang dan mendukung pagination jika tersedia | Belum dicatat |
| TEST-20 | Admin menggunakan filter daftar titik air | Filter yang tersedia menghasilkan daftar sesuai parameter | Belum dicatat |
| TEST-21 | Admin menambahkan titik air dengan payload valid | Data tersimpan dan dipublikasikan sesuai aturan yang berlaku | Belum dicatat |
| TEST-22 | Admin mengirim payload tidak valid | Validasi menolak input dan memberikan respons yang sesuai | Belum dicatat |
| TEST-23 | User non-admin atau pengguna tanpa sesi mengakses endpoint admin | Akses ditolak sesuai status autentikasi dan otorisasi | Belum dicatat |
| TEST-24 | Admin membuka detail dan memperbarui titik air | Detail sesuai record; perubahan hanya pada field yang diizinkan dan tersimpan | Belum dicatat |
| TEST-25 | Admin menghapus titik air uji | Record titik air terhapus dari tabel `water_points`; histori kontribusi terkait tetap dipertahankan dan referensi `water_point_id` mengikuti aturan FK (misalnya menjadi NULL) | Belum dicatat |
| TEST-26 | Memeriksa daftar publik setelah penghapusan | Titik yang dihapus tidak lagi tersedia pada daftar publik | Belum dicatat |
| TEST-27 | Memeriksa respons ketika proses penghapusan gagal | UI tetap menampilkan record jika penghapusan gagal dan memberikan pesan yang sesuai | Belum dicatat |

## 6. Navigasi Air — integritas data dan publikasi

| ID | Skenario | Kriteria penerimaan | Hasil |
|---|---|---|---|
| TEST-28 | Membandingkan daftar publik bagi pengunjung anonim dan user login | Kedua jenis pengguna memperoleh daftar titik yang memenuhi kriteria publikasi | Belum dicatat |
| TEST-29 | Memeriksa titik simulasi dan kontribusi pending | Data simulasi dan kontribusi pending tidak dipublikasikan sebagai titik terverifikasi | Belum dicatat |
| TEST-30 | Admin meninjau kontribusi new-point | Review mencakup pemeriksaan informasi, sumber/bukti, lokasi, akses, dan ketersediaan sesuai kebutuhan | Belum dicatat |
| TEST-31 | Admin menyetujui kontribusi new-point | Kontribusi terhubung dengan titik air yang dibuat dan memenuhi kriteria publikasi | Belum dicatat |
| TEST-32 | Admin menyetujui kontribusi update-point | Perubahan diterapkan pada titik air yang dituju dan tidak membuat record duplikat | Belum dicatat |
| TEST-33 | Memeriksa overview admin dan status kontribusi | Informasi yang ditampilkan berasal dari data aktual, bukan data simulasi UI | Belum dicatat |
| TEST-34 | User non-admin mengakses endpoint overview admin | Akses ditolak | Belum dicatat |

## 7. Kalkulator — estimasi data wilayah

| ID | Skenario | Kriteria penerimaan | Hasil |
|---|---|---|---|
| TEST-35 | Menguji wilayah yang tersedia pada sumber estimasi | Data estimasi ditampilkan sesuai lokasi yang dipilih | Belum dicatat |
| TEST-36 | Menguji wilayah yang tidak tersedia atau API gagal | Kalkulator tetap menangani kondisi tersebut; status estimasi dijelaskan dan data wilayah lain tidak digunakan sebagai pengganti | Belum dicatat |

## 8. AIRA Assistant — penanganan kegagalan

| ID | Skenario | Kriteria penerimaan | Hasil |
|---|---|---|---|
| TEST-37 | Menguji retrieval normal dan retrieval gagal | Respons mengikuti hasil retrieval; kegagalan tidak disamarkan sebagai hasil retrieval yang berhasil | Belum dicatat |
| TEST-38 | Menguji kegagalan atau timeout layanan AI | Sistem memberikan fallback atau respons error yang sesuai | Belum dicatat |
| TEST-39 | Meninjau relevansi jawaban, sumber, dan batasan AI | Jawaban tidak mengklaim dukungan sumber yang tidak tersedia; keterbatasan disampaikan dengan tepat | Belum dicatat |

## 9. API, Swagger, dan database

| ID | Skenario | Kriteria penerimaan | Hasil |
|---|---|---|---|
| TEST-40 | Memeriksa dokumentasi OpenAPI pada `/api/openapi` | Endpoint yang didokumentasikan sesuai dengan implementasi yang tersedia | Belum dicatat |
| TEST-41 | Memeriksa request, parameter, response, error, dan autentikasi API | Dokumentasi API konsisten dengan implementasi aktual | Belum dicatat |
| TEST-42 | Menguji endpoint privat melalui Swagger UI setelah login | Pengujian dilakukan pada sesi dan origin yang sesuai; hasil sesuai otorisasi | Belum dicatat |
| TEST-43 | Menguji RLS dengan user A, user B, admin, dan akses anonim | Akses data dan mutasi dibatasi sesuai kebijakan yang berlaku | Belum dicatat |
| TEST-44 | Menguji akses langsung melalui Supabase client/API, bukan hanya UI | Akses lintas pengguna dan mutasi tanpa izin ditolak sesuai kebijakan | Belum dicatat |
| TEST-45 | Memeriksa fungsi dan relasi database yang mendukung proses backend | Fungsi, relasi, dan aturan FK sesuai implementasi serta dokumentasi | Belum dicatat |

## 10. Build dan pemeriksaan kode

| ID | Pemeriksaan | Kriteria penerimaan | Hasil |
|---|---|---|---|
| TEST-46 | `npm ci` atau instalasi dependency sesuai lockfile | Dependency terpasang tanpa error | Belum dicatat |
| TEST-47 | `npm test` | Test suite selesai; hasil dan kegagalan dicatat | Belum dicatat |
| TEST-48 | `npm run lint` | Lint selesai tanpa error | Belum dicatat |
| TEST-49 | `npm run build` | Build selesai tanpa error | Belum dicatat |

## 11. Pencatatan bukti

Catat hasil aktual untuk setiap skenario yang dijalankan. Skenario yang belum diuji tidak boleh ditandai Pass.

| ID skenario | Tanggal | Tester (kode) | Environment/versi | Hasil (Pass/Fail/Blocked/Not tested) | Bukti/catatan | Tindak lanjut |
|---|---|---|---|---|---|---|
| [ID] | [tanggal] | [P-xx] | [Preview/Production/local] | [status] | [referensi bukti] | [tindak lanjut] |

Bukti yang dapat dicatat:
- URL dan versi environment yang diuji.
- Akun uji berdasarkan role (tanpa password, token, atau credential).
- Request/response API yang telah disamarkan.
- ID record uji untuk penelusuran.
- Screenshot atau catatan pengujian yang relevan.

## 12. Catatan pelaksanaan

- Checklist ini merupakan kumpulan skenario pengujian; status harus diisi berdasarkan pengujian aktual.
- Pengujian RLS dan otorisasi perlu dilakukan melalui akses langsung yang sesuai, bukan hanya berdasarkan menu atau tampilan UI.
- Gunakan data uji dan hindari pengujian destruktif pada data produksi tanpa persetujuan serta langkah mitigasi yang memadai.
- Penghapusan titik air pada implementasi saat ini bersifat hard delete terhadap record `water_points`. Histori kontribusi tetap dipertahankan; referensi titik air pada histori mengikuti aturan foreign key.
- Penghapusan asesmen menggunakan mekanisme yang memeriksa kepemilikan dan menghapus data turunan yang ditetapkan dalam mekanisme tersebut. Verifikasi hasil berdasarkan implementasi aktual.
