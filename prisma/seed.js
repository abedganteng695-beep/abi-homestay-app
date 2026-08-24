const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// helper --------------------------------------------------------------------------
// function untuk melakukan seeding data awal 58 kamar, penghuni, transaksi, dan setting
// input param : none
// output : void (promise)
// end of helper ------------------------------------------------------------------
async function main() {
  console.log("Memulai seeding database Abi Homestay...");

  // Reset database collections
  await prisma.transaction.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.room.deleteMany();
  await prisma.pricing.deleteMany();
  await prisma.setting.deleteMany();

  // Create default pricing
  await prisma.pricing.create({
    data: {
      dailyPrice: 150000,
      weeklyPrice: 900000,
      monthlyPrice: 2500000,
      yearlyPrice: 28000000,
    },
  });

  // Create default settings
  await prisma.setting.create({
    data: {
      autoWhatsappReminders: true,
    },
  });

  // Define counts: 42 Occupied, 12 Available, 4 Maintenance (Total 58)
  const roomStatusMapping = {};
  
  // Specific Maintenance rooms: 45, 18, 27, 52
  const maintenanceRooms = [45, 18, 27, 52];
  maintenanceRooms.forEach((num) => {
    roomStatusMapping[num] = "MAINTENANCE";
  });

  // Specific Available rooms: 1, 4, 7, 9, 14, 21, 28, 33, 39, 44, 50, 56
  const availableRooms = [1, 4, 7, 9, 14, 21, 28, 33, 39, 44, 50, 56];
  availableRooms.forEach((num) => {
    roomStatusMapping[num] = "AVAILABLE";
  });

  // Create 58 rooms
  const roomsCreated = [];
  for (let i = 1; i <= 58; i++) {
    const roomNumber = i.toString().padStart(2, "0");
    const status = roomStatusMapping[i] || "OCCUPIED";
    const inventoryState =
      status === "MAINTENANCE"
        ? ["perbaikan", "baik", "baik", "baik", "baik"]
        : ["baik", "baik", "baik", "baik", "baik"];

    const room = await prisma.room.create({
      data: {
        number: roomNumber,
        status: status,
        inventories: inventoryState,
      },
    });
    roomsCreated.push(room);
  }

  // Create sample tenants
  const tenantData = [
    {
      name: "Siti Nurhaliza",
      phone: "0812-3456-7890",
      roomNumber: "15",
      status: "EXPIRING_SOON",
      dateIn: new Date("2023-01-12"),
      dateDue: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // H-2
      rentType: "MONTHLY",
      rentAmount: 2500000,
    },
    {
      name: "Budi Santoso",
      phone: "0856-7890-1234",
      roomNumber: "08",
      status: "ACTIVE",
      dateIn: new Date("2023-03-05"),
      dateDue: new Date("2024-12-05"),
      rentType: "MONTHLY",
      rentAmount: 2000000,
    },
    {
      name: "Rina Melati",
      phone: "0821-9876-5432",
      roomNumber: "02",
      status: "ACTIVE",
      dateIn: new Date("2023-06-10"),
      dateDue: new Date("2024-12-10"),
      rentType: "SEMESTERLY",
      rentAmount: 11500000,
    },
    {
      name: "Andi Pratama",
      phone: "0877-1234-5678",
      roomNumber: "10",
      status: "ACTIVE",
      dateIn: new Date("2023-08-20"),
      dateDue: new Date("2024-11-20"),
      rentType: "MONTHLY",
      rentAmount: 2200000,
    },
    {
      name: "Dewi Lestari",
      phone: "0819-3333-4444",
      roomNumber: "05",
      status: "EXPIRING_SOON",
      dateIn: new Date("2023-01-15"),
      dateDue: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // H-5
      rentType: "MONTHLY",
      rentAmount: 2000000,
    },
    {
      name: "Kamar 12 Tenant",
      phone: "0813-1111-2222",
      roomNumber: "12",
      status: "EXPIRING_SOON",
      dateIn: new Date("2023-02-01"),
      dateDue: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // H-3
      rentType: "MONTHLY",
      rentAmount: 1500000,
    },
    {
      name: "Kamar 45 Tenant",
      phone: "0814-9999-8888",
      roomNumber: "45",
      status: "ACTIVE",
      dateIn: new Date("2023-05-10"),
      dateDue: new Date("2024-11-10"),
      rentType: "MONTHLY",
      rentAmount: 2500000,
    },
  ];

  for (const t of tenantData) {
    const room = roomsCreated.find((r) => r.number === t.roomNumber);
    if (room) {
      const createdTenant = await prisma.tenant.create({
        data: {
          name: t.name,
          phone: t.phone,
          roomId: room.id,
          status: t.status,
          dateIn: t.dateIn,
          dateDue: t.dateDue,
          rentType: t.rentType,
          rentAmount: t.rentAmount,
        },
      });

      // Create transaction for tenant
      await prisma.transaction.create({
        data: {
          refId: `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
          type: "INCOME",
          tenantId: createdTenant.id,
          roomId: room.id,
          rentType: t.rentType,
          amount: t.rentAmount,
          paymentMethod: "TRANSFER",
          date: new Date(),
        },
      });
    }
  }

  console.log("Seeding database Abi Homestay berhasil dilakukan!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
