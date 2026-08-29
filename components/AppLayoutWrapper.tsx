"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";

// helper --------------------------------------------------------------------------
// function AppLayoutWrapper untuk mengontrol navigasi global dan padding halaman login
// input param : children (React.ReactNode)
// output : React JSX Component Layout Wrapper
// end of helper ------------------------------------------------------------------
export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navigation />}
      <div className={isLoginPage ? "min-h-screen w-full" : "md:pl-64 min-h-screen overflow-x-hidden w-full transition-all"}>
        {children}
      </div>
    </>
  );
}
