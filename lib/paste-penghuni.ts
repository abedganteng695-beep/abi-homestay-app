// lib/paste-penghuni.ts
// -> handling parsing tempelan tabel dari Excel/Google Sheets menjadi data penghuni
// -> urutan kolom: Nama | No Kamar | No HP | Tanggal Masuk | Tipe Sewa | Harga Sewa
// -> fungsi murni tanpa efek samping

import { sanitizePhoneDigits, formatPhoneDisplay } from "./phone";

export interface PenghuniPasteInput {
  name: string;
  roomNumber: string;
  phone: string;
  dateIn: string;
  rentType: "MONTHLY" | "YEARLY" | "SEMESTERLY" | "DAILY";
  rentAmount?: number;
}

export interface HasilParsePenghuni {
  baris: PenghuniPasteInput[];
  masalah: { nomor: number; teks: string; alasan: string }[];
}

// helper --------------------------------------------------------------------------
// function untuk membuang karakter non-digit dan mengekstrak angka nominal/harga
// input param : teks (string)
// output : number | null
// end of helper ------------------------------------------------------------------
export function bacaAngka(teks: string): number | null {
  if (!teks) return null;
  const bersih = teks.replace(/\((min|max)\)/gi, "").trim();
  const tanpaDesimal = bersih.replace(/[.,]\d{2}\s*$/, "");
  const digit = tanpaDesimal.replace(/\D/g, "");
  if (!digit) return null;
  return Number.parseInt(digit, 10);
}

// helper --------------------------------------------------------------------------
// function untuk memecah baris teks berdasarkan pembatas TAB, titik-koma, atau koma
// input param : baris (string)
// output : string[] (kumpulan sel)
// end of helper ------------------------------------------------------------------
function pecahSel(baris: string): string[] {
  if (baris.includes("\t")) return baris.split("\t");
  if (baris.includes(";")) return baris.split(";");
  if (baris.includes(",")) return baris.split(",");
  return [baris];
}

// helper --------------------------------------------------------------------------
// function untuk mengonversi teks tipe sewa menjadi enum rentType
// input param : teks (string)
// output : "MONTHLY" | "YEARLY" | "SEMESTERLY" | "DAILY"
// end of helper ------------------------------------------------------------------
export function normalisasiRentType(teks: string): "MONTHLY" | "YEARLY" | "SEMESTERLY" | "DAILY" {
  if (!teks) return "MONTHLY";
  const val = teks.trim().toUpperCase();
  if (val.includes("HARI") || val.includes("DAILY")) return "DAILY";
  if (val.includes("SEMESTER") || val.includes("SEMESTERLY")) return "SEMESTERLY";
  if (val.includes("TAHUN") || val.includes("YEARLY")) return "YEARLY";
  return "MONTHLY";
}

// helper --------------------------------------------------------------------------
// function untuk membersihkan dan merapikan nomor kamar (contoh: "Kamar 05" -> "05")
// input param : teks (string)
// output : string (nomor kamar 2 digit / pad)
// end of helper ------------------------------------------------------------------
export function normalisasiNomorKamar(teks: string): string {
  if (!teks) return "";
  const digit = teks.replace(/[^0-9]/g, "");
  if (!digit) return teks.trim();
  return digit.padStart(2, "0");
}

// helper --------------------------------------------------------------------------
// function untuk mengonversi string tanggal dari berbagai format (YYYY-MM-DD, DD/MM/YYYY)
// input param : teks (string)
// output : string YYYY-MM-DD
// end of helper ------------------------------------------------------------------
export function normalisasiTanggal(teks: string): string {
  const hariIni = new Date().toISOString().split("T")[0];
  if (!teks || !teks.trim()) return hariIni;

  const bersih = teks.trim();
  // -> cek format ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(bersih)) {
    return bersih;
  }

  // -> cek format DD/MM/YYYY atau DD-MM-YYYY
  const matchPemisah = bersih.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (matchPemisah) {
    const tgl = matchPemisah[1].padStart(2, "0");
    const bln = matchPemisah[2].padStart(2, "0");
    const thn = matchPemisah[3];
    return `${thn}-${bln}-${tgl}`;
  }

  const d = new Date(bersih);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }

  return hariIni;
}

// helper --------------------------------------------------------------------------
// function untuk memproses string tempelan spreadsheet menjadi struktur data penghuni
// input param : teks (string)
// output : HasilParsePenghuni { baris, masalah }
// end of helper ------------------------------------------------------------------
export function parsePenghuniPaste(teks: string): HasilParsePenghuni {
  const hasil: HasilParsePenghuni = { baris: [], masalah: [] };

  const barisTeks = teks
    .split(/\r?\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  barisTeks.forEach((teksBaris, idx) => {
    const nomor = idx + 1;
    const sel = pecahSel(teksBaris).map((s) => s.trim());

    // Abai baris header jika baris pertama berisi "Nama" atau "Name"
    if (idx === 0 && (sel[0].toLowerCase().includes("nama") || sel[0].toLowerCase().includes("name"))) {
      return;
    }

    const name = sel[0] ?? "";
    const roomRaw = sel[1] ?? "";
    const phoneRaw = sel[2] ?? "";
    const dateInRaw = sel[3] ?? "";
    const rentTypeRaw = sel[4] ?? "";
    const amountRaw = sel[5] ?? "";

    if (!name) {
      hasil.masalah.push({ nomor, teks: teksBaris, alasan: "Nama penghuni kosong" });
      return;
    }

    const roomNumber = normalisasiNomorKamar(roomRaw);
    if (!roomNumber) {
      hasil.masalah.push({ nomor, teks: teksBaris, alasan: "Nomor kamar tidak valid / kosong" });
      return;
    }

    const phoneDigits = sanitizePhoneDigits(phoneRaw);
    if (!phoneDigits) {
      hasil.masalah.push({ nomor, teks: teksBaris, alasan: "Nomor HP tidak valid / kosong" });
      return;
    }

    const phone = formatPhoneDisplay(phoneDigits);
    const dateIn = normalisasiTanggal(dateInRaw);
    const rentType = normalisasiRentType(rentTypeRaw);
    const rentAmount = bacaAngka(amountRaw) ?? undefined;

    hasil.baris.push({
      name,
      roomNumber,
      phone,
      dateIn,
      rentType,
      rentAmount,
    });
  });

  return hasil;
}
