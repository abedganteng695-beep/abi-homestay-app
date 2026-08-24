"use client";

import { useEffect, useState, useTransition } from "react";
import { getTenants, addTenant, deleteTenant } from "../actions";

interface Room {
  id: string;
  number: string;
}

interface Tenant {
  id: string;
  name: string;
  phone: string;
  roomId: string;
  room: Room;
  status: "ACTIVE" | "EXPIRING_SOON" | "INACTIVE";
  dateIn: Date;
  dateDue: Date | null;
  rentType: string;
  rentAmount: number;
}

// helper --------------------------------------------------------------------------
// function Halaman Manajemen Penghuni
// input param : none
// output : React Client Component JSX
// end of helper ------------------------------------------------------------------
export default function PenghuniPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("semua");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form states
  const [newName, setNewName] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [newPhone, setNewPhone] = useState("");

  useEffect(() => {
    fetchTenants();
  }, [search, filter]);

  const fetchTenants = async () => {
    const data = await getTenants(search, filter);
    setTenants(data as unknown as Tenant[]);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("roomNumber", newRoom);
    formData.append("phone", newPhone);

    startTransition(async () => {
      await addTenant(formData);
      setNewName("");
      setNewRoom("");
      setNewPhone("");
      setIsAddOpen(false);
      await fetchTenants();
    });
  };

  const handleDelete = (tenantId: string) => {
    startTransition(async () => {
      await deleteTenant(tenantId);
      setSelectedTenant(null);
      await fetchTenants();
    });
  };

  return (
    <main className="pt-[88px] px-4 md:px-6 max-w-container-max mx-auto md:ml-64 pb-32">
      {/* Header & Search */}
      <div className="mb-md animate-slide-up stagger-1">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-surface-container-low border border-surface-variant text-body-md font-body-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-outline"
            placeholder="Cari nama atau nomor kamar..."
            type="text"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex overflow-x-auto hide-scrollbar gap-sm mb-md pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        {[
          { key: "semua", label: "Semua" },
          { key: "aktif", label: "Aktif" },
          { key: "akan_jatuh_tempo", label: "Akan Jatuh Tempo" },
          { key: "non_aktif", label: "Non-aktif" },
        ].map((chip) => {
          const isActive = filter === chip.key;
          return (
            <button
              key={chip.key}
              onClick={() => setFilter(chip.key)}
              className={`shrink-0 px-4 py-2 rounded-full font-label-md text-label-md transition-all ${
                isActive
                  ? "bg-brand-teal text-white shadow-[0_4px_12px_rgba(13,148,136,0.2)]"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Tenant List */}
      <div className="space-y-4">
        {tenants.map((t, idx) => {
          const isExpiring = t.status === "EXPIRING_SOON";
          const isInactive = t.status === "INACTIVE";

          return (
            <div
              key={t.id}
              onClick={() => setSelectedTenant(t)}
              className={`tenant-card swipe-action-wrapper shadow-[0px_4px_20px_rgba(15,23,42,0.05)] rounded-2xl bg-surface-container-low animate-slide-up`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="swipe-content p-4 rounded-2xl flex items-center gap-4 cursor-pointer">
                <div className="relative w-14 h-14 shrink-0 bg-surface-variant rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline text-2xl">
                    {isInactive ? "person_off" : "person"}
                  </span>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface ${
                      isExpiring
                        ? "bg-error animate-pulse-soft"
                        : isInactive
                        ? "bg-outline"
                        : "bg-[#25D366]"
                    }`}
                  ></div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-headline-md text-body-lg text-primary truncate">
                    {t.name}
                  </h3>
                  <p className="font-body-md text-label-sm text-on-surface-variant truncate">
                    {t.phone}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="px-2 py-1 bg-surface-container rounded-md font-label-sm text-label-sm text-primary">
                    Kamar {t.room?.number || "--"}
                  </span>
                  <span
                    className={`font-label-sm text-[10px] font-bold tracking-wider uppercase ${
                      isExpiring
                        ? "text-error"
                        : isInactive
                        ? "text-outline"
                        : "text-outline"
                    }`}
                  >
                    {isExpiring
                      ? "Akan Jatuh Tempo"
                      : isInactive
                      ? "Non-aktif"
                      : "Aktif"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAddOpen(true)}
        className="fixed bottom-24 right-4 md:right-8 w-14 h-14 bg-secondary text-on-secondary rounded-2xl shadow-[0_8px_24px_rgba(13,148,136,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 animate-slide-up"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Overlay */}
      {(selectedTenant || isAddOpen) && (
        <div
          onClick={() => {
            setSelectedTenant(null);
            setIsAddOpen(false);
          }}
          className="fixed inset-0 bg-primary/40 z-[60] backdrop-blur-sm transition-opacity"
        ></div>
      )}

      {/* Profile Details Bottom Sheet */}
      {selectedTenant && (
        <div className="fixed bottom-0 left-0 w-full bg-surface rounded-t-3xl z-[70] shadow-[0_-8px_30px_rgba(0,0,0,0.1)] max-h-[90vh] overflow-y-auto hide-scrollbar pb-safe md:max-w-md md:left-1/2 md:-translate-x-1/2 md:rounded-t-2xl animate-slide-up">
          <div
            className="w-full flex justify-center pt-4 pb-2 cursor-pointer"
            onClick={() => setSelectedTenant(null)}
          >
            <div className="w-12 h-1.5 bg-outline-variant rounded-full"></div>
          </div>

          <div className="px-6 pb-8">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-headline-md mb-3">
                <span className="material-symbols-outlined text-4xl">person</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-primary text-center">
                {selectedTenant.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 bg-surface-container rounded-lg font-label-md text-label-md text-on-surface-variant">
                  Kamar {selectedTenant.room?.number || "--"}
                </span>
                <span className="px-3 py-1 bg-error-container text-on-error-container rounded-lg font-label-md text-label-md font-bold">
                  {selectedTenant.status}
                </span>
              </div>
            </div>

            <a
              href={`https://wa.me/${selectedTenant.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 rounded-xl bg-[#25D366] text-white font-label-md text-label-md flex items-center justify-center gap-2 mb-6 shadow-[0_4px_16px_rgba(37,211,102,0.3)] active:scale-95 transition-transform"
            >
              Hubungi via WhatsApp
            </a>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-variant">
                <span className="material-symbols-outlined text-outline mb-2">calendar_today</span>
                <p className="font-label-sm text-label-sm text-outline mb-1">Tanggal Masuk</p>
                <p className="font-body-md text-body-md text-primary font-semibold">
                  {new Date(selectedTenant.dateIn).toLocaleDateString("id-ID")}
                </p>
              </div>

              <div className="bg-error-container/20 rounded-2xl p-4 border border-error-container">
                <span className="material-symbols-outlined text-error mb-2">event_busy</span>
                <p className="font-label-sm text-label-sm text-error mb-1">Jatuh Tempo</p>
                <p className="font-body-md text-body-md text-primary font-semibold">
                  {selectedTenant.dateDue
                    ? new Date(selectedTenant.dateDue).toLocaleDateString("id-ID")
                    : "-"}
                </p>
              </div>

              <div className="col-span-2 bg-surface-container-low rounded-2xl p-4 border border-surface-variant flex items-center justify-between">
                <div>
                  <p className="font-label-sm text-label-sm text-outline mb-1">Tipe Sewa</p>
                  <p className="font-body-md text-body-md text-primary font-semibold">
                    {selectedTenant.rentType} (Rp {selectedTenant.rentAmount.toLocaleString("id-ID")})
                  </p>
                </div>
                <span className="material-symbols-outlined text-secondary">payments</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => handleDelete(selectedTenant.id)}
                disabled={isPending}
                className="w-full py-3 rounded-xl bg-error-container/20 border border-error-container text-error font-label-md text-label-md hover:bg-error-container/40 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">person_remove</span>
                Hapus Penghuni
              </button>
              <button
                onClick={() => setSelectedTenant(null)}
                className="w-full py-3 rounded-xl bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-variant transition-colors"
              >
                Kembali ke Daftar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tenant Bottom Sheet */}
      {isAddOpen && (
        <div className="fixed bottom-0 left-0 w-full bg-surface rounded-t-3xl z-[70] shadow-[0_-8px_30px_rgba(0,0,0,0.1)] pb-safe md:max-w-md md:left-1/2 md:-translate-x-1/2 md:rounded-t-2xl animate-slide-up">
          <div
            className="w-full flex justify-center pt-4 pb-2 cursor-pointer"
            onClick={() => setIsAddOpen(false)}
          >
            <div className="w-12 h-1.5 bg-outline-variant rounded-full"></div>
          </div>

          <div className="px-6 pb-8 pt-2">
            <h3 className="font-headline-md text-headline-md text-primary mb-6">
              Tambah Penghuni Baru
            </h3>
            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
              <div>
                <label className="font-label-sm text-on-surface-variant mb-1 block">Nama</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-variant focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-body-md"
                  placeholder="Nama Lengkap"
                />
              </div>

              <div>
                <label className="font-label-sm text-on-surface-variant mb-1 block">Nomor Kamar</label>
                <input
                  type="text"
                  required
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-variant focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-body-md"
                  placeholder="Contoh: 15 atau Kamar 15"
                />
              </div>

              <div>
                <label className="font-label-sm text-on-surface-variant mb-1 block">Nomor HP</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-variant focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-body-md"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 mt-2 rounded-xl bg-brand-teal text-white font-label-md text-label-md shadow-md flex items-center justify-center gap-2 hover:bg-brand-deep-blue transition-colors"
              >
                <span className="material-symbols-outlined text-lg">person_add</span>
                {isPending ? "Menyimpan..." : "Simpan Penghuni"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
