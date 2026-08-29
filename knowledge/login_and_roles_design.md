# Knowledge: Login & Role-Based Access Control (RBAC) System Design

## Overview
Dokumen ini mendokumentasikan analisis arsitektur, skema database, sistem autentikasi, serta pembagian peran (Role) untuk fitur Login di aplikasi Abi Homestay berdasarkan hasil /grill-me.

## 1. Analisis & Kesepakatan Desain (Hasil /grill-me)
1. **Tipe Autentikasi**: Murni **Lokal** (Username & Password).
2. **Skema Database Prisma**:
   - Enum `Role`: `VIEW`, `EDIT`, `ADMIN`.
   - Model `User`: `id`, `username`, `name`, `password`, `role`, `status`, `createdAt`, `updatedAt`.
3. **Akun Bawaan (Seeding)**:
   - `admin` / `admin123` -> Role: `ADMIN` (Akses penuh)
   - `edit` / `edit123` -> Role: `EDIT` (CRUD operasional)
   - `view` / `view123` -> Role: `VIEW` (Hanya melihat & mencari)
4. **Gaya Visual Halaman Login (`app/login/page.tsx`)**:
   - Centered Glassmorphism Card dengan warna aksen `secondary` (`#006a61`), logo Abi Homestay, input field ber-border halus, dan Material Symbols icon.
5. **Layout & Navigasi**:
   - Navigasi global (`Navigation.tsx`) disembunyikan secara otomatis di halaman `/login`.
   - Info pengguna (Nama, Role Badge, Tombol Logout) ditampilkan di bagian bawah SideNav (Desktop) dan TopBar (Mobile).
6. **Pembatasan Hak Akses (RBAC)**:
   - Multi-layer guard: UI hiding untuk tombol aksi pada role `VIEW` + Server Action level protection.

## 2. Struktur Komponen Terdampak
- [schema.prisma](file:///home/vereniaes/project/abi-homestay-app/prisma/schema.prisma) -> Penambahan Enum `Role` & Model `User`
- [actions.ts](file:///home/vereniaes/project/abi-homestay-app/app/actions.ts) -> Penambahan Server Actions: `loginUser`, `logoutUser`, `getCurrentUser`, `seedUsers`
- [login/page.tsx](file:///home/vereniaes/project/abi-homestay-app/app/login/page.tsx) -> [NEW] Halaman Login Centered Glassmorphism Card
- [Navigation.tsx](file:///home/vereniaes/project/abi-homestay-app/components/Navigation.tsx) -> Pengecekan pathname `/login` + Profile & Logout button
- [layout.tsx](file:///home/vereniaes/project/abi-homestay-app/app/layout.tsx) -> Layout wrapper penyesuaian halaman login
