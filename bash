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

qxBtLO4pt71rXqW3 //dbpass

postgresql://postgres:qxBtLO4pt71rXqW3@db.rnzjjmwcpiudgwcuyzau.supabase.co:5432/postgres

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hr_sigma
BETTER_AUTH_SECRET=k8sJ3mFpQ2xR7vN9bY4wA6tU1hL5eOiG0cDfZ8qXnMjKrSaVbWuEyCpIoTlHgRd
BETTER_AUTH_URL=http://localhost:3000
