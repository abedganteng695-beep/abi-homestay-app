# Perbaikan Layout Modal Bottom Sheet pada Tampilan Desktop

## 1. Identifikasi Masalah Utama
Pada tampilan Desktop (lebar > 768px), modal **Catat Pembayaran** di `app/laporan/page.tsx` terhimpit secara vertikal menjadi strip sangat sempit di tengah layar (seperti terlihat pada screenshot user).

### Akar Penyebab:
1. `app/laporan/page.tsx` membungkus backdrop dan modal dalam elemen parent bersama `<div className="fixed inset-0 z-50 flex flex-col justify-end">`.
2. Pada mode desktop, flexbox column tanpa `align-items: center` / `w-full` menyebabkan modal div dengan `md:max-w-lg` mengalami *width collapse* (menciut ke lebar minimum elemen anak).

---

## 2. Solusi Teknis Perbaikan

1. **Pemisahan Backdrop & Modal Container**:
   - Pisahkan elemen backdrop `<div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[60]" onClick={closeModal}></div>` secara independen di luar container modal.
2. **Standardisasi Modal Container Desktop**:
   - Gunakan formula class modal standar yang telah teruji di `app/kamar/page.tsx`:
     ```html
     className="fixed bottom-0 left-0 w-full bg-surface rounded-t-3xl z-[70] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] md:w-[500px] md:left-1/2 md:-translate-x-1/2 md:bottom-6 md:rounded-3xl max-h-[85vh] flex flex-col animate-slide-up overflow-hidden"
     ```
3. **Penerapan Seragam pada Semua Halaman**:
   - Terapkan struktur modal yang presisi ini pada seluruh modal di `laporan`, `penghuni`, dan `pengaturan`.

---

## 3. Analisis Dampak (Impact Analysis)
- **Fungsi Bisnis**: 0% Dampak. Form submission & Server Actions tetap berfungsi normal.
- **Tampilan Visual**:
  - Pada Mobile: Tampil sebagai Bottom Sheet rounded yang pas di bagian bawah layar.
  - Pada Desktop: Tampil sebagai Floating Card dialog modal dengan lebar 500px yang terpusat secara presisi di tengah layar (`md:left-1/2 md:-translate-x-1/2 md:bottom-6`).
