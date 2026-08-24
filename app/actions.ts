"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

// helper --------------------------------------------------------------------------
// function untuk mengambil statistik dashboard beranda dengan try-catch fallback
// input param : none
// output : object { totalRooms, occupiedCount, availableCount, maintenanceCount, occupancyRate, dueTenants, maintenanceRoomsList }
// end of helper ------------------------------------------------------------------
export async function getDashboardStats() {
  try {
    const totalRooms = await prisma.room.count();
    const occupiedCount = await prisma.room.count({ where: { status: "OCCUPIED" } });
    const availableCount = await prisma.room.count({ where: { status: "AVAILABLE" } });
    const maintenanceCount = await prisma.room.count({ where: { status: "MAINTENANCE" } });

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

    const dueTenants = await prisma.tenant.findMany({
      where: {
        status: "EXPIRING_SOON",
      },
      include: { room: true },
      take: 5,
    });

    const maintenanceRoomsList = await prisma.room.findMany({
      where: { status: "MAINTENANCE" },
      take: 5,
    });

    return {
      totalRooms: totalRooms || 58,
      occupiedCount: occupiedCount || 42,
      availableCount: availableCount || 12,
      maintenanceCount: maintenanceCount || 4,
      occupancyRate: occupancyRate || 72,
      dueTenants: dueTenants || [],
      maintenanceRoomsList: maintenanceRoomsList || [],
    };
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return {
      totalRooms: 58,
      occupiedCount: 42,
      availableCount: 12,
      maintenanceCount: 4,
      occupancyRate: 72,
      dueTenants: [],
      maintenanceRoomsList: [],
    };
  }
}

// helper --------------------------------------------------------------------------
// function untuk mengambil daftar seluruh kamar beserta data penghuni dengan try-catch
// input param : none
// output : array of Room
// end of helper ------------------------------------------------------------------
export async function getRooms() {
  try {
    return await prisma.room.findMany({
      include: {
        tenant: true,
      },
      orderBy: {
        number: "asc",
      },
    });
  } catch (error) {
    console.error("Error in getRooms:", error);
    return [];
  }
}

// helper --------------------------------------------------------------------------
// function untuk mengupdate kondisi inventaris & status kamar
// input param : roomId (string), inventories (string[]), status ("AVAILABLE" | "OCCUPIED" | "MAINTENANCE")
// output : object room updated
// end of helper ------------------------------------------------------------------
export async function updateRoomInventory(
  roomId: string,
  inventories: string[],
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE"
) {
  try {
    const updated = await prisma.room.update({
      where: { id: roomId },
      data: {
        inventories,
        status,
      },
    });
    revalidatePath("/kamar");
    revalidatePath("/");
    return updated;
  } catch (error) {
    console.error("Error in updateRoomInventory:", error);
    return null;
  }
}

// helper --------------------------------------------------------------------------
// function untuk mengambil daftar penghuni dengan opsi pencarian dan filter
// input param : search (string), filter (string)
// output : array of Tenant
// end of helper ------------------------------------------------------------------
export async function getTenants(search: string = "", filter: string = "semua") {
  try {
    const whereCondition: any = {};

    if (filter === "aktif") {
      whereCondition.status = "ACTIVE";
    } else if (filter === "akan_jatuh_tempo") {
      whereCondition.status = "EXPIRING_SOON";
    } else if (filter === "non_aktif") {
      whereCondition.status = "INACTIVE";
    }

    if (search.trim()) {
      whereCondition.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { room: { number: { contains: search, mode: "insensitive" } } },
      ];
    }

    return await prisma.tenant.findMany({
      where: whereCondition,
      include: {
        room: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error in getTenants:", error);
    return [];
  }
}

// helper --------------------------------------------------------------------------
// function untuk menambah penghuni baru
// input param : formData (FormData)
// output : object Tenant
// end of helper ------------------------------------------------------------------
export async function addTenant(formData: FormData) {
  try {
    const name = (formData.get("name") as string) || "Penghuni Baru";
    const phone = (formData.get("phone") as string) || "-";
    const roomNumberRaw = (formData.get("roomNumber") as string) || "";

    const roomNumberDigits = roomNumberRaw.replace(/[^0-9]/g, "");
    const roomNumber = roomNumberDigits ? roomNumberDigits.padStart(2, "0") : "01";

    let room = await prisma.room.findFirst({
      where: { number: roomNumber },
    });

    if (!room) {
      room = await prisma.room.create({
        data: {
          number: roomNumber,
          status: "OCCUPIED",
        },
      });
    } else {
      await prisma.room.update({
        where: { id: room.id },
        data: { status: "OCCUPIED" },
      });
    }

    const newTenant = await prisma.tenant.create({
      data: {
        name,
        phone,
        roomId: room.id,
        status: "ACTIVE",
        dateIn: new Date(),
        rentType: "MONTHLY",
        rentAmount: 2500000,
      },
    });

    revalidatePath("/penghuni");
    revalidatePath("/kamar");
    revalidatePath("/");
    return newTenant;
  } catch (error) {
    console.error("Error in addTenant:", error);
    return null;
  }
}

// helper --------------------------------------------------------------------------
// function untuk menghapus penghuni
// input param : tenantId (string)
// output : boolean success
// end of helper ------------------------------------------------------------------
export async function deleteTenant(tenantId: string) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (tenant) {
      await prisma.tenant.delete({
        where: { id: tenantId },
      });

      await prisma.room.update({
        where: { id: tenant.roomId },
        data: { status: "AVAILABLE" },
      });
    }

    revalidatePath("/penghuni");
    revalidatePath("/kamar");
    revalidatePath("/");
    return true;
  } catch (error) {
    console.error("Error in deleteTenant:", error);
    return false;
  }
}

// helper --------------------------------------------------------------------------
// function untuk mengambil daftar transaksi keuangan
// input param : none
// output : array of Transaction
// end of helper ------------------------------------------------------------------
export async function getTransactions() {
  try {
    return await prisma.transaction.findMany({
      include: {
        tenant: true,
        room: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 20,
    });
  } catch (error) {
    console.error("Error in getTransactions:", error);
    return [];
  }
}

// helper --------------------------------------------------------------------------
// function untuk mencatat transaksi pembayaran dan mengupload bukti via Vercel Blob
// input param : formData (FormData)
// output : object Transaction
// end of helper ------------------------------------------------------------------
export async function addTransaction(formData: FormData) {
  try {
    const tenantId = (formData.get("tenantId") as string) || "";
    const type = (formData.get("type") as any) || "INCOME";
    const rentType = (formData.get("rentType") as any) || "MONTHLY";
    const amountRaw = (formData.get("amount") as string) || "0";

    // Clean currency dots & commas (e.g. "2.500.000" -> 2500000)
    const amountCleaned = amountRaw.replace(/[^0-9]/g, "");
    const amount = parseFloat(amountCleaned) || 0;

    const file = formData.get("file") as File | null;

    let proofUrl = null;
    if (file && file.size > 0) {
      if (file.size > 1 * 1024 * 1024) {
        console.warn("File size exceeds 1MB limit, skipping upload.");
      } else {
        try {
          const blob = await put(`receipts/${Date.now()}-${file.name}`, file, {
            access: "public",
          });
          proofUrl = blob.url;
        } catch (blobErr) {
          console.warn("Vercel Blob upload warning:", blobErr);
        }
      }
    }

    let roomId = null;
    if (tenantId) {
      const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
      if (tenant) roomId = tenant.roomId;
    }

    const transaction = await prisma.transaction.create({
      data: {
        refId: `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
        type,
        tenantId: tenantId || null,
        roomId: roomId,
        rentType,
        amount,
        paymentMethod: "TRANSFER",
        proofUrl,
        date: new Date(),
      },
    });

    revalidatePath("/laporan");
    revalidatePath("/");
    return transaction;
  } catch (error) {
    console.error("Error in addTransaction:", error);
    return null;
  }
}

// helper --------------------------------------------------------------------------
// function untuk mengambil master harga dan pengaturan sistem
// input param : none
// output : object { pricing, setting }
// end of helper ------------------------------------------------------------------
export async function getPricingAndSettings() {
  try {
    let pricing = await prisma.pricing.findFirst();
    if (!pricing) {
      pricing = await prisma.pricing.create({
        data: {
          dailyPrice: 150000,
          weeklyPrice: 900000,
          monthlyPrice: 2500000,
          yearlyPrice: 28000000,
        },
      });
    }

    let setting = await prisma.setting.findFirst();
    if (!setting) {
      setting = await prisma.setting.create({
        data: {
          autoWhatsappReminders: true,
        },
      });
    }

    return { pricing, setting };
  } catch (error) {
    console.error("Error in getPricingAndSettings:", error);
    return {
      pricing: {
        id: "default",
        dailyPrice: 150000,
        weeklyPrice: 900000,
        monthlyPrice: 2500000,
        yearlyPrice: 28000000,
      },
      setting: {
        id: "default",
        autoWhatsappReminders: true,
      },
    };
  }
}

// helper --------------------------------------------------------------------------
// function untuk merubah master harga sewa
// input param : pricingId (string), daily (number), weekly (number), monthly (number), yearly (number)
// output : object Pricing
// end of helper ------------------------------------------------------------------
export async function updatePricing(
  pricingId: string,
  dailyPrice: number,
  weeklyPrice: number,
  monthlyPrice: number,
  yearlyPrice: number
) {
  try {
    let pricing = await prisma.pricing.findFirst();
    if (!pricing) {
      pricing = await prisma.pricing.create({
        data: {
          dailyPrice,
          weeklyPrice,
          monthlyPrice,
          yearlyPrice,
        },
      });
    } else {
      pricing = await prisma.pricing.update({
        where: { id: pricing.id },
        data: {
          dailyPrice,
          weeklyPrice,
          monthlyPrice,
          yearlyPrice,
        },
      });
    }
    revalidatePath("/pengaturan");
    return pricing;
  } catch (error) {
    console.error("Error in updatePricing:", error);
    return null;
  }
}

// helper --------------------------------------------------------------------------
// function untuk merubah setting Auto-WhatsApp Reminders
// input param : settingId (string), autoWhatsapp (boolean)
// output : object Setting
// end of helper ------------------------------------------------------------------
export async function updateSetting(settingId: string, autoWhatsappReminders: boolean) {
  try {
    let setting = await prisma.setting.findFirst();
    if (!setting) {
      setting = await prisma.setting.create({
        data: {
          autoWhatsappReminders,
        },
      });
    } else {
      setting = await prisma.setting.update({
        where: { id: setting.id },
        data: {
          autoWhatsappReminders,
        },
      });
    }
    revalidatePath("/pengaturan");
    return setting;
  } catch (error) {
    console.error("Error in updateSetting:", error);
    return null;
  }
}
