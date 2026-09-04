# Knowledge: Export & Import Excel Data Penghuni

## Reference: Lancar Jaya Printing (`paste-varian.ts`)
Di project `lancarjayaprinting` (`lancarjaya-web/apps/admin/src/lib/catalog/paste-varian.ts`), fitur impor produk dilakukan dengan pendekatan **Tempel Spreadsheet (TSV/CSV)** tanpa dependency berat:
1. Pengguna melakukan Copy (Ctrl+C) dari Excel / Google Sheets.
2. Pengguna menempelkan (Ctrl+V) teks mentah ke modal/area input.
3. Parser memisah sel berdasarkan tab (`\t`), titik-koma (`;`), atau koma (`,`).
4. Fungsi `bacaAngka` membasmi simbol mata uang (`Rp`), spasi, dan format angka desimal.
5. Menghasilkan daftar data valid dan daftar baris bermasalah (error log per baris) sebelum disimpan ke database.

## Adaptasi untuk ABI Homestay (`penghuni`)
Data Penghuni di `abi-homestay-app` (`Tenant` model) memiliki struktur:
- **Nama** (`name`: string) - wajib
- **Nomor Kamar** (`roomNumber`: string) - wajib (misal: "01", "15")
- **Nomor HP** (`phone`: string) - wajib (misal: "08123456789" -> diformat ke `+62 812-3456-789`)
- **Tanggal Masuk** (`dateIn`: Date) - opsional (default: hari ini)
- **Tipe Sewa** (`rentType`: `MONTHLY` | `YEARLY` | `SEMESTERLY` | `DAILY`) - opsional (default: `MONTHLY`)
- **Harga Sewa** (`rentAmount`: number) - opsional (auto dari `Pricing` master jika kosong)

## Fitur Export
- Ekspor daftar penghuni aktif/semua ke format CSV / Excel-compatible TSV dengan header:
  `Nama, Nomor Kamar, Nomor HP, Tanggal Masuk, Jatuh Tempo, Tipe Sewa, Status, Harga Sewa`
- Dapat diunduh langsung via browser tanpa backend tambahan (menggunakan Blob & HTML5 download link) atau via Server Action.

## Fitur Import
- **Mode 1**: Tempel Langsung Teks Spreadsheet (Paste TSV/CSV dari Excel/Google Sheets).
- **Mode 2**: Unggah File `.csv` / `.xlsx` (menggunakan parser CSV/Excel browser murni).
- Validasi instan di UI dengan pratinjau "N data terbaca, M data bermasalah".
- Opsi simpan massal (bulk insert/upsert) ke database via Server Action `importTenantsBulk`.
