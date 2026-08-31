# Knowledge: Perbaikan Layout Squeezed Halaman Login & Max-Width Tailwind v4

## 1. Masalah Utama (Issue & Critical Root Cause)
Halaman login (`app/login/page.tsx`) dan beberapa komponen visual mengalami *width collapse* (tampilan terhimpit secara vertikal menjadi strip 24px di tengah layar HP dan Laptop).

### Akar Penyebab:
1. Di [tailwind.config.ts](file:///home/vereniaes/project/abi-homestay-app/tailwind.config.ts), properti `theme.extend.spacing` mendefinisikan kunci kustom `md: "24px"`, `sm: "12px"`, `lg: "40px"`, `xl: "64px"`.
2. Di Tailwind CSS v4 ([globals.css](file:///home/vereniaes/project/abi-homestay-app/app/globals.css)), ketika `@config "../tailwind.config.ts";` diimpor, utilitas `max-w-md` secara otomatis mengambil nilai dari `spacing.md` (`24px`), bukan standar `maxWidth.md` (`28rem` / `448px`).
3. Akibatnya, elemen `<div className="w-full max-w-md ...">` di [login/page.tsx](file:///home/vereniaes/project/abi-homestay-app/app/login/page.tsx#L68) memicu `max-width: 24px`, menyebabkan seluruh teks dan komponen login tertekuk secara vertikal (1 huruf/kata per baris).

## 2. Analisis Dampak (Impact Analysis)
- **Komponen Terdampak Direct**: [app/login/page.tsx](file:///home/vereniaes/project/abi-homestay-app/app/login/page.tsx), [tailwind.config.ts](file:///home/vereniaes/project/abi-homestay-app/tailwind.config.ts).
- **Komponen Terdampak Indirect**: Komponen yang menggunakan kustom `p-md`, `gap-sm`, `mb-md` seperti [Navigation.tsx](file:///home/vereniaes/project/abi-homestay-app/components/Navigation.tsx) dan [kamar/page.tsx](file:///home/vereniaes/project/abi-homestay-app/app/kamar/page.tsx).
- **Logika Bisnis & Backend**: 0% Dampak. Autentikasi Server Actions (`loginUser`) dan Prisma DB tidak terganggu.

## 3. Opsi Solusi yang Direkomendasikan
1. **Opsi A (Ekstensi `maxWidth` Eksplisit di `tailwind.config.ts`)**:
   - Menambahkan konfigurasi `maxWidth` standar (`sm: "24rem"`, `md: "28rem"`, `lg: "32rem"`, `xl: "36rem"`, `container-max: "1200px"`) pada `tailwind.config.ts`.
   - Mengubah `max-w-md` pada `login/page.tsx` menjadi `max-w-md` (yang kini bernilai 448px) atau `max-w-[448px]`.
   - *Kelebihan*: Menjaga kompatibilitas kustom alias `p-md`/`gap-sm` sekaligus memperbaiki seluruh utilitas `max-w-*` di seluruh aplikasi.

2. **Opsi B (Gunakan Class Arbitrer `max-w-[448px]` & `w-full` pada `login/page.tsx`)**:
   - Mengganti `max-w-md` secara spesifik di `app/login/page.tsx` menjadi `max-w-[448px]` atau `w-[90%] md:w-[448px]`.
   - *Kelebihan*: Cepat dan terisolasi khusus di halaman login tanpa mengubah file Tailwind global.
   - *Kekurangan*: Masalah `max-w-md` masih ada di tempat lain jika digunakan di masa depan.

3. **Opsi C (Refactor `tailwind.config.ts` - Pisahkan `maxWidth` & `spacing`)**:
   - Menghapus override kunci `sm`, `md`, `lg`, `xl` dari `theme.extend.spacing` dan menggantinya dengan kustom alias non-colliding (misal `spacing-md` atau nilai pixel langsung).
   - Menyetel `maxWidth` secara bersih.
   - *Kelebihan*: Paling bersih dan sesuai standar Tailwind CSS v4.
   - *Kekurangan*: Perlu audit sedikit pada pemakaian `p-md` / `gap-sm`.
