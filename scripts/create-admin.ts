import { Pool } from "pg";
import * as crypto from "crypto";
import { config } from "dotenv";

config({ path: ".env.local" });

async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

async function createAdmin() {
  console.log("🔐 Resetting admin user in Supabase...\n");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const email = "admin@hrsigma.local";
  const password = "admin123";
  const name = "Admin Kurator";
  const userId = crypto.randomUUID();
  const accountId = crypto.randomUUID();

  const hashedPassword = await hashPassword(password);

  try {
    // Step 1: Delete existing user (cascades to accounts/sessions)
    const del = await pool.query("DELETE FROM users WHERE email = $1", [email]);
    if (del.rowCount && del.rowCount > 0) {
      console.log("   🗑️  Deleted existing user");
    }

    // Step 2: Insert fresh user
    await pool.query(
      `INSERT INTO users (id, name, email, email_verified, created_at, updated_at)
       VALUES ($1, $2, $3, true, NOW(), NOW())`,
      [userId, name, email]
    );
    console.log("   ✅ User created:", email);

    // Step 3: Insert credential account (better-auth format)
    await pool.query(
      `INSERT INTO accounts (id, account_id, provider_id, user_id, password, created_at, updated_at)
       VALUES ($1, $2, 'credential', $3, $4, NOW(), NOW())`,
      [accountId, userId, userId, hashedPassword]
    );
    console.log("   ✅ Account with hashed password created");

    // Verify
    const check = await pool.query(
      `SELECT u.id, u.email, a.provider_id, LENGTH(a.password) as pwd_len 
       FROM users u JOIN accounts a ON u.id = a.user_id 
       WHERE u.email = $1`,
      [email]
    );
    console.log("   ✅ Verification:", JSON.stringify(check.rows[0]));

    console.log("\n🎉 Admin user ready!");
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
  } catch (err) {
    console.error("❌ Error:", err);
  }

  await pool.end();
  process.exit(0);
}

createAdmin();
