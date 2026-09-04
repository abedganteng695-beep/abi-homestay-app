// lib/excel-penghuni.ts
// -> handling pembuat & pengunduh file CSV / TSV data penghuni
// -> mendukung pembukaan langsung di Microsoft Excel dengan UTF-8 BOM

import { formatRentTypeLabel } from "./rent";

export interface TenantExportData {
  name: string;
  phone: string;
  room?: { number: string };
  status: string;
  dateIn: Date | string;
  dateDue: Date | string | null;
  rentType: string;
  rentAmount: number;
}

// helper --------------------------------------------------------------------------
// function untuk menghasilkan string CSV dari daftar penghuni
// input param : tenants (TenantExportData[])
// output : string (konten file CSV dengan UTF-8 BOM)
// end of helper ------------------------------------------------------------------
export function generatePenghuniCSV(tenants: TenantExportData[]): string {
  const headers = [
    "Nama Penghuni",
    "Nomor Kamar",
    "Nomor HP",
    "Tanggal Masuk",
    "Jatuh Tempo",
    "Tipe Sewa",
    "Status",
    "Harga Sewa (Rp)",
  ];

  const rows = tenants.map((t) => {
    const tglMasuk = t.dateIn ? new Date(t.dateIn).toISOString().split("T")[0] : "-";
    const tglJatuhTempo = t.dateDue ? new Date(t.dateDue).toISOString().split("T")[0] : "-";
    const statusLabel =
      t.status === "ACTIVE"
        ? "Aktif"
        : t.status === "EXPIRING_SOON"
        ? "Akan Jatuh Tempo"
        : "Non-aktif";

    return [
      `"${(t.name || "").replace(/"/g, '""')}"`,
      `"${t.room?.number || "--"}"`,
      `"${t.phone || "-"}"`,
      `"${tglMasuk}"`,
      `"${tglJatuhTempo}"`,
      `"${formatRentTypeLabel(t.rentType)}"`,
      `"${statusLabel}"`,
      t.rentAmount || 0,
    ].join(",");
  });

  return "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
}

// helper --------------------------------------------------------------------------
// function untuk memicu unduhan file CSV di browser client
// input param : content (string), filename (string)
// output : void
// end of helper ------------------------------------------------------------------
export function triggerFileDownload(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// helper --------------------------------------------------------------------------
// function untuk mengunduh template CSV sampel penghuni baru
// input param : none
// output : void
// end of helper ------------------------------------------------------------------
export function downloadTemplatePenghuniCSV(): void {
  const headers = ["Nama Penghuni", "Nomor Kamar", "Nomor HP", "Tanggal Masuk", "Tipe Sewa", "Harga Sewa"];
  const sampleRows = [
    ["Budi Santoso", "01", "081234567890", "2026-09-01", "Bulanan", "2500000"],
    ["Siti Rahma", "02", "089876543210", "2026-09-05", "Tahunan", "28000000"],
  ];

  const csvContent =
    "\uFEFF" +
    [headers.join(","), ...sampleRows.map((r) => r.map((cell) => `"${cell}"`).join(","))].join("\r\n");

  triggerFileDownload(csvContent, "Template_Penghuni_Baru.csv");
}
