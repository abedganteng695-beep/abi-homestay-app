"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "@/app/actions";

interface UserSession {
  id: string;
  username: string;
  name: string;
  role: "ADMIN" | "EDIT" | "VIEW";
}

// helper --------------------------------------------------------------------------
// function untuk menampilkan navigasi aplikasi (TopAppBar, BottomNavBar, SideNav, Profil & Logout)
// input param : none
// output : React component JSX Navigasi
// end of helper ------------------------------------------------------------------
export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [formattedDate, setFormattedDate] = useState("Senin, 24 Mei 2024");
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const today = new Date().toLocaleDateString("id-ID", options);
    setFormattedDate(today);

    // Memuat profil pengguna aktif dari cookie sesi
    getCurrentUser().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
  }, [pathname]);

  // helper --------------------------------------------------------------------------
  // function untuk menangani aksi logout pengguna
  // input param : none
  // output : void (menghapus cookie dan mengarahkan ke /login)
  // end of helper ------------------------------------------------------------------
  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { label: "Beranda", href: "/", icon: "home" },
    { label: "Kamar", href: "/kamar", icon: "bed" },
    { label: "Penghuni", href: "/penghuni", icon: "group" },
    { label: "Laporan", href: "/laporan", icon: "analytics" },
    { label: "Pengaturan", href: "/pengaturan", icon: "settings" },
  ];

  const getTitle = () => {
    switch (pathname) {
      case "/kamar":
        return "Manajemen Kamar";
      case "/penghuni":
        return "Daftar Penghuni";
      case "/laporan":
        return "Laporan Keuangan";
      case "/pengaturan":
        return "Pengaturan";
      default:
        return "Beranda";
    }
  };

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-primary-container text-on-primary-fixed-variant border-primary-fixed-dim/40";
      case "EDIT":
        return "bg-secondary-container/40 text-secondary border-secondary/30";
      default:
        return "bg-surface-container-high text-outline border-outline-variant/40";
    }
  };

  return (
    <>
      {/* TopAppBar (Mobile & Tablet) */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-md py-sm bg-surface/80 backdrop-blur-md shadow-sm transition-colors duration-200 md:hidden">
        <div className="flex items-center gap-sm">
          <div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
              {getTitle()}
            </h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {formattedDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentUser && (
            <div className="flex items-center gap-1.5 bg-surface-container/80 border border-outline-variant/40 px-2.5 py-1 rounded-full">
              <span className="text-[11px] font-bold text-on-surface">
                {currentUser.name}
              </span>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${getRoleBadgeStyle(currentUser.role)}`}>
                {currentUser.role}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Keluar / Logout"
            className="p-2 rounded-full hover:bg-error-container/40 text-error transition-all duration-300"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </header>

      {/* Desktop SideNav */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-surface shadow-sm z-40 pt-md px-4 pb-4 border-r border-outline-variant/30">
        <div className="flex items-center gap-2 mb-xl px-2">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shadow-soft-teal">
            <span className="material-symbols-outlined text-white text-sm" data-icon="apartment">
              apartment
            </span>
          </div>
          <span className="font-headline-md text-headline-md text-primary font-bold">
            Abi Homestay
          </span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "text-secondary bg-secondary-container/20 font-semibold"
                    : "text-on-surface-variant hover:bg-surface-variant/50"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="font-label-md text-label-md">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout Box Footer */}
        <div className="pt-4 border-t border-outline-variant/30">
          {currentUser ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary font-bold text-sm shrink-0 border border-secondary/30">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-label-md font-bold text-on-surface truncate">
                    {currentUser.name}
                  </span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded border w-fit ${getRoleBadgeStyle(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Keluar aplikasi"
                className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/30 transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-secondary text-on-secondary font-semibold rounded-xl text-label-md shadow-soft-teal hover:bg-on-secondary-fixed-variant transition-all"
            >
              <span className="material-symbols-outlined text-lg">login</span>
              <span>Masuk Aplikasi</span>
            </Link>
          )}
        </div>
      </aside>

      {/* BottomNavBar (Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-1 sm:px-3 pb-safe pt-1.5 bg-surface/90 backdrop-blur-xl shadow-[0px_-4px_20px_rgba(15,23,42,0.05)] rounded-t-xl md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center px-1.5 sm:px-3 py-1 transition-all duration-300 ${
                isActive
                  ? "text-secondary bg-secondary-container/30 rounded-xl font-bold"
                  : "text-on-surface-variant hover:text-secondary-fixed-variant"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px] sm:text-[24px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium leading-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
