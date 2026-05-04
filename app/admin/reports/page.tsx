import { neon } from "@neondatabase/serverless";
import { 
  HiOutlineTrendingUp, 
  HiOutlineCash,
  HiOutlineChartBar,
  HiOutlineCalendar,
  HiOutlineCheckCircle
} from "react-icons/hi";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getReportData() {
  const sql = neon(process.env.DATABASE_URL || "");
  
  // Fetch completed bookings with room prices
  const bookings = await sql`
    SELECT 
      b.*, 
      r.price as room_price_standard,
      r.name as room_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.status = 'checked_out'
    ORDER BY b.actual_check_out DESC
  `;

  // Aggregate by month
  const monthlyStats: Record<string, { total: number, rooms: number, penalties: number }> = {};
  let totalRevenue = 0;
  let totalPenalties = 0;

  bookings.forEach(b => {
    const date = new Date(b.actual_check_out);
    const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    // Calculate stay duration
    const start = new Date(b.check_in);
    const end = new Date(b.check_out);
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    
    const roomRevenue = nights * (b.room_price || b.room_price_standard);
    const penaltyAmount = Number(b.penalty_fee || 0);

    if (!monthlyStats[monthKey]) {
      monthlyStats[monthKey] = { total: 0, rooms: 0, penalties: 0 };
    }

    monthlyStats[monthKey].total += roomRevenue + penaltyAmount;
    monthlyStats[monthKey].rooms += roomRevenue;
    monthlyStats[monthKey].penalties += penaltyAmount;
    
    totalRevenue += roomRevenue + penaltyAmount;
    totalPenalties += penaltyAmount;
  });

  return {
    bookings,
    monthlyStats: Object.entries(monthlyStats).map(([name, data]) => ({ name, ...data })),
    totalRevenue,
    totalPenalties,
    count: bookings.length
  };
}

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IDR",
    currencyDisplay: "code",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default async function ReportsPage() {
  const data = await getReportData();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif mb-2 bg-linear-to-r from-white to-slate-500 bg-clip-text text-transparent">
            Financial Insights
          </h1>
          <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-bold flex items-center gap-2">
            <HiOutlineChartBar className="text-gold-500" /> Performance & Revenue Reports
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link 
            href="/admin/reception"
            className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest"
          >
            Reception Hub
          </Link>
          <Link 
            href="/admin/bookings"
            className="px-6 py-3 rounded-xl bg-gold-500 text-slate-950 hover:bg-gold-600 transition-all text-sm font-bold uppercase tracking-widest shadow-lg shadow-gold-500/20"
          >
            All Bookings
          </Link>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <HiOutlineTrendingUp size={80} className="text-emerald-500" />
          </div>
          <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold mb-4">Total Revenue</p>
          <p className="text-3xl font-serif font-bold text-emerald-500">{formatIDR(data.totalRevenue)}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <HiOutlineCheckCircle className="text-emerald-500" />
            <span>From {data.count} Completed Stays</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <HiOutlineCash size={80} className="text-amber-500" />
          </div>
          <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold mb-4">Collected Penalties</p>
          <p className="text-3xl font-serif font-bold text-amber-500">{formatIDR(data.totalPenalties)}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <HiOutlineCash className="text-amber-500" />
            <span>Late Check-out Fees</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <HiOutlineCalendar size={80} className="text-blue-500" />
          </div>
          <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold mb-4">Active Months</p>
          <p className="text-3xl font-serif font-bold text-blue-500">{data.monthlyStats.length}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <HiOutlineTrendingUp className="text-blue-500" />
            <span>Operational History</span>
          </div>
        </div>
      </div>

      {/* Revenue Trend Visualizer */}
      <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-xl font-serif">Revenue Performance Trend</h2>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                <span>Total Income</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
                <span>Penalties</span>
             </div>
          </div>
        </div>

        <div className="flex items-end gap-4 h-[300px]">
          {data.monthlyStats.map((stat, idx) => {
            const maxVal = Math.max(...data.monthlyStats.map(s => s.total));
            const totalHeight = (stat.total / maxVal) * 100;
            const penaltyPercent = (stat.penalties / stat.total) * 100;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="relative w-full h-full flex items-end">
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                    <div className="bg-slate-800 border border-white/10 p-3 rounded-xl shadow-2xl text-center min-w-[140px]">
                      <p className="text-[10px] text-slate-500 mb-1">{stat.name}</p>
                      <p className="text-sm font-bold text-white">{formatIDR(stat.total)}</p>
                    </div>
                  </div>

                  <div 
                    className="w-full bg-emerald-500/20 rounded-t-lg transition-all duration-700 group-hover:bg-emerald-500/30 overflow-hidden"
                    style={{ height: `${totalHeight}%` }}
                  >
                    <div 
                      className="w-full bg-amber-500/50"
                      style={{ height: `${penaltyPercent}%` }}
                    />
                    <div className="w-full h-full bg-emerald-500/40" />
                  </div>
                </div>
                <p className="text-[10px] uppercase tracking-tighter text-slate-500 font-bold whitespace-nowrap">
                  {stat.name}
                </p>
              </div>
            );
          })}
          {data.monthlyStats.length === 0 && (
            <div className="w-full flex items-center justify-center text-slate-600 italic">
              No completed transactions recorded for trend analysis.
            </div>
          )}
        </div>
      </div>

      {/* Detailed Transaction Log */}
      <div className="space-y-6">
        <h2 className="text-xl font-serif">Recent Settlements</h2>
        <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/2 border-b border-white/5">
              <tr>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Room & Guest</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Stay Period</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Total Settled</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Penalty</th>
                <th className="p-6 text-right text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.bookings.map((booking) => {
                const start = new Date(booking.check_in);
                const end = new Date(booking.check_out);
                const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
                const roomRev = nights * (booking.room_price || booking.room_price_standard);
                const total = roomRev + Number(booking.penalty_fee || 0);

                return (
                  <tr key={booking.id} className="hover:bg-white/1 transition-colors group">
                    <td className="p-6">
                      <p className="text-sm font-bold text-white group-hover:text-gold-500 transition-colors">{booking.room_name}</p>
                      <p className="text-xs text-slate-500 italic">{booking.guest_name}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <HiOutlineCalendar className="text-gold-500" />
                        {new Date(booking.check_in).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - 
                        {new Date(booking.actual_check_out).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-bold text-emerald-500">{formatIDR(total)}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{nights} Nights Stay</p>
                    </td>
                    <td className="p-6">
                      {booking.penalty_fee > 0 ? (
                        <p className="text-sm font-bold text-amber-500">+{formatIDR(booking.penalty_fee)}</p>
                      ) : (
                        <p className="text-xs text-slate-700 italic">No Penalty</p>
                      )}
                    </td>
                    <td className="p-6 text-right">
                       <button className="text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-white transition-all px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5">
                          View Invoice
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {data.bookings.length === 0 && (
             <div className="p-20 text-center text-slate-600 font-serif italic">
                No financial history available yet. Complete a check-out to see data here.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
