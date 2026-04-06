# 1. Start PostgreSQL

docker compose up -d

# 2. Generate & run migrations

npx drizzle-kit generate
npx drizzle-kit migrate

# 3. Start dev server

npm run dev

# 4. Seed database (di terminal terpisah)

npx tsx scripts/seed.ts

# 5. Login di http://localhost:3000/login

# Email: admin@hrsigma.local

# Password: admin123
