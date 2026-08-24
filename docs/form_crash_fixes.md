# Analisis Penyebab Form Crash & Solusi Kebocoran Runtime Error

## 1. Temuan Akar Penyebab Crash (Root Cause Analysis)

Setelah menganalisis alur data Server Actions (`app/actions.ts`) dan pemrosesan form pada seluruh modul aplikasi (`Penghuni`, `Laporan`, `Pengaturan`, `Kamar`), ditemukan 4 titik kritis pencetus runtime crash:

### A. Crash 1: Update Pricing & Settings saat ID "default" (`app/actions.ts`)
- **Penyebab**: Jika database belum terisi atau terjadi *fallback state*, `getPricingAndSettings()` mengembalikan ID dummy `"default"`. Saat pengguna mengirim form **Master Harga** atau **Auto-WhatsApp**, Server Action memanggil `prisma.pricing.update({ where: { id: "default" } })`.
- **Dampak**: Prisma melempar Fatal Error `P2025: Record to update not found`, yang menghentikan eksekusi Server Action dan membuat UI crash/freeze.

### B. Crash 2: Parsing Nomor Kamar & Null Handling (`addTenant`)
- **Penyebab**: Pemanggilan `formData.get("roomNumber") as string` langsung mengeksekusi `.replace(/[^0-9]/g, "")` tanpa penanganan `null`/`undefined` atau string non-numerik (contoh: "Kamar VIP").
- **Dampak**: Melempar `TypeError: Cannot read properties of null (reading 'replace')` saat form disubmit dengan field kosong atau karakter khusus.

### C. Crash 3: Parsing Nominal Transaksi & Vercel Blob Error Handling (`addTransaction`)
- **Penyebab**: 
  1. `parseFloat("2.500.000")` me-return `2.5` bukannya `2500000`.
  2. Apabila upload file bukti bayar mengalami *network timeout* atau hambatan pada token Vercel Blob, `await put(...)` melempar uncaught error yang menggagalkan transaksi secara keseluruhan.
- **Dampak**: Nilai nominal transaksi corrupt (tercatat Rp 2.5) atau modal transaksi crash saat upload file.

---

## 2. Solusi Teknis Perbaikan (Bulletproof Form Handlers)

1. **Robust Upsert pada Pricing & Setting**:
   Gunakan query `findFirst()` + kondisional `create` / `update` pada `updatePricing` dan `updateSetting` agar tidak pernah bergantung pada ID `"default"`.
2. **Safe Input Parsing pada `addTenant`**:
   Tambahkan fallback string sanitization: `(roomNumberRaw || "").replace(/[^0-9]/g, "")` dengan batas aman default.
3. **Robust Currency Sanitizer & Blob Fallback pada `addTransaction`**:
   Sanitasi nominal `amountRaw.replace(/[^0-9]/g, "")` dan bungkus `put()` Vercel Blob dalam blok `try-catch` dengan fallback pembatalan aman tanpa merusak pencatatan transaksi.
