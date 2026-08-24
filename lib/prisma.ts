import { PrismaClient } from "@prisma/client";

// helper --------------------------------------------------------------------------
// function untuk menginisialisasi singleton PrismaClient pada Next.js
// input param : none
// output : instance PrismaClient
// end of helper ------------------------------------------------------------------

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
