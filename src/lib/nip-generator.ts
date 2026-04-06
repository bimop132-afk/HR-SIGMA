import { db } from "@/db";
import { employees } from "@/db/schema";
import { eq, and, like } from "drizzle-orm";

/**
 * Generate NIP (Nomor Induk Pegawai) otomatis.
 *
 * Format: YYMMDDXXX
 * - YY   = 2 digit tahun masuk
 * - MM   = 2 digit bulan masuk
 * - DD   = 2 digit tanggal masuk
 * - XXX  = 3 digit urutan:
 *          → Dimulai dari 101 untuk jalur LPK
 *          → Dimulai dari 301 untuk jalur UMUM
 *
 * Contoh:
 *   LPK  masuk 15 Maret 2026 → 260315101, 260315102, ...
 *   UMUM masuk 15 Maret 2026 → 260315301, 260315302, ...
 */
export async function generateNIP(
  tanggalMasuk: Date,
  jalurMasuk: "LPK" | "UMUM"
): Promise<string> {
  const yy = String(tanggalMasuk.getFullYear()).slice(-2);
  const mm = String(tanggalMasuk.getMonth() + 1).padStart(2, "0");
  const dd = String(tanggalMasuk.getDate()).padStart(2, "0");

  const datePrefix = `${yy}${mm}${dd}`;

  // Determine starting sequence based on jalur
  const rangeStart = jalurMasuk === "LPK" ? 101 : 301;
  const rangeEnd = jalurMasuk === "LPK" ? 299 : 499;

  // Find existing NIPs with the same date prefix
  const existingEmployees = await db
    .select({ nip: employees.nip })
    .from(employees)
    .where(like(employees.nip, `${datePrefix}%`));

  // Find the highest sequence number in the current jalur range
  let maxSeq = rangeStart - 1;

  for (const emp of existingEmployees) {
    const seqStr = emp.nip.slice(6); // Last 3 digits
    const seq = parseInt(seqStr, 10);
    if (seq >= rangeStart && seq <= rangeEnd && seq > maxSeq) {
      maxSeq = seq;
    }
  }

  const nextSeq = maxSeq + 1;

  if (nextSeq > rangeEnd) {
    throw new Error(
      `NIP sequence overflow for ${jalurMasuk} on ${datePrefix}. Max reached.`
    );
  }

  return `${datePrefix}${nextSeq}`;
}
