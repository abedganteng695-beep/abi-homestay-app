# Panduan Wrapping & Build Aplikasi iOS (CapacitorJS)

Dokumen ini menjelaskan persyaratan, langkah kompilasi, serta solusi cloud build untuk membuat aplikasi iOS (**file .ipa / TestFlight**) pada proyek Next.js **Abi Homestay**.

---

## 1. Persyaratan Utama Build iOS

Berbeda dengan Android yang dapat dikompilasi di Linux/Windows, **pembentukan aplikasi iOS native memerlukan lingkungan ekosistem Apple**:

1. **Perangkat Komputer**: Wajib menggunakan OS **macOS** (MacBook, Mac Mini, Mac Studio, atau Mac Pro).
2. **Perangkat Lunak**: **Xcode** (diunduh dari Mac App Store) dan **CocoaPods** (`sudo gem install cocoapods`).
3. **Akun Pengembang (Apple Developer Program)**:
   - **Tidak Diperlukan**: Jika hanya untuk pengujian pada **iOS Simulator** di macOS.
   - **Diperlukan ($99/tahun)**: Jika ingin memasang aplikasi ke iPhone fisik, distribusi via TestFlight, atau rilis ke App Store.

---

## 2. Langkah-Langkah Build di macOS dengan CapacitorJS

Jika Anda bekerja di komputer macOS:

1. **Install dependensi iOS Capacitor pada proyek**:
   ```bash
   npm install @capacitor/ios
   ```
2. **Tambahkan platform iOS**:
   ```bash
   npx cap add ios
   ```
3. **Sinkronkan aset web & konfigurasi**:
   ```bash
   npx cap sync
   ```
4. **Buka proyek di Xcode**:
   ```bash
   npx cap open ios
   ```
5. **Di dalam Xcode**:
   - Pilih target **iOS Simulator** (contoh: *iPhone 16 Pro*) -> Tekan tombol **Run (Play)** untuk menguji.
   - Untuk perangkat fisik: Pilih tim pengembangan pada tab **Signing & Capabilities**, hubungkan iPhone via kabel, lalu jalankan ke perangkat.

---

## 3. Solusi Build iOS dari Linux / Windows (Tanpa Laptop Mac)

Jika laptop utama Anda menggunakan Linux atau Windows, kompilasi iOS dapat dilakukan menggunakan **Cloud Build (CI/CD)**:

### Opsi A: GitHub Actions (Gratis untuk Repositori Public/Private)
Gunakan runner `macos-latest` pada GitHub Actions untuk menjalankan kompilasi Xcode secara otomatis di cloud setiap kali ada update.

### Opsi B: Ionic Appflow / Codemagic
Layanan *Cloud Build as a Service* khusus aplikasi mobile hybrid yang secara otomatis mengompilasi file `.ipa` dan mengirimkan build langsung ke TestFlight Apple tanpa memerlukan komputer Mac lokal.
