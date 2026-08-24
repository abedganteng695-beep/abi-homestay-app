import type { CapacitorConfig } from '@capacitor/cli';

// helper --------------------------------------------------------------------------
// Konfigurasi CapacitorJS untuk WebView Wrapping Aplikasi Abi Homestay
// output : CapacitorConfig object
// end of helper ------------------------------------------------------------------
const config: CapacitorConfig = {
  appId: 'com.abihomestay.app',
  appName: 'Abi Homestay',
  webDir: 'public',
  server: {
    // Mengarahkan WebView ke URL server terhosting atau IP lokal saat pengembangan
    url: 'https://abi-homestay-app.vercel.app',
    cleartext: true
  }
};

export default config;
