const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const rooms = await prisma.room.findMany();
    console.log(`Found ${rooms.length} rooms`);
    console.log(rooms.slice(0, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
