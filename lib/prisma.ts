import { PrismaClient } from "@prisma/client";

// helper --------------------------------------------------------------------------
// function untuk menginisialisasi singleton PrismaClient pada Next.js Serverless
// input param : none
// output : instance PrismaClient
// end of helper ------------------------------------------------------------------

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.MONGODB_URI ||
  "mongodb+srv://Vercel-Admin-abi-homestay-database:kkwDBHUOc8NFDvQP@abi-homestay-database.x7sw9vu.mongodb.net/abi-homestay?retryWrites=true&w=majority";

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
