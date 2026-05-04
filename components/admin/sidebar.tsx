"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HiOutlineChartBar, 
  HiOutlineKey, 
  HiOutlineCalendar, 
  HiOutlinePhotograph, 
  HiOutlineChatAlt2,
  HiOutlineLogout,
  HiOutlineHome,
  HiOutlineClipboardList
} from "react-icons/hi";
import { clsx } from "clsx";

const menuItems = [
  { name: "Overview", icon: HiOutlineChartBar, href: "/admin" },
  { name: "Reception", icon: HiOutlineHome, href: "/admin/reception" },
  { name: "Rooms", icon: HiOutlineKey, href: "/admin/rooms" },
  { name: "Bookings", icon: HiOutlineClipboardList, href: "/admin/bookings" },
  { name: "Gallery", icon: HiOutlinePhotograph, href: "/admin/gallery" },
  { name: "Testimonials", icon: HiOutlineChatAlt2, href: "/admin/testimonials" },
];



import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/auth/sign-in");
  };

  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-gold-500/10 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 border-b border-gold-500/10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-slate-950 font-serif font-bold group-hover:scale-110 transition-transform">
            A
          </div>
          <span className="font-serif text-xl tracking-widest text-gold-500">ADMIN</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
                isActive 
                  ? "bg-gold-500/10 text-gold-500 border border-gold-500/10" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={clsx("text-xl", isActive ? "text-gold-500" : "text-slate-400 group-hover:text-white")} />
              <span className="font-sans font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-500 shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gold-500/10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <HiOutlineLogout className="text-xl" />
          <span className="font-sans font-medium">Logout Admin</span>
        </button>
      </div>
    </aside>
  );
}
