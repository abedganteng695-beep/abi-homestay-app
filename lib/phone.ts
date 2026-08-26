// lib/phone.ts
// -> handling modul utilitas nomor telepon
//    -> sanitasi input nomor HP
//    -> pemformatan tampilan nomor HP (+62 8xx-xxxx-xxxx)
//    -> pemformatan URL WhatsApp (wa.me/62...)

// helper --------------------------------------------------------------------------
// function untuk membersihkan input nomor HP dari awalan 0, 62, +62, dan karakter non-angka
// input param : raw (string)
// output : string digit murni tanpa awalan 0/62 (contoh: "81234567890")
// end of helper ------------------------------------------------------------------
export function sanitizePhoneDigits(raw: string): string {
  if (!raw) return "";
  let digits = raw.replace(/[^0-9]/g, "");

  if (digits.startsWith("62")) {
    digits = digits.slice(2);
  }
  while (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits;
}

// helper --------------------------------------------------------------------------
// function untuk memformat digit nomor HP menjadi tampilan berformat +62 8xx-xxxx-xxxx
// input param : raw (string)
// output : string berformat (contoh: "+62 812-3456-7890")
// end of helper ------------------------------------------------------------------
export function formatPhoneDisplay(raw: string): string {
  const digits = sanitizePhoneDigits(raw);
  if (!digits) return "";

  if (digits.length <= 3) {
    return `+62 ${digits}`;
  } else if (digits.length <= 7) {
    return `+62 ${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else {
    return `+62 ${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
}

// helper --------------------------------------------------------------------------
// function untuk menghasilkan URL WhatsApp yang valid (wa.me/628xxxxxxxx) dari nomor apa pun
// input param : phone (string)
// output : string URL WhatsApp
// end of helper ------------------------------------------------------------------
export function getWhatsAppUrl(phone: string): string {
  const digits = sanitizePhoneDigits(phone);
  if (!digits) return "#";
  return `https://wa.me/62${digits}`;
}
