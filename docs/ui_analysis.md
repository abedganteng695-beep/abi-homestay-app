# Analisis Kesenjangan UI: Next.js vs Template Static HTML

## Deskripsi Masalah Utama
Tampilan UI pada aplikasi Next.js saat ini tidak sama dengan desain prototype `.html` (`index.html`, `kamar.html`, `penghuni.html`, `laporan.html`, `pengaturan.html`) dan mockup screenshot yang ada pada direktori `docs/`.

## Akar Penyebab Kritis (Critical Issue)
1. **Konfigurasi Tailwind CSS v4 Disconnect**:
   - `globals.css` menggunakan sintaks Tailwind CSS v4 `@import "tailwindcss";`, tetapi tidak memiliki direktif `@config "./tailwind.config.ts";`.
   - Hal ini menyebabkan Tailwind CSS v4 mengabaikan kustomisasi tema yang didefinisikan pada `tailwind.config.ts` (seperti token warna Material 3 Design: `surface-container-lowest`, `primary-fixed`, `secondary-container`, `brand-deep-blue`, `brand-teal`, `brand-amber`, serta kustomisasi `fontSize`, `spacing`, dan `animation`).
   - Akibatnya, class CSS kustom tidak ter-generate dan komponen React kehilangan styling presisi.

2. **Perbedaan Struktur DOM & Class Antara Komponen React dan File HTML**:
   - `components/Navigation.tsx`: Struktur TopAppBar, SideNav, dan BottomNavBar memiliki beberapa class yang berbeda dari `index.html` & `kamar.html`.
   - `components/HomeDashboardClient.tsx`: Donut chart SVG, kartu statistik, dan tombol aksi cepat belum 100% identik dengan elemen DOM di `index.html`.
   - `app/kamar/page.tsx`: Modal bottom sheet dan indikator kamar belum presisi dengan `kamar.html`.
   - `app/penghuni/page.tsx`: List penghuni, filter chips, dan profil bottom sheet belum presisi dengan `penghuni.html`.
   - `app/laporan/page.tsx`: Kartu pendapatan, accordion transaksi, dan modal pembayaran belum presisi dengan `laporan.html`.
   - `app/pengaturan/page.tsx`: Item menu operasional dan modal master harga sewa belum presisi dengan `pengaturan.html`.

## Solusi Teknis
1. Menambahkan `@config "./tailwind.config.ts";` di bagian paling atas `app/globals.css`.
2. Menyinkronkan seluruh komponen di Next.js agar class HTML, warna, struktur grid, padding, dan Material Symbols icon identik 100% dengan prototype `.html`.
3. Memastikan semua fungsi bisnis (Server Actions, Prisma DB integration, state management) tetap berjalan tanpa perubahan logika backend.

## Analisis Dampak (Impact Analysis)
- **Backend & Database**: Tidak ada dampak. Logika Prisma dan Server Actions (`actions.ts`) tetap sama.
- **Komponen React**: Tampilan visual akan menjadi presisi 100% sesuai file `.html` dan mockup.
- **Performa Build**: Generasi CSS Tailwind v4 menjadi lebih efisien dan tepat sasaran.
