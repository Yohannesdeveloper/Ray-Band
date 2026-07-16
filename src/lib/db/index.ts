import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env["DATABASE_URL"];
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. This usually means the app is being built in an environment without the required environment variables."
    );
  }
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

// Lazy proxy: the Prisma client is only created when first accessed at runtime,
// not at module load time. This prevents build-time crashes on platforms like
// Vercel where DATABASE_URL may not be available during static generation.
function getDb() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export const db = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return Reflect.get(getDb(), prop);
  },
});
