# Panduan Wrapping WebApp ke Aplikasi Android APK (WebView)

Dokumen ini menjelaskan konsep, persyaratan Gradle, serta pilihan metode terbaik untuk membungkus (*wrapping*) aplikasi Next.js **Abi Homestay** menjadi file `.apk` Android.

---

## 1. Apakah Memerlukan Gradle?

**Ya, Gradle tetap diperlukan secara internal** untuk proses kompilasi (*build*) kode sumber Android menjadi file eksekutabel `.apk`.

- Jika menggunakan **CapacitorJS** atau **Android Studio**, Gradle akan bekerja secara otomatis di latar belakang melalui perintah CLI `./gradlew assembleDebug` atau melalui antarmuka Android Studio.
- Anda tidak perlu menulis skrip Gradle secara manual dari nol; pustaka pembungkus akan membuatkan struktur proyek Android beserta konfigurasi Gradle secara otomatis.

---

## 2. Karakteristik Aplikasi Next.js dengan Server Actions & Prisma

Karena aplikasi **Abi Homestay** memanfaatkan **Next.js Server Actions** dan **Prisma ORM** (Database Node.js), aplikasi ini memerlukan server terpisah untuk menjalankan logika backend dan database.

Terdapat 2 strategi wrapping WebView:

### Strategi A: WebView Menunjuk ke URL Server Terhosting (Sangat Direkomendasikan)
WebView di dalam aplikasi APK membuka URL server terhosting (misalnya `https://abi-homestay.vercel.app` atau IP server lokal).
- **Keunggulan**: Seluruh fitur database Prisma, Server Actions, dan upload file Vercel Blob berjalan sempurna tanpa modifikasi kode backend.
- **Pembaruan**: Pembaharuan aplikasi web langsung secara otomatis memperbarui tampilan di aplikasi Android pengguna tanpa perlu install ulang APK.

### Strategi B: Static Export HTML yang Dimuat Lokal (Asset Bundle)
Menghasilkan output HTML statis (`next export`) dan memasukkannya ke dalam folder `assets/` aplikasi Android.
- **Keterbatasan**: Logika Prisma dan Server Actions tidak dapat berjalan secara lokal di perangkat ponsel tanpa API endpoint eksternal.

---

## 3. Pilihan Metode Build APK

### Metode 1: CapacitorJS (Metode Paling Mudah & Modern)
[Capacitor](https://capacitorjs.com/) adalah alat resmi dari Ionic untuk membungkus WebApp JS/React menjadi aplikasi Android & iOS.

**Langkah-langkah Build dengan Capacitor:**
1. Install Capacitor CLI pada proyek:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init "Abi Homestay" "com.abihomestay.app" --web-dir public
   ```
2. Konfigurasi `capacitor.config.json` untuk mengarah ke URL server:
   ```json
   {
     "appId": "com.abihomestay.app",
     "appName": "Abi Homestay",
     "webDir": "public",
     "server": {
       "url": "https://abi-homestay.vercel.app",
       "cleartext": true
     }
   }
   ```
3. Tambahkan platform Android dan jalankan kompilasi:
   ```bash
   npx cap add android
   npx cap open android
   ```
4. Di Android Studio, pilih menu **Build > Build Bundle(s) / APK(s) > Build APK(s)** untuk menghasilkan file `.apk`.

---

### Metode 2: Native Android Studio Project (WebView Activity)
Membuat proyek Android sederhana menggunakan Kotlin atau Java di Android Studio dengan komponen `WebView`.

**Langkah-langkah:**
1. Buka Android Studio -> *Create New Project* -> *Empty Activity*.
2. Pada `AndroidManifest.xml`, tambahkan izin internet:
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   ```
3. Pada `activity_main.xml`, buat elemen `WebView`:
   ```xml
   <WebView
       android:id="@+id/webView"
       android:layout_width="match_parent"
       android:layout_height="match_parent" />
   ```
4. Pada `MainActivity.kt`, muat URL aplikasi:
   ```kotlin
   val webView = findViewById<WebView>(R.id.webView)
   webView.settings.javaScriptEnabled = true
   webView.loadUrl("https://abi-homestay.vercel.app")
   ```
5. Jalankan perintah kompilasi Gradle:
   ```bash
   ./gradlew assembleDebug
   ```
   File `.apk` akan dihasilkan di folder `app/build/outputs/apk/debug/app-debug.apk`.

---

### Metode 3: Bubblewrap (Trusted Web Activity / TWA)
Metode pembungkus PWA resmi dari Google yang menghasilkan proyek Android Gradle.

---

## 4. Ringkasan Rekomendasi
Untuk proyek **Abi Homestay**, penggunaan **CapacitorJS** atau **Proyek Android Studio WebView (Strategi A)** adalah solusi yang paling efektif dan stabil karena mendukung fitur Server Actions & Database Prisma secara utuh.
