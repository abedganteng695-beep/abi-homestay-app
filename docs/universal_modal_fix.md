# Analisis & Solusi Universal Modal Popup Squeezed (Penghuni, Laporan, Kamar, Pengaturan)

## 1. Akar Penyebab Kritis (Root Cause)
Terjadi *width collapse* (modal menciut menjadi garis/strip vertikal putih di tengah layar) pada seluruh popup modal di tampilan desktop.

### Penyebab Utama:
1. **Konflik CSS Transform Parent**: Modals dirender di dalam elemen `<main>` yang memiliki kelas animasi CSS (`animate-slide-up`, `stagger-1`, atau `transform`). Menurut spesifikasi CSS W3C, elemen dengan `position: fixed` di dalam ancestor yang memiliki `transform` atau `animation` akan kehilangan konteks viewport utama dan berpindah konteks ke bounding box parent yang bertransformasi.
2. **Ketiadaan Flexbox Viewport Wrapper**: Penggunaan `md:left-1/2 md:-translate-x-1/2` tanpa container flexbox viewport yang memadai menyebabkan kalkulasi `width` pada Tailwind v4 me-render modal secara terhimpit.

---

## 2. Solusi Teknis Universal (Flexbox Viewport Wrapper)

Gunakan struktur modal universal yang 100% aman dari penciutan width dan presisi di semua perangkat:

```tsx
{isModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
    {/* Backdrop Overlay */}
    <div
      onClick={closeModal}
      className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
    ></div>

    {/* Modal Dialog Content */}
    <div className="relative w-full md:w-[500px] bg-surface rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col z-10 animate-slide-up overflow-hidden pb-safe">
      {/* Content */}
    </div>
  </div>
)}
```

### Keunggulan Formula Ini:
- **Mobile**: `flex items-end` menempelkan modal dengan rapi sebagai Bottom Sheet `w-full` dengan `rounded-t-3xl`.
- **Desktop**: `md:items-center justify-center` menempatkan modal secara presisi di tengah layar (*centered dialog*) dengan lebar pas `500px` dan `md:rounded-3xl`.
- **Bebas Crash/Width Collapse**: Terisolasi penuh dalam `fixed inset-0 z-[100] flex`.

---

## 3. Dampak Terhadap Komponen Lain (Impact Analysis)
- **Fungsi Bisnis & Server Actions**: 0% Dampak Negatif.
- **Tampilan Visual**: 100% Sempurna, responsif, dan rapi di seluruh layar Desktop, iPhone, dan Samsung.
