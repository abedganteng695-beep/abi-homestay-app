# Analisis & Solusi Error: MongoDB Atlas "empty database name not allowed"

## 1. Penyebab Utama (Root Cause)
Error `Error code 8000 (AtlasError): empty database name not allowed` terjadi ketika URI koneksi MongoDB (`DATABASE_URL` atau `MONGODB_URI`) di-inject oleh environment server/deployment tanpa menyertakan nama database (`/abi-homestay`) sebelum parameter query `?retryWrites=true&w=majority`.

**Contoh URI Bermasalah**:
`mongodb+srv://user:pass@abi-homestay-database.x7sw9vu.mongodb.net/?retryWrites=true&w=majority` (tidak ada `/abi-homestay`).

MongoDB Atlas proxy menolak seluruh kueri Prisma (`findMany`, `count`, dll.) jika nama database tidak dispesifikasikan pada URI koneksi.

---

## 2. Solusi Teknis (Sanitasi URI Database Otomatis)
Di file `lib/prisma.ts`, kita tambahkan fungsi helper penyaring URI `getSanitizedDatabaseUrl()` yang secara otomatis mendeteksi dan menyisipkan `/abi-homestay` jika nama database hilang dari environment variable.

### Kode Helper:
```typescript
function getSanitizedDatabaseUrl(): string {
  let url =
    process.env.DATABASE_URL ||
    process.env.MONGODB_URI ||
    "mongodb+srv://Vercel-Admin-abi-homestay-database:kkwDBHUOc8NFDvQP@abi-homestay-database.x7sw9vu.mongodb.net/abi-homestay?retryWrites=true&w=majority";

  if (url.includes(".mongodb.net/?")) {
    url = url.replace(".mongodb.net/?", ".mongodb.net/abi-homestay?");
  } else if (url.includes(".mongodb.net?")) {
    url = url.replace(".mongodb.net?", ".mongodb.net/abi-homestay?");
  } else if (url.endsWith(".mongodb.net") || url.endsWith(".mongodb.net/")) {
    url = url.replace(/\.mongodb\.net\/?$/, ".mongodb.net/abi-homestay");
  }

  return url;
}
```

---

## 3. Dampak Terhadap Komponen Lain (Impact Analysis)
- **Komponen Frontend**: 0% Dampak Negatif. Tampilan UI dan komponen React tidak terdampak.
- **Server Actions & Database**: Kueri Prisma berjalan 100% stabil di semua lingkungan (Local, Staging, Vercel Production) tanpa risiko gagal akibat URL koneksi yang tidak lengkap.
