"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// helper --------------------------------------------------------------------------
// function untuk menampilkan navigasi aplikasi (TopAppBar, BottomNavBar, SideNav)
// input param : none (menggunakan hook usePathname)
// output : React component JSX Navigasi
// end of helper ------------------------------------------------------------------
export default function Navigation() {
  const pathname = usePathname();

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

  return (
    <>
      {/* TopAppBar (Mobile & Tablet) */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-md py-sm bg-surface/80 backdrop-blur-md shadow-sm md:hidden">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
            {getTitle()}
          </h1>
          {pathname === "/" && (
            <p className="font-body-md text-sm text-on-surface-variant">
              Senin, 24 Mei 2024
            </p>
          )}
        </div>
        <button className="relative p-2 rounded-full hover:bg-surface-variant/20 transition-all duration-300">
          <span className="material-symbols-outlined text-primary" data-icon="notifications">
            notifications
          </span>
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface animate-pulse"></span>
        </button>
      </header>

      {/* Desktop SideNav */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-surface shadow-sm z-40 pt-md px-4 pb-4">
        <div className="flex items-center gap-2 mb-xl px-2">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
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
      </aside>

      {/* BottomNavBar (Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-sm pb-safe pt-2 bg-surface/90 backdrop-blur-xl shadow-[0px_-4px_20px_rgba(15,23,42,0.05)] rounded-t-xl md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center px-4 py-1 transition-all duration-300 ${
                isActive
                  ? "text-secondary bg-secondary-container/30 rounded-xl animate-bounce-gentle"
                  : "text-on-surface-variant hover:text-secondary-fixed-variant hover:-translate-y-1"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label-sm text-label-sm mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
