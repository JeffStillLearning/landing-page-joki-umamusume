App Summary: Joki Uma Uma Admin
1. Deskripsi Proyek
Aplikasi dashboard admin untuk layanan joki game Uma Musume: Pretty Derby. Proyek ini bertujuan untuk mengelola katalog layanan (paket harga) dan pembaruan event game secara dinamis melalui integrasi database.

2. Tech Stack
Framework: Next.js (App Router).

Database: Supabase (PostgreSQL).

ORM: Drizzle ORM.

Data Fetching & State: TanStack Query (React Query).

Image Management: Cloudinary (untuk penyimpanan gambar event).


3. Struktur Database (Supabase)
Proyek ini menggunakan skema publik dengan tiga tabel utama:

pricing_packages: Menyimpan detail paket joki dan harganya.

game_events: Menyimpan informasi event musiman seperti "New Year's Karuta Showdown".

testimonials: Menyimpan ulasan dari pelanggan.

4. Status Fitur Admin Dashboard
Create Event: Sudah berfungsi untuk mengunggah data baru.

Read Data: Menampilkan kartu event dengan harga dan status aktif.

Edit & Delete: Dalam tahap implementasi penyambungan ikon pensil dan sampah ke fungsi Supabase SDK.

Auto-Refresh: Menggunakan invalidateQueries untuk memperbarui UI tanpa refresh manual setelah operasi database.

5. Konfigurasi Penting
Supabase URL: https://lekxyziibquosoddrunx.supabase.co.

Lokasi File Utama: app/admin/page.tsx.

RLS (Row Level Security): Perlu dipastikan kebijakan UPDATE dan DELETE sudah aktif agar fitur admin berjalan lancar.