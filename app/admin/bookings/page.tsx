"use client";

import { useEffect, useState, useMemo } from "react";
import { ConfirmBookingButton, DeleteBookingButton, CheckInBookingButton } from "@/components/admin/action-buttons";
import { Booking } from "@/lib/types";
import { 
  HiOutlineUserGroup, 
  HiOutlineClock, 
  HiOutlineCheckCircle, 
  HiOutlineGlobeAlt,
  HiOutlineSearch
} from "react-icons/hi";
import clsx from "clsx";

export default function BookingsAdmin() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'active' | 'completed' | 'all'>('upcoming');
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/bookings/list");
        const data = await res.json();
        setAllBookings(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredBookings = useMemo(() => {
    let list = allBookings;
    
    // Status Filter
    if (filter === 'upcoming') {
      list = list.filter(b => b.status === 'pending' || b.status === 'confirmed');
    } else if (filter === 'active') {
      list = list.filter(b => b.status === 'checked_in');
    } else if (filter === 'completed') {
      list = list.filter(b => b.status === 'checked_out');
    }

    // Search Filter
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(b => 
        b.guest_name.toLowerCase().includes(q) || 
        (b.room_name && b.room_name.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allBookings, filter, search]);

  const stats = useMemo(() => ({
    upcoming: allBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
    active: allBookings.filter(b => b.status === 'checked_in').length,
    completed: allBookings.filter(b => b.status === 'checked_out').length
  }), [allBookings]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif text-white">Booking Management</h1>
          <p className="text-slate-400 mt-1">Monitor and manage guest cycles from arrival to departure.</p>
        </div>
        
        <div className="relative w-full md:w-72 group">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-gold-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search guests or rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50 transition-all shadow-inner"
          />
        </div>
      </header>

      {/* Tabs / Filters */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 w-fit">
        {[
          { id: 'upcoming', label: 'Upcoming', icon: HiOutlineClock, count: stats.upcoming },
          { id: 'active', label: 'In-House', icon: HiOutlineUserGroup, count: stats.active },
          { id: 'completed', label: 'Completed', icon: HiOutlineCheckCircle, count: stats.completed },
          { id: 'all', label: 'All Records', icon: HiOutlineGlobeAlt, count: allBookings.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as 'upcoming' | 'active' | 'completed' | 'all')}
            className={clsx(
              "flex items-center gap-3 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
              filter === tab.id 
                ? "bg-gold-500 text-slate-950 shadow-lg shadow-gold-500/20" 
                : "text-slate-500 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon className="text-lg" />
            {tab.label}
            <span className={clsx(
              "ml-1 px-2 py-0.5 rounded-md text-[10px]",
              filter === tab.id ? "bg-slate-950/20" : "bg-white/5"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Guest Details</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Room</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Stay Period</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Status</th>
                <th className="px-6 py-5 text-right text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                   <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-500 font-serif italic">
                         <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                         Synchronizing with Database...
                      </div>
                   </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center text-slate-600 italic font-serif">
                    No {filter} reservations found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking: Booking) => (
                  <tr key={booking.id} className="hover:bg-white/1 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 font-bold border border-gold-500/20">
                          {booking.guest_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium group-hover:text-gold-500 transition-colors">{booking.guest_name}</p>
                          <p className="text-slate-500 text-[10px] font-light uppercase tracking-tighter">{booking.guest_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-slate-200 text-sm font-medium">{booking.room_name || 'Unassigned'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xs space-y-1">
                        <p className="text-white flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {new Date(booking.check_in).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </p>
                        <p className="text-slate-500 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          {new Date(booking.check_out).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={clsx(
                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                        booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        booking.status === 'checked_in' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        booking.status === 'checked_out' ? 'bg-slate-500/10 text-slate-500 border-slate-500/20' :
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      )}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        {booking.status === 'pending' && <ConfirmBookingButton id={booking.id} />}
                        {booking.status === 'confirmed' && <CheckInBookingButton id={booking.id} />}
                        <DeleteBookingButton id={booking.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
