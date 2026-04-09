import {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  date,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// Better Auth Tables (managed by Better Auth CLI)
// ============================================================

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================
// Application Tables
// ============================================================

// ---------- EMPLOYEES ----------
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  nip: text("nip").notNull().unique(),
  nik: text("nik").notNull(),
  namaLengkap: text("nama_lengkap").notNull(),
  jalurMasuk: text("jalur_masuk").notNull(), // 'LPK' | 'UMUM'
  posisi: text("posisi").notNull(),
  sektor: integer("sektor").notNull(),
  regu: integer("regu").notNull(),
  status: text("status").notNull().default("AKTIF"), // 'AKTIF' | 'NON_AKTIF'
  tanggalMasuk: date("tanggal_masuk").notNull(),
  tanggalKeluar: date("tanggal_keluar"),
  nomorBpjs: text("nomor_bpjs"),
  fotoUrl: text("foto_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const employeesRelations = relations(employees, ({ many }) => ({
  contracts: many(contracts),
  resignations: many(resignations),
  penalties: many(penalties),
  apdItems: many(apdItems),
  documents: many(documents),
  activityLogs: many(activityLogs),
}));

// ---------- CONTRACTS ----------
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  tipeKontrak: text("tipe_kontrak").notNull(), // 'PKWT_1' | 'PKWT_2' | 'PKWTT'
  tanggalMulai: date("tanggal_mulai").notNull(),
  tanggalSelesai: date("tanggal_selesai").notNull(),
  status: text("status").notNull().default("AKTIF"), // 'AKTIF' | 'SELESAI' | 'DIPERPANJANG'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contractsRelations = relations(contracts, ({ one }) => ({
  employee: one(employees, {
    fields: [contracts.employeeId],
    references: [employees.id],
  }),
}));

// ---------- RESIGNATIONS ----------
export const resignations = pgTable("resignations", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  tipe: text("tipe").notNull(), // 'NORMAL' | 'PHK' | 'MENDADAK' | 'TANPA_BERITA'
  tanggalResign: date("tanggal_resign").notNull(),
  alasan: text("alasan"),
  statusClearance: text("status_clearance").notNull().default("PENDING"), // 'DALAM_PROSES' | 'SELESAI' | 'PENDING'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const resignationsRelations = relations(resignations, ({ one, many }) => ({
  employee: one(employees, {
    fields: [resignations.employeeId],
    references: [employees.id],
  }),
  clearanceItems: many(clearanceItems),
}));

// ---------- CLEARANCE ITEMS ----------
export const clearanceItems = pgTable("clearance_items", {
  id: serial("id").primaryKey(),
  resignationId: integer("resignation_id")
    .notNull()
    .references(() => resignations.id, { onDelete: "cascade" }),
  namaItem: text("nama_item").notNull(),
  deskripsi: text("deskripsi"),
  status: text("status").notNull().default("PENDING"), // 'VERIFIED' | 'PENDING'
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const clearanceItemsRelations = relations(clearanceItems, ({ one }) => ({
  resignation: one(resignations, {
    fields: [clearanceItems.resignationId],
    references: [resignations.id],
  }),
}));

// ---------- PENALTIES ----------
export const penalties = pgTable("penalties", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  alasan: text("alasan").notNull(),
  jumlah: integer("jumlah").notNull(), // dalam Rupiah
  status: text("status").notNull().default("BELUM_BAYAR"), // 'BELUM_BAYAR' | 'LUNAS'
  tanggalDenda: date("tanggal_denda").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const penaltiesRelations = relations(penalties, ({ one }) => ({
  employee: one(employees, {
    fields: [penalties.employeeId],
    references: [employees.id],
  }),
}));

// ---------- APD ITEMS ----------
export const apdItems = pgTable("apd_items", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  jenisApd: text("jenis_apd").notNull(), // 'Seragam' | 'Sepatu' | 'Haircup' | 'Apron' | 'ID Card'
  status: text("status").notNull().default("DIPINJAM"), // 'DIPINJAM' | 'DIKEMBALIKAN' | 'HILANG'
  depositAmount: integer("deposit_amount").notNull().default(0),
  tanggalPinjam: date("tanggal_pinjam").notNull(),
  tanggalKembali: date("tanggal_kembali"),
  catatan: text("catatan"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const apdItemsRelations = relations(apdItems, ({ one }) => ({
  employee: one(employees, {
    fields: [apdItems.employeeId],
    references: [employees.id],
  }),
}));

// ---------- DOCUMENTS ----------
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  tipe: text("tipe").notNull(), // 'KONTRAK' | 'KTP' | 'NPWP' | 'SK' | 'LAINNYA'
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(), // in bytes
  uploadDate: date("upload_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const documentsRelations = relations(documents, ({ one }) => ({
  employee: one(employees, {
    fields: [documents.employeeId],
    references: [employees.id],
  }),
}));

// ---------- ACTIVITY LOGS ----------
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id, {
    onDelete: "set null",
  }),
  tipeAktivitas: text("tipe_aktivitas").notNull(), // 'ONBOARDING' | 'OFFBOARDING' | 'PENALTY' | 'DOCUMENT_UPLOAD' | 'CONTRACT_UPDATE' | 'APD_UPDATE'
  deskripsi: text("deskripsi").notNull(),
  detail: text("detail"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  employee: one(employees, {
    fields: [activityLogs.employeeId],
    references: [employees.id],
  }),
}));
