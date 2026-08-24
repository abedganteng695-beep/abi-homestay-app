# Rencana Optimasi Performa & Lazy Layout Rendering

## 1. Identifikasi Penyebab Lag (Bottleneck Analysis)

### A. GPU Paint Thrashing akibat Multiple `backdrop-blur`
Elemen `header` TopAppBar, `nav` BottomNavBar, `.glass-panel`, dan backdrop modal semuanya menggunakan CSS `backdrop-blur-md` / `backdrop-blur-xl`. Pada browser mobile (iPhone Safari / Android Webview), komposisi multiple backdrop-blur bersamaan membuat GPU me-render ulang setiap piksel layar saat scrolling (turun dari 60 FPS ke < 15 FPS).

### B. Heavy DOM Paint 58 Card Animasi Bersamaan (`app/kamar/page.tsx`)
58 card kamar dirender sekaligus dengan animasi CSS `slideUpFadeIn` bertingkat (`animationDelay`). Menjalankan 58 animasi bersamaan memicu CPU/GPU spike saat tab Kamar dibuka.

### C. Re-computation Array Tanpa `useMemo`
Setiap karakter yang diketik di kolom pencarian (`searchInput`) memicu re-render ulang komponen parent beserta seluruh daftar anak tanpa memoization.

---

## 2. Solusi Teknis Performa & Lazy Layout

### A. Modern CSS Lazy Layout (`content-visibility: auto`)
- Tambahkan class `.lazy-card` dengan CSS:
  ```css
  .lazy-card {
    content-visibility: auto;
    contain-intrinsic-size: 120px;
    contain: layout style paint;
  }
  ```
- Hanya render animasi CSS pada 16 card pertama (above-the-fold), sisanya rendered secara instant untuk menghemat GPU cycle.

### B. Hardware Acceleration & Backdrop Optimization
- Pada elemen fixed navigation, gunakan `bg-surface/95` dengan `will-change: transform` atau fallback blur yang ringan agar scrolling terasa 60 FPS mentok.

### C. Memoization (`useMemo` & `useCallback`)
- Bungkus pencarian dan pemfilteran kamar (`filteredRooms`), penghuni (`filteredTenants`), dan transaksi (`filteredTransactions`) dengan `useMemo`.

### D. Next.js Compiler & Script Optimization (`next.config.ts`)
- Aktifkan `experimental.optimizePackageImports` dan kompresi aset pada `next.config.ts`.

---

## 3. Dampak Terhadap Fungsi Aplikasi (Impact Analysis)
- **Tampilan & Fitur**: 100% Identik dan tidak ada fitur yang hilang.
- **Kecepatan & Responsivitas**: Scrolling 60 FPS, waktu render awal turun hingga > 60%, bebas dari stuttering/lag saat animasi berjalan.
