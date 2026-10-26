# PWUTS_A04_25091397020 — NabungSampah (Portal Warga)

**NIM:** 25091397020 · **Kelompok:** A04 · **Peran (Anggota 1):** Warga Perumahan Puri Indah

| File | Item |
|---|---|
| `index.html` | 2.a Portal Layanan Warga: landing page + ringkasan akun warga, responsif (navbar atas, menu hamburger di HP), navigasi Ajax |
| `pages/katalog.html` | 2.b Katalog 3 jenis sampah + kalkulator perbandingan harga kotor vs bersih (jQuery, hasil real-time) |
| `pages/daftar.html` | 2.c Tab Registrasi Warga (`users`) dan Request Penjemputan (`pickup_requests`) dengan validasi jQuery |

## Menjalankan
Gunakan web server (VS Code Live Server atau `python -m http.server`), karena halaman 2.b dan 2.c dimuat dengan Ajax `$.load`. Membuka `index.html` langsung lewat `file://` tidak akan memuat halamannya.

## Validasi
- Registrasi: nama ≥ 3 huruf, format email valid, HP diawali 08 (10–13 digit), alamat ≥ 8 karakter, password ≥ 6 karakter dan konfirmasi harus sama. Role otomatis `warga`.
- Request: harus sudah terdaftar, alamat jemput wajib, minimal 1 jenis sampah, catatan ≤ 200 karakter. Tarif flat Rp2.000 dan status awal "Menunggu".
- Data dikirim lewat `$.ajax` POST ke `api/register.php` dan `api/pickup.php`. Jika backend belum ada, disimpan di `localStorage` (mode demo). Password tidak disimpan di browser.

## Catatan
Harga per kg adalah contoh (bersih lebih mahal dari kotor): Botol 3.000/1.500, Galon 2.500/1.200, Kardus 2.000/1.000. Palet putih dan coklat `#5D4037`, font Segoe UI sesuai design guideline proposal.
