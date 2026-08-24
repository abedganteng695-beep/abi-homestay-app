# Panduan Development & Pengujian Tampilan Android di Laptop

Dokumen ini menjelaskan cara melihat dan menguji tampilan aplikasi Android di laptop selama proses pengembangan (*development*).

---

## 1. Menggunakan Browser Web (Sangat Direkomendasikan & Paling Cepat)

Karena aplikasi **Abi Homestay** didesain dengan pendekatan *Responsive Mobile-First*, Anda **bisa dan sangat disarankan menggunakan Browser Web** (Google Chrome / Edge / Firefox) tanpa perlu emulator.

### Langkah-langkah:
1. Jalankan server pengembangan Next.js:
   ```bash
   npm run dev
   ```
2. Buka browser di alamat `http://localhost:3000`.
3. Buka **Developer Tools** dengan menekan tombol `F12` atau `Ctrl + Shift + I`.
4. Aktifkan **Toggle Device Toolbar** dengan menekan `Ctrl + Shift + M` (atau klik ikon ponsel di sudut kiri atas DevTools).
5. Pilih preset perangkat (misalnya *Pixel 7*, *Samsung Galaxy S20*, atau ukuran kustom misal `390 x 844`).
6. **Keuntungan**:
   - Pembaruan tampilan instan (*Hot Reload / Fast Refresh*).
   - Mudah melakukan kalkulasi inspeksi elemen CSS.
   - Tidak memberatkan RAM laptop.

---

## 2. Menggunakan Android Emulator (Android Studio AVD)

Jika Anda ingin melihat aplikasi berjalan di dalam OS Android asli beserta WebView native:

### Langkah-langkah:
1. Install **Android Studio** dan buat perangkat virtual melalui **AVD Manager** (Android Virtual Device).
2. Jalankan emulator.
3. Buka proyek Android melalui Capacitor:
   ```bash
   npm run cap:open
   ```
   Atau jalankan perintah build & run langsung ke emulator dari Android Studio.

---

## 3. Pengujian Langsung pada HP Android Asli (Physical Device)

Anda juga dapat menguji aplikasi langsung di ponsel Android menggunakan file APK:

### Langkah-langkah:
1. Aktifkan **Developer Options** dan **USB Debugging** pada ponsel Android Anda.
2. Hubungkan ponsel ke laptop menggunakan kabel USB.
3. Install file APK yang berada di direktori:
   `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 4. Mode Live Reload pada HP/Emulator (Capacitor Live Reload)

Agar HP Android atau Emulator dapat melihat perubahan kode `localhost` secara langsung tanpa perlu re-build APK:

1. Dapatkan IP lokal laptop Anda (contoh: `192.168.1.5`).
2. Ubah `capacitor.config.ts`:
   ```typescript
   server: {
     url: 'http://192.168.1.5:3000',
     cleartext: true
   }
   ```
3. Jalankan `npm run cap:sync`.
