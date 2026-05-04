import { sql } from "@/lib/db";
import Link from "next/link";
import { 
  HiOutlineKey, 
  HiOutlineCalendar, 
  HiOutlineCurrencyDollar, 
  HiOutlineUsers 
} from "react-icons/hi";

async function getStats() {
  if (!sql) return { roomCount: 0, bookingCount: 0, totalRevenue: 0, testimonialCount: 0 };

  const rooms = await sql`SELECT COUNT(*) as count FROM rooms` as unknown as { count: string }[];
  const bookings = await sql`SELECT COUNT(*) as count FROM bookings` as unknown as { count: string }[];
  const revenue = await sql`SELECT SUM(rooms.price) as total 
                            FROM bookings 
                            JOIN rooms ON bookings.room_id = rooms.id 
                            WHERE bookings.status = 'confirmed'` as unknown as { total: string | null }[];
  const testimonials = await sql`SELECT COUNT(*) as count FROM testimonials` as unknown as { count: string }[];

  return {
    roomCount: Number(rooms[0]?.count || 0),
    bookingCount: Number(bookings[0]?.count || 0),
    totalRevenue: Number(revenue[0]?.total || 0),
    testimonialCount: Number(testimonials[0]?.count || 0)
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { name: "Total Rooms", value: stats.roomCount, icon: HiOutlineKey, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Total Bookings", value: stats.bookingCount, icon: HiOutlineCalendar, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: HiOutlineCurrencyDollar, color: "text-gold-500", bg: "bg-gold-500/10" },
    { name: "Testimonials", value: stats.testimonialCount, icon: HiOutlineUsers, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-serif text-white">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">Welcome back. Here's what's happening at Aureum Grand.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="p-6 rounded-2xl bg-slate-900 border border-gold-500/5 hover:border-gold-500/20 transition-all group">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="text-2xl" />
              </div>
              <div>
                <p className="text-sm font-sans text-slate-500 uppercase tracking-wider">{stat.name}</p>
                <p className="text-2xl font-serif text-white mt-0.5">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl bg-slate-900 border border-gold-500/5">
          <h2 className="text-xl font-serif text-white mb-6">Recent Bookings</h2>
          <div className="space-y-4">
            {/* Mock or actual recent bookings */}
            <p className="text-slate-500 italic">No recent bookings to display.</p>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900 border border-gold-500/5">
          <h2 className="text-xl font-serif text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/rooms/new" className="p-4 rounded-xl border border-gold-500/10 hover:border-gold-500/30 hover:bg-gold-500/5 transition-all text-left">
              <span className="block text-gold-500 font-medium mb-1">Add Room</span>
              <span className="text-xs text-slate-500">Create a new room listing</span>
            </Link>
            <Link href="/admin/bookings/walk-in" className="p-4 rounded-xl border border-emerald-500/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-left">
              <span className="block text-emerald-500 font-medium mb-1">Walk-in</span>
              <span className="text-xs text-slate-500">Direct check-in for guests</span>
            </Link>
            <Link href="/admin/gallery" className="p-4 rounded-xl border border-gold-500/10 hover:border-gold-500/30 hover:bg-gold-500/5 transition-all text-left">
              <span className="block text-gold-500 font-medium mb-1">New Post</span>
              <span className="text-xs text-slate-500">Update gallery or news</span>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
