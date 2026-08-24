const { PrismaClient } = require('@prisma/client');

// Connect specifically to abi-homestay
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mongodb+srv://Vercel-Admin-abi-homestay-database:kkwDBHUOc8NFDvQP@abi-homestay-database.x7sw9vu.mongodb.net/abi-homestay?retryWrites=true&w=majority"
    }
  }
});

async function main() {
  try {
    const rooms = await prisma.room.findMany();
    console.log(`Found ${rooms.length} rooms in abi-homestay database`);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
