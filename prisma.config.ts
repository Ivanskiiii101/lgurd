// Prisma 7 no longer loads .env on its own
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {}
}

export default {
  datasource: {
    url: process.env.DATABASE_URL || '',
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
};
