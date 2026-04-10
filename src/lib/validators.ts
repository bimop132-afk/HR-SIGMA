import { z } from "zod";

export const createEmployeeSchema = z.object({
  nik: z
    .string()
    .length(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK harus berupa angka"),
  namaLengkap: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(255, "Nama maksimal 255 karakter"),
  jalurMasuk: z.enum(["LPK", "UMUM"]),
  posisi: z.enum(["Helper Produksi", "PIC", "Foreman"]),
  sektor: z
    .number()
    .int()
    .refine((v) => [0, 1, 2, 3, 4, 5, 6, 8, 9, 10].includes(v), {
      message: "Sektor tidak valid",
    })
    .optional()
    .nullable(),
  regu: z.number().int().min(0).max(3).optional().nullable(),
  tanggalMasuk: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Tanggal masuk tidak valid",
  }),
  nomorBpjs: z.string().optional().nullable(),
  fotoUrl: z.string().url().optional().nullable(),
  nip: z.string().optional(),

  // New Fields
  jenisKelamin: z.enum(["L", "P"]).optional().nullable(),
  tempatLahir: z.string().optional().nullable(),
  tanggalLahir: z.string().optional().nullable(),
  alamatLengkap: z.string().optional().nullable(),
  noHp: z.string().optional().nullable(),
  emailAktif: z.string().email("Format email tidak valid").optional().nullable(),
  noKk: z.string().optional().nullable(),
  namaIbuKandung: z.string().optional().nullable(),
  rt: z.string().optional().nullable(),
  rw: z.string().optional().nullable(),
  kelurahan: z.string().optional().nullable(),
  kecamatan: z.string().optional().nullable(),
  kabupaten: z.string().optional().nullable(),
  masaLakuIdentitas: z.string().optional().nullable(),
  golonganDarah: z.string().optional().nullable(),
  seragamSize: z.string().optional().nullable(),
  sepatuSize: z.number().int().optional().nullable(),

  // Document URLs
  fotoKtpUrl: z.string().url().optional().nullable(),
  fotoKkUrl: z.string().url().optional().nullable(),
  fotoIjazahUrl: z.string().url().optional().nullable(),
});

export const updateEmployeeSchema = createEmployeeSchema.extend({
  status: z.enum(["AKTIF", "NON_AKTIF"]).optional(),
  tanggalKeluar: z.string().refine((v) => !v || !isNaN(Date.parse(v)), {
    message: "Tanggal keluar tidak valid",
  }).optional().nullable(),
}).partial();

export const createContractSchema = z.object({
  employeeId: z.number().int().positive(),
  tipeKontrak: z.enum(["PKWT_1", "PKWT_2", "PKWTT"]),
  tanggalMulai: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Tanggal mulai tidak valid",
  }),
  tanggalSelesai: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Tanggal selesai tidak valid",
  }),
});

export const createResignationSchema = z.object({
  employeeId: z.number().int().positive(),
  tipe: z.enum(["NORMAL", "PHK", "MENDADAK", "TANPA_BERITA"]),
  tanggalResign: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Tanggal resign tidak valid",
  }),
  alasan: z.string().optional().nullable(),
});

export const createPenaltySchema = z.object({
  employeeId: z.number().int().positive(),
  alasan: z.string().min(1, "Alasan harus diisi"),
  jumlah: z.number().int().positive("Jumlah harus lebih dari 0"),
  tanggalDenda: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Tanggal denda tidak valid",
  }),
});

export const createApdSchema = z.object({
  employeeId: z.number().int().positive(),
  jenisApd: z.enum(["Seragam", "Sepatu", "Haircup", "Apron", "ID Card"]),
  depositAmount: z.number().int().min(0).default(0),
  tanggalPinjam: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Tanggal pinjam tidak valid",
  }),
  catatan: z.string().optional().nullable(),
});

export const updateApdSchema = z.object({
  status: z.enum(["DIPINJAM", "DIKEMBALIKAN", "HILANG"]),
  tanggalKembali: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), {
      message: "Tanggal kembali tidak valid",
    })
    .optional()
    .nullable(),
  catatan: z.string().optional().nullable(),
});

export const createWarningLetterSchema = z.object({
  employeeId: z.number().int().positive(),
  tipe: z.enum(["SP_1", "SP_2", "SP_3"]),
  alasan: z.string().min(1, "Alasan harus diisi"),
  tanggalTerbit: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Tanggal terbit tidak valid",
  }),
  tanggalBerakhir: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Tanggal berakhir tidak valid",
  }),
  keterangan: z.string().optional().nullable(),
});
