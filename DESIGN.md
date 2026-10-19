# Panduan Tampilan

Ikuti panduan ini setiap kali membuat atau mengubah tampilan, supaya semua halaman terlihat konsisten. Untuk menyesuaikan dengan usahamu, ganti nilai warna di `app/globals.css` (bagian `@theme`) dan isi `lib/toko.js`.

## Warna

| Token | Nilai awal | Dipakai untuk |
| --- | --- | --- |
| `latar` | `#ffffff` | Latar halaman dan kartu |
| `permukaan` | `#f1f5f2` | Latar bagian sekunder, footer, kepala tabel |
| `garis` | `#dde5e0` | Garis tepi dan pemisah |
| `teks` | `#1b2420` | Teks utama |
| `teks-lembut` | `#5b6a62` | Teks pendukung: kategori, keterangan |
| `utama` | `#1f6b4f` | Tombol utama, tautan aktif, nama toko |
| `utama-gelap` | `#154d39` | Tombol utama saat disorot |
| `harga` / `harga-latar` | `#7a4e09` / `#fbefd8` | Label harga |
| `bahaya` | `#b42318` | Aksi hapus dan pesan error |

Pakai sebagai kelas Tailwind, misalnya `bg-utama`, `text-teks-lembut`, `border-garis`. Jangan menulis kode warna langsung di kelas.

## Huruf

- Satu jenis huruf: Plus Jakarta Sans.
- Judul halaman: `text-2xl` sampai `text-5xl`, `font-extrabold`.
- Teks biasa: ukuran bawaan, panjang baris maksimal sekitar 70 karakter (`max-w-prose`).
- Tulisan memakai huruf kecil biasa (sentence case), bukan HURUF BESAR semua.

## Komponen

Gunakan komponen yang sudah ada sebelum membuat yang baru:

| Komponen | Fungsi |
| --- | --- |
| `Tombol` | Tombol dan tautan berbentuk tombol (varian `utama`, `garis`, `bahaya`) |
| `Input` | Kolom isian beserta label, termasuk textarea |
| `KartuProduk` | Kartu di katalog |
| `TabelProduk` | Daftar produk di halaman admin |
| `FormProduk` | Form tambah dan ubah produk |
| `NavAdmin` | Menu di halaman admin |

## Tata letak

- Lebar konten maksimal `max-w-5xl`, rata kiri.
- Katalog: 2 kolom di HP, 3 kolom di layar lebar.
- Selalu cek tampilan di lebar HP (sekitar 390 px).

## Bahasa

- Gunakan bahasa Indonesia yang singkat dan jelas.
- Label tombol menyebut aksinya: "Simpan produk", bukan "Submit".
- Pesan error menjelaskan apa yang salah dan cara memperbaikinya.

## Keputusan Arsitektur Halaman Katalog (US-01)

1. **Skema Warna Modern OKLCH (Navy & Gold)**:
   - Warna tema di `app/globals.css` menggunakan ruang warna OKLCH (`oklch()`) untuk menghadirkan tampilan profesional dan terpercaya.
   - `utama`: Deep Navy (`oklch(0.32 0.09 255)`)
   - `utama-gelap`: Midnight Navy (`oklch(0.24 0.08 255)`)
   - `harga` & `harga-latar`: Refined Gold (`oklch(0.58 0.16 75)` dan `oklch(0.96 0.035 80)`)
   - `permukaan` & `garis`: Clean slate tint (`oklch(0.98 0.008 245)` dan `oklch(0.92 0.012 245)`)

2. **Tipografi Dinamis (CSS `clamp()`)**:
   - Judul utama, heading error, dan teks empty state menggunakan `clamp()` untuk transisi ukuran font yang mulus dan proporsional antara layar ponsel dan desktop.

3. **Komposisi Wrapper & Micro-Interactions**:
   - Wrapper kartu pada grid katalog mengadopsi micro-interaction elevasi halus saat kursor melayang (`transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-md`) tanpa memodifikasi komponen `KartuProduk`.
   - Layout tetap mematuhi aturan 2 kolom di layar HP dan 3 kolom di layar desktop.

4. **Pola Status Kosong & Penanganan Error Humanis**:
   - Status kosong: Menampilkan teks konfirmasi wajib "Belum ada produk" disertai ikon representatif dan penjelasan ramah.
   - Status error: Menguraikan kendala teknis dengan bahasa yang profesional dan memberikan opsi solusi (muat ulang atau hubungi kontak toko).

