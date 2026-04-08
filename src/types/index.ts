// ============================================================
// Shared TypeScript types for HR SIGMA
// ============================================================

export type JalurMasuk = "LPK" | "UMUM";
export type EmployeeStatus = "AKTIF" | "NON_AKTIF";
export type Posisi = "Helper Produksi" | "PIC" | "Foreman";

export type TipeKontrak = "PKWT_1" | "PKWT_2" | "PKWTT";
export type ContractStatus = "AKTIF" | "SELESAI" | "DIPERPANJANG";
export type ContractSeverity = "critical" | "warning" | "safe";

export type TipeResign = "NORMAL" | "PHK" | "MENDADAK" | "TANPA_BERITA";
export type ClearanceStatus = "DALAM_PROSES" | "SELESAI" | "PENDING";
export type ClearanceItemStatus = "VERIFIED" | "PENDING";

export type PenaltyStatus = "BELUM_BAYAR" | "LUNAS";

export type ApdJenis = "Seragam" | "Sepatu" | "Haircup" | "Apron" | "ID Card";
export type ApdStatus = "DIPINJAM" | "DIKEMBALIKAN" | "HILANG";

export type DocType = "KONTRAK" | "KTP" | "NPWP" | "SK" | "LAINNYA";

export type TipeAktivitas =
  | "ONBOARDING"
  | "OFFBOARDING"
  | "PENALTY"
  | "DOCUMENT_UPLOAD"
  | "CONTRACT_UPDATE"
  | "APD_UPDATE";

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface DashboardKPI {
  totalAktif: number;
  masukBulanIni: number;
  resignBulanIni: number;
  kontrakHampirHabis: number;
  percentChange: number;
}

export interface ContractWithDays {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeNip: string;
  position: string;
  department: string;
  tipeKontrak: TipeKontrak;
  tanggalMulai: string;
  tanggalSelesai: string;
  daysLeft: number;
  severity: ContractSeverity;
  avatar: string;
}

export interface PenaltyStats {
  totalPeriode: number;
  totalBelumBayar: number;
  totalLunas: number;
  jumlahRecord: number;
}
