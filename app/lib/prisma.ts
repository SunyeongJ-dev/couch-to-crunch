// app/lib/prisma.ts
// This file sets up the Prisma client with a PostgreSQL adapter. It uses a connection pool to manage database connections efficiently.
// The Prisma client is exported for use in other parts of the application, such as API routes and server-side rendering functions.
// The code also includes logic to ensure that only one instance of the Prisma client and connection pool is created during development, which helps prevent issues with hot reloading in Next.js.
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("Missing POSTGRES_URL in environment variables");
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

export const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
  });

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: new PrismaPg(pool) });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool;
  globalForPrisma.prisma = prisma;
}
