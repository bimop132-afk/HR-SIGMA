import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  employees,
  contracts,
  resignations,
  clearanceItems,
  penalties,
  apdItems,
  activityLogs,
} from "../src/db/schema";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/hr_sigma";

async function seed() {
  console.log("🌱 Seeding database...\n");

  const pool = new Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool);

  // --- Seed Admin User via Better Auth API ---
  console.log("👤 Creating admin user via Better Auth API...");
  try {
    const res = await fetch("http://localhost:3000/api/auth/sign-up/email", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Origin": "http://localhost:3000"
      },
      body: JSON.stringify({
        name: "Admin Kurator",
        email: "admin@hrsigma.local",
        password: "admin123",
      }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log("   ✅ Admin user created");
    } else {
      console.log("   ⚠️  Admin user may already exist:", data);
    }
  } catch {
    console.log("   ⚠️  Could not create admin (is the server running?)");
    console.log("   → Run 'npm run dev' first, then run seed again for admin user");
  }

  // --- Seed Employees ---
  console.log("\n👥 Seeding employees...");
  const employeeData = [
    {
      nip: "260315101",
      nik: "3210112233445566",
      namaLengkap: "Aditya Pratama",
      jalurMasuk: "LPK",
      posisi: "PIC Line",
      sektor: 1,
      regu: 1,
      status: "AKTIF",
      tanggalMasuk: "2026-03-15",
    },
    {
      nip: "260310102",
      nik: "3210223344556677",
      namaLengkap: "Siti Rahmawati",
      jalurMasuk: "LPK",
      posisi: "Packing",
      sektor: 2,
      regu: 2,
      status: "NON_AKTIF",
      tanggalMasuk: "2026-03-10",
      tanggalKeluar: "2026-10-15",
    },
    {
      nip: "260305103",
      nik: "3210334455667788",
      namaLengkap: "Budi Santoso",
      jalurMasuk: "LPK",
      posisi: "Susun",
      sektor: 3,
      regu: 1,
      status: "NON_AKTIF",
      tanggalMasuk: "2026-03-05",
      tanggalKeluar: "2026-10-10",
    },
    {
      nip: "260301301",
      nik: "3210445566778899",
      namaLengkap: "Andi Wijaya",
      jalurMasuk: "UMUM",
      posisi: "Sortir",
      sektor: 4,
      regu: 3,
      status: "NON_AKTIF",
      tanggalMasuk: "2026-03-01",
      tanggalKeluar: "2026-10-05",
    },
    {
      nip: "260220104",
      nik: "3210556677889900",
      namaLengkap: "Dewi Ratnasari",
      jalurMasuk: "LPK",
      posisi: "Lakban",
      sektor: 5,
      regu: 2,
      status: "AKTIF",
      tanggalMasuk: "2026-02-20",
    },
    {
      nip: "260215302",
      nik: "3210667788990011",
      namaLengkap: "Anisa Rahma",
      jalurMasuk: "UMUM",
      posisi: "Packing",
      sektor: 4,
      regu: 1,
      status: "AKTIF",
      tanggalMasuk: "2026-02-15",
    },
    {
      nip: "260210105",
      nik: "3210778899001122",
      namaLengkap: "Rizky Firmansyah",
      jalurMasuk: "LPK",
      posisi: "Foreman",
      sektor: 1,
      regu: 1,
      status: "AKTIF",
      tanggalMasuk: "2026-02-10",
    },
    {
      nip: "260205106",
      nik: "3210889900112233",
      namaLengkap: "Putri Wulandari",
      jalurMasuk: "LPK",
      posisi: "PIC Line",
      sektor: 6,
      regu: 3,
      status: "AKTIF",
      tanggalMasuk: "2026-02-05",
    },
    {
      nip: "260125303",
      nik: "3210990011223344",
      namaLengkap: "Hendra Gunawan",
      jalurMasuk: "UMUM",
      posisi: "Susun",
      sektor: 8,
      regu: 2,
      status: "AKTIF",
      tanggalMasuk: "2026-01-25",
    },
    {
      nip: "260120107",
      nik: "3211001122334455",
      namaLengkap: "Lestari Ningrum",
      jalurMasuk: "LPK",
      posisi: "Sortir",
      sektor: 9,
      regu: 1,
      status: "AKTIF",
      tanggalMasuk: "2026-01-20",
    },
  ];

  const insertedEmployees = await db
    .insert(employees)
    .values(employeeData)
    .returning();
  console.log(`   ✅ ${insertedEmployees.length} employees created`);

  // --- Seed Contracts ---
  console.log("\n📋 Seeding contracts...");
  const contractData = insertedEmployees.map((emp) => {
    const start = new Date(emp.tanggalMasuk);
    const end = new Date(start);
    // Mix up contract end dates for variety
    if (emp.status === "AKTIF") {
      // Some expire soon, some later
      const daysToAdd =
        emp.sektor <= 3 ? 15 : emp.sektor <= 6 ? 60 : 180;
      end.setDate(end.getDate() + daysToAdd + 365);
    } else {
      end.setFullYear(end.getFullYear() + 1);
    }

    return {
      employeeId: emp.id,
      tipeKontrak: "PKWT_1" as const,
      tanggalMulai: emp.tanggalMasuk,
      tanggalSelesai: end.toISOString().split("T")[0],
      status: emp.status === "AKTIF" ? "AKTIF" : ("SELESAI" as string),
    };
  });

  await db.insert(contracts).values(contractData);
  console.log(`   ✅ ${contractData.length} contracts created`);

  // --- Seed Resignations ---
  console.log("\n🚪 Seeding resignations...");
  const resignedEmps = insertedEmployees.filter((e) => e.status === "NON_AKTIF");
  const resignTypes = ["NORMAL", "PHK", "MENDADAK", "TANPA_BERITA"] as const;
  const resignData = resignedEmps.map((emp, idx) => ({
    employeeId: emp.id,
    tipe: resignTypes[idx % resignTypes.length],
    tanggalResign: emp.tanggalKeluar!,
    alasan: ["Pindah kerja", "Pelanggaran berat", "Tidak ada kabar", "Keluarga"][idx % 4],
    statusClearance: idx === 0 ? "DALAM_PROSES" : "PENDING",
  }));

  const insertedResignations = await db
    .insert(resignations)
    .values(resignData)
    .returning();
  console.log(`   ✅ ${insertedResignations.length} resignations created`);

  // --- Seed Clearance Items ---
  console.log("\n✅ Seeding clearance items...");
  let clearanceCount = 0;
  for (const resign of insertedResignations) {
    const items = [
      {
        resignationId: resign.id,
        namaItem: "Pengembalian ID Card",
        deskripsi: "Diserahkan ke Kantor",
        status: resign.statusClearance === "DALAM_PROSES" ? "VERIFIED" : "PENDING",
      },
      {
        resignationId: resign.id,
        namaItem: "Alat Pelindung Diri (APD)",
        deskripsi: "Seragam, Sepatu, Haircup, Apron",
        status: "PENDING",
      },
      {
        resignationId: resign.id,
        namaItem: "Serah Terima Tugas",
        deskripsi: "Koordinasi dengan Tim",
        status: "PENDING",
      },
    ];
    await db.insert(clearanceItems).values(items);
    clearanceCount += items.length;
  }
  console.log(`   ✅ ${clearanceCount} clearance items created`);

  // --- Seed Penalties ---
  console.log("\n⚖️ Seeding penalties...");
  const penaltyData = [
    {
      employeeId: insertedEmployees[2].id,
      alasan: "Hilang Apron",
      jumlah: 50000,
      status: "BELUM_BAYAR",
      tanggalDenda: "2026-03-20",
    },
    {
      employeeId: insertedEmployees[3].id,
      alasan: "Resign Mendadak",
      jumlah: 125000,
      status: "BELUM_BAYAR",
      tanggalDenda: "2026-03-18",
    },
    {
      employeeId: insertedEmployees[4].id,
      alasan: "Hilang ID Card",
      jumlah: 25000,
      status: "LUNAS",
      tanggalDenda: "2026-03-15",
    },
  ];

  await db.insert(penalties).values(penaltyData);
  console.log(`   ✅ ${penaltyData.length} penalties created`);

  // --- Seed APD Items ---
  console.log("\n🦺 Seeding APD items...");
  const apdData = [];
  const apdTypes = ["Seragam", "Sepatu", "Haircup", "Apron", "ID Card"] as const;
  const deposits = [50000, 75000, 15000, 25000, 10000];

  for (const emp of insertedEmployees.filter((e) => e.status === "AKTIF")) {
    for (let i = 0; i < apdTypes.length; i++) {
      apdData.push({
        employeeId: emp.id,
        jenisApd: apdTypes[i],
        status: "DIPINJAM" as const,
        depositAmount: deposits[i],
        tanggalPinjam: emp.tanggalMasuk,
      });
    }
  }

  await db.insert(apdItems).values(apdData);
  console.log(`   ✅ ${apdData.length} APD items created`);

  // --- Seed Activity Logs ---
  console.log("\n📝 Seeding activity logs...");
  const logData = [
    {
      employeeId: insertedEmployees[0].id,
      tipeAktivitas: "ONBOARDING",
      deskripsi: `${insertedEmployees[0].namaLengkap} Onboarded`,
      detail: `Sektor ${insertedEmployees[0].sektor} • LPK`,
    },
    {
      employeeId: insertedEmployees[5].id,
      tipeAktivitas: "DOCUMENT_UPLOAD",
      deskripsi: `${insertedEmployees[5].namaLengkap} Verifikasi Dokumen`,
      detail: `Sektor ${insertedEmployees[5].sektor}`,
    },
    {
      employeeId: insertedEmployees[2].id,
      tipeAktivitas: "PENALTY",
      deskripsi: "Pinalti Diterbitkan",
      detail: `${insertedEmployees[2].namaLengkap} • Hilang Apron`,
    },
    {
      employeeId: insertedEmployees[1].id,
      tipeAktivitas: "OFFBOARDING",
      deskripsi: `${insertedEmployees[1].namaLengkap} Resign (PHK)`,
      detail: "Pelanggaran berat",
    },
    {
      employeeId: insertedEmployees[6].id,
      tipeAktivitas: "CONTRACT_UPDATE",
      deskripsi: `Kontrak ${insertedEmployees[6].namaLengkap} Diperbarui`,
      detail: "PKWT_1 → PKWT_2",
    },
  ];

  await db.insert(activityLogs).values(logData);
  console.log(`   ✅ ${logData.length} activity logs created`);

  console.log("\n🎉 Seeding complete!\n");
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
