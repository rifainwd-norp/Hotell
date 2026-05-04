'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import SmoothScroll from "@/components/smooth-scroll";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/admin') || pathname?.startsWith('/auth');

  if (isDashboard) {
    return <main className="grow">{children}</main>;
  }

  return (
    <SmoothScroll>
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
