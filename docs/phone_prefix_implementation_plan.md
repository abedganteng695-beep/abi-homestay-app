# Analisis dan Rencana Implementasi Prefix Nomor HP (+62)

## 1. Latar Belakang & Analisis Permintaan
Pengguna meminta penambahan prefix `+62` di depan input **Nomor HP** pada form **Tambah Penghuni Baru** (`app/penghuni/page.tsx`), sehingga pengguna hanya perlu memasukkan nomor lanjutan setelah kode negara `+62`.

## 2. Analisis Kritis & Masalah Potensial (Critical Issues)
Sebelum melakukan perubahan kode, berikut adalah hasil analisis komprehensif terhadap dampak sistem secara keseluruhan:

### A. Masalah Input Pengguna (Leading Zero & Format Formatting)
- Jika pengguna mengetik atau menempelkan (paste) nomor yang diawali dengan `0` (misal: `0812-3456-7890` atau `081234567890`) ke dalam kolom input sementara prefix `+62` sudah terpampang, nomor dapat berisiko tersimpan menjadi `+62081234567890` yang mana merupakan format tidak valid.
- **Solusi**:
  1. Melakukan pembersihan otomatis (*auto-sanitize/strip*) pada `onChange` atau saat submit: menghapus awalan `0`, `+62`, atau `62` dari string yang diinputkan pengguna.
  2. Hanya memperbolehkan karakter angka (dan pemisah strip bila diinginkan) di kolom input.

### B. Format Penyimpanan Data pada Database & WhatsApp Integration
- Saat ini tombol "Hubungi via WhatsApp" menggunakan format:
  `https://wa.me/${selectedTenant.phone.replace(/[^0-9]/g, "")}`
- Jika nomor tersimpan sebagai `+6281234567890` atau `6281234567890`, hasil `replace(/[^0-9]/g, "")` menjadi `6281234567890`, yang secara langsung valid untuk URL `wa.me/6281234567890`.
- Jika tersimpan sebagai `081234567890`, URL `wa.me/081234567890` memerlukan konversi awalan `0` menjadi `62`.
- **Keputusan Format Penyimpanan**:
  - Menyimpan format standar yang rapi, contoh: `+62 812-3456-7890` atau `0812-3456-7890` / `+6281234567890`.
  - Memastikan parser WhatsApp dapat menangani baik data lama (`08...`) maupun data baru (`+62...`).

### C. Dampak Fitur Pencarian (Search Filter)
- Fungsi `getTenants(search, filter)` di `app/actions.ts` melakukan pencarian partial match:
  `{ phone: { contains: search, mode: "insensitive" } }`
- Jika nomor disimpan dengan format `+62 812...`, pengguna yang mencari "0812" harus tetap dapat menemukan data atau pencarian menyesuaikan digit nomor.

### D. Desain UI Input Prefix
- Menggunakan komponen input group modern dengan badge prefix `+62` yang terintegrasi (dengan bendera Indonesia 🇮🇩 atau ikon telepon) di sisi kiri input, menyatu dalam container input dengan warna dan border yang harmonis sesuai tema Material 3 / Tailwind CSS yang ada.

## 3. Komponen dan Kode yang Terdampak
1. `app/penghuni/page.tsx`
   - Form input `Nomor HP` pada modal `Tambah Penghuni Baru`.
   - Handler `handleAddSubmit` dan sanitasi state `newPhone`.
   - Kompatibilitas link WhatsApp pada detail profil penghuni.
2. `components/HomeDashboardClient.tsx`
   - Link WhatsApp pada daftar jatuh tempo (jika ada sanitasi nomor).
3. `app/actions.ts`
   - Fungsi `addTenant` (memastikan nomor HP yang diterima ter-format dengan benar).

## 4. Opsi Rancangan Implementasi
- **Opsi 1 (Disarankan)**: Visual Prefix Input Group `+62` dengan auto-strip leading zero `0`.
  - User melihat badge fixed `+62` di sebelah kiri input.
  - User mengetik `81234567890`.
  - Jika user mengetik/paste `0812...`, sistem otomatis memotong `0` awal sehingga menjadi `812...`.
  - Data yang dikirim ke backend dan disimpan adalah `+62 812-xxxx-xxxx` (atau `+62812xxxxxxx`).
  - WhatsApp helper disesuaikan agar selalu menghasilkan format `628xxxxxxxx`.

- **Opsi 2**: Visual Prefix Input Group `+62`, namun di simpan di DB sebagai `08...`.
- **Opsi 3**: Freeform text input dengan mask.

---
*Dokumen ini dibuat secara otomatis untuk merekam pengetahuan dan rencana perubahan.*
