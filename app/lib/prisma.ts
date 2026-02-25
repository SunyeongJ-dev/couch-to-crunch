// app/lib/prisma.ts

// Prisma client helps with safe DB queries and hints while typing.
import { PrismaClient } from "@prisma/client";
// Prisma adapter to use a shared Postgres pool.
import { PrismaPg } from "@prisma/adapter-pg";
// Postgres connection pool (reuses connections).
import { Pool } from "pg";

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("Missing POSTGRES_URL in environment variables");
}

// globalThis is the shared global object in JS.
// In dev, keep Prisma in globalThis so hot reloads reuse the same client and pool.
// This prevents piling up database connections.
// We cast globalThis to unknown first to avoid TS errors, then add prisma/pool types.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

// Nullish coalescing operator
export const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
  });
// This equals to:
// let pool;
// if (globalForPrisma.pool !== undefined && globalForPrisma.pool !== null) {
//   pool = globalForPrisma.pool;
// } else {
//   pool = new Pool({ connectionString });
// }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: new PrismaPg(pool) });

// Stores prisma and pool in the global object to reuse them across the app in development.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool;
  globalForPrisma.prisma = prisma;
}
