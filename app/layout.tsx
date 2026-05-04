import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import "./globals.css";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "600"],
});

import LayoutWrapper from "@/components/layout/layout-wrapper";

export const metadata: Metadata = {
  title: "AUREUM GRAND | Luxury Hotels & Resorts",
  description: "Experience the essence of refined luxury at Aureum Grand, where architectural brilliance meets cinematic grandeur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${notoSerif.variable} ${manrope.variable} font-sans antialiased bg-slate-950 text-slate-50 flex flex-col min-h-screen overflow-x-hidden`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
