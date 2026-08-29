import type { Metadata } from "next";
import "./globals.css";
import AppLayoutWrapper from "@/components/AppLayoutWrapper";

export const metadata: Metadata = {
  title: "Abi Homestay - Manajemen Kost Mudah",
  description: "Aplikasi Manajemen Kost Abi Homestay Terpadu",
};

// helper --------------------------------------------------------------------------
// function RootLayout untuk layout utama aplikasi Abi Homestay
// input param : children (React.ReactNode)
// output : HTML Document React JSX dengan navigasi dan wrapper utama
// end of helper ------------------------------------------------------------------
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background min-h-screen pb-24 md:pb-0">
        <AppLayoutWrapper>{children}</AppLayoutWrapper>
      </body>
    </html>
  );
}

