# Knowledge: Export & Import Excel & CSV Data Penghuni

## Reference: Lancar Jaya Printing (`paste-varian.ts`) & SheetJS (`xlsx`)
Di project `lancarjayaprinting` (`lancarjaya-web/apps/admin/src/lib/catalog/paste-varian.ts`), impor data produk menggunakan pendekatan **Tempel Spreadsheet (TSV/CSV)**.
Pada `abi-homestay-app`, kemampuan ini ditingkatkan dengan penambahan pustaka `xlsx` (SheetJS) untuk mendukung file **Excel (.xlsx, .xls)** dan **CSV (.csv, .tsv)** secara simultan.

## Fitur Export
- Pengguna dapat memilih format ekspor:
  1. **Format Excel (`.xlsx`)**: File spreadsheet resmi Microsoft Excel dengan sheet "Penghuni".
  2. **Format CSV (`.csv`)**: File teks dipisah koma dengan UTF-8 BOM (`\uFEFF`) agar tidak berantakan di Excel.

## Fitur Import
- **Mendukung 2 Format Sekaligus**:
  - **Unggah File**: Pengguna dapat mengunggah file `.xlsx`, `.xls`, `.csv`, `.tsv`, atau `.txt`. Modul `parseFileToTableText` otomatis membaca file tersebut di browser dan memisahkan kolomnya.
  - **Tempel Spreadsheet**: Pengguna dapat menyalin tabel dari Excel / Google Sheets (Ctrl+C) dan menempelkan langsung (Ctrl+V).
- **Validasi Otomatis Live**:
  - `bacaAngka` membasmi simbol mata uang (`Rp`), spasi, dan titik desimal.
  - `sanitizePhoneDigits` & `formatPhoneDisplay` menstandarkan nomor HP ke format `+62 8xx-xxxx-xxxx`.
  - `normalisasiRentType` & `normalisasiTanggal` mengonversi tipe sewa (`Bulanan`, `Tahunan`, `Per Semester`, `Per Hari`) dan format tanggal.
  - Menampilkan jumlah baris valid dan log kesalahan per baris jika ada data yang kosong/salah.
