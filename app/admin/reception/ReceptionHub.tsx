"use client";

import { useState, useMemo } from "react";
import { HiOutlineSearch, HiOutlineLogin, HiOutlineCalendar, HiOutlineKey, HiOutlineChartBar, HiOutlinePlus } from "react-icons/hi";
import { CheckInBookingButton, CheckOutBookingButton, ExtendStayButton } from "@/components/admin/action-buttons";
import { Booking, Room } from "@/lib/types";
import clsx from "clsx";
import Link from "next/link";
import { 
  HiOutlineUser, 
  HiOutlineX, 
} from "react-icons/hi";

// Shared IDR Formatter
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IDR",
    currencyDisplay: "code",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function ReceptionHub({ 
  allRooms, 
  allBookings,
  initialArrivals: propArrivals,
  initialStaying: propStaying
}: { 
  allRooms: Room[], 
  allBookings: Booking[],
  initialArrivals?: Booking[],
  initialStaying?: Booking[]
}) {
  const [search, setSearch] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];

  // Use props as initial data if available, fallback to manual filter
  const initialArrivals = useMemo(() => 
    propArrivals || allBookings.filter(b => (b.status === 'confirmed' || b.status === 'pending')),
    [allBookings, propArrivals]
  );

  const initialStaying = useMemo(() => 
    propStaying || allBookings.filter(b => b.status === 'checked_in'),
    [allBookings, propStaying]
  );

  // Status for Room Grid
  const roomStatus = useMemo(() => {
    return allRooms.map(room => {
      const activeBooking = allBookings.find(b => 
        b.room_id === room.id && 
        (b.status === 'checked_in' || (b.status === 'confirmed' && b.check_in <= today))
      );

      return {
        ...room,
        isOccupied: activeBooking?.status === 'checked_in',
        isBooked: activeBooking?.status === 'confirmed',
        guest: activeBooking?.guest_name,
        bookingId: activeBooking?.id,
        checkOutDate: activeBooking?.check_out,
        checkInDate: activeBooking?.check_in
      };
    });

  }, [allRooms, allBookings, today]);

  const selectedRoom = useMemo(() => {
    return roomStatus.find(r => r.id === selectedRoomId);
  }, [roomStatus, selectedRoomId]);

  // Filtering Logic
  const filteredData = useMemo(() => {
    const term = search.toLowerCase();
    
    const matchesSearch = (r: { name: string; tagline?: string; guest?: string }) => 
      r.name.toLowerCase().includes(term) || 
      (r.tagline || "").toLowerCase().includes(term) ||
      (r.guest || "").toLowerCase().includes(term);

    const filteredRooms = roomStatus.filter(matchesSearch);
    
    const filteredArrivals = initialArrivals.filter(b => 
      b.guest_name.toLowerCase().includes(term) || 
      (b.room_name || "").toLowerCase().includes(term)
    );

    return { filteredRooms, filteredArrivals };
  }, [search, roomStatus, initialArrivals]);

  const stats = {
    total: roomStatus.length,
    available: roomStatus.filter(r => !r.isBooked && !r.isOccupied).length,
    arrivals: initialArrivals.length,
    staying: initialStaying.length
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header & Search */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif text-white">Reception Hub</h1>
          <p className="text-slate-400 mt-1">Live room status & guest management.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-80">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
            <input 
              type="text" 
              placeholder="Search Room, Guest, or Type..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-3">
          <Link 
            href="/admin/reports"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-bold text-xs uppercase tracking-widest transition-all"
          >
            <HiOutlineChartBar className="text-lg text-emerald-500" />
            Financial Reports
          </Link>
          <Link 
            href="/admin/bookings/walk-in"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 text-slate-950 hover:bg-gold-600 font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-gold-500/20 active:scale-95"
          >
            <HiOutlinePlus className="text-lg" />
            Add Walk-in
          </Link>
        </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/5 p-6 rounded-2xl">
          <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Total Rooms</p>
          <p className="text-2xl font-serif font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-emerald-500">
          <p className="text-[10px] uppercase tracking-widest mb-1 opacity-60">Available Now</p>
          <p className="text-2xl font-serif font-bold">{stats.available}</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl text-blue-500">
          <p className="text-[10px] uppercase tracking-widest mb-1 opacity-60">Arrivals</p>
          <p className="text-2xl font-serif font-bold">{stats.arrivals}</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl text-amber-500">
          <p className="text-[10px] uppercase tracking-widest mb-1 opacity-60">In-house</p>
          <p className="text-2xl font-serif font-bold">{stats.staying}</p>
        </div>
      </div>

      {/* Detailed Lists Section - ONLY ARRIVALS */}
      <div className="grid grid-cols-1 gap-8">
        {/* Arrivals */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-500">
            <HiOutlineLogin className="text-2xl" />
            <h2 className="text-xl font-serif">Awaiting Arrivals</h2>
          </div>
          <div className="bg-slate-900 rounded-2xl border border-gold-500/5 overflow-hidden shadow-2xl">
            {filteredData.filteredArrivals.length === 0 ? (
              <div className="p-12 text-center text-slate-500 italic text-sm flex flex-col items-center gap-3">
                 <HiOutlineLogin className="text-3xl opacity-20" />
                 No confirmed guests awaiting check-in.
              </div>
            ) : (
              <div className="divide-y divide-gold-500/5 max-h-[400px] overflow-y-auto custom-scrollbar">
                {filteredData.filteredArrivals.map((booking) => {
                  const targetRoom = roomStatus.find(r => r.id === booking.room_id);
                  const isRoomOccupied = targetRoom?.isOccupied;

                  return (
                    <div key={booking.id} className="p-5 hover:bg-white/5 transition-colors flex items-center justify-between gap-4 group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold border border-emerald-500/20 group-hover:scale-110 transition-transform">
                            {booking.guest_name.charAt(0)}
                        </div>
                        <div className="space-y-1">
                          <p className="text-white font-medium text-lg">{booking.guest_name}</p>
                          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest">
                            <span className="text-gold-500 font-bold px-2 py-0.5 bg-gold-500/10 rounded-md border border-gold-500/20">{booking.room_name}</span>
                            <span className="text-slate-500 flex items-center gap-1"><HiOutlineCalendar /> {new Date(booking.check_in).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CheckInBookingButton 
                          id={booking.id} 
                          disabled={isRoomOccupied} 
                          title={isRoomOccupied ? `Currently occupied by ${targetRoom.guest}` : ""}
                          alternativeRoomId={isRoomOccupied ? roomStatus
                            .find(r => !r.isOccupied && !r.isBooked && r.tagline === targetRoom?.tagline && r.id !== booking.room_id)?.id : null
                          }
                          alternativeRoomName={isRoomOccupied ? roomStatus
                            .find(r => !r.isOccupied && !r.isBooked && r.tagline === targetRoom?.tagline && r.id !== booking.room_id)?.name : null
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Visual Room Grid Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-400">
          <HiOutlineKey className="text-2xl" />
          <h2 className="text-xl font-serif">Live Room Status</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {filteredData.filteredRooms.map((room) => (
            <div 
              key={room.id}
              onClick={() => setSelectedRoomId(room.id)}
              className={clsx(
                "p-3 rounded-xl border transition-all duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[140px] cursor-pointer hover:scale-105 active:scale-95",
                room.isOccupied 
                  ? "bg-slate-900 border-amber-500/20 shadow-lg shadow-amber-500/5" 
                  : room.isBooked
                    ? "bg-slate-900 border-blue-500/20 shadow-lg shadow-blue-500/5"
                    : "bg-slate-900 border-emerald-500/20 hover:border-emerald-500/40"
              )}
            >
              <div className="relative z-10 space-y-1">
                <p className={clsx(
                  "text-lg font-serif font-bold",
                  room.isOccupied ? "text-amber-500" : room.isBooked ? "text-blue-500" : "text-emerald-500"
                )}>
                  {room.name.match(/\d+/)?.[0] || room.name.split(' ').pop()}
                </p>
                <p className="text-[8px] uppercase tracking-tighter text-slate-500 font-medium truncate">
                  {room.tagline || 'Room'}
                </p>
                
                {(room.isOccupied || room.isBooked) && (
                  <p className="text-[9px] text-slate-400 truncate mt-1">
                    {room.guest}
                  </p>
                )}
              </div>
              
              {/* Background Accent */}
              <div className={clsx(
                "absolute -right-4 -bottom-4 w-12 h-12 rounded-full blur-2xl opacity-10 transition-all group-hover:scale-150",
                room.isOccupied ? "bg-amber-500" : room.isBooked ? "bg-blue-500" : "bg-emerald-500"
              )} />
            </div>
          ))}
        </div>
      </section>

      {/* Room Selection Sidebar/Overlay (Slide-in) */}
      <AnimatePresence>
        {selectedRoomId && selectedRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-end p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setSelectedRoomId(null)}
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
             />
             <motion.div 
               initial={{ x: "100%" }} 
               animate={{ x: 0 }} 
               exit={{ x: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="relative bg-slate-900 border-l border-white/10 w-full max-w-md h-full shadow-2xl overflow-y-auto custom-scrollbar p-10 flex flex-col"
             >
                <button 
                  onClick={() => setSelectedRoomId(null)}
                  className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                >
                  <HiOutlineX className="text-xl" />
                </button>

                <div className="space-y-12 flex-1">
                   {/* Room Header */}
                   <header>
                      <span className={clsx(
                        "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border",
                        selectedRoom.isOccupied ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                        selectedRoom.isBooked ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : 
                        "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      )}>
                        {selectedRoom.isOccupied ? 'Occupied' : selectedRoom.isBooked ? 'Reserved' : 'Available'}
                      </span>
                      <h2 className="text-4xl font-serif text-white mb-2">{selectedRoom.name}</h2>
                      <p className="text-gold-500 font-bold tracking-widest uppercase text-xs">{selectedRoom.tagline}</p>
                   </header>

                   {/* Guest Details if Occupied */}
                   {(selectedRoom.isOccupied || selectedRoom.isBooked) && (
                      <section className="space-y-6">
                         <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                            <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-slate-900 text-xl font-bold">
                               <HiOutlineUser />
                            </div>
                            <div>
                               <p className="text-slate-500 text-[10px] uppercase tracking-widest">Active Guest</p>
                               <p className="text-xl font-medium text-white">{selectedRoom.guest}</p>
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                               <p className="text-slate-600 text-[10px] uppercase tracking-widest mb-1 flex items-center gap-2">
                                  <HiOutlineCalendar /> Check In
                               </p>
                               <p className="text-sm font-medium">{selectedRoom.checkInDate ? new Date(selectedRoom.checkInDate).toLocaleDateString('en-GB') : '-'}</p>
                            </div>
                            <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                               <p className="text-slate-600 text-[10px] uppercase tracking-widest mb-1 flex items-center gap-2">
                                  <HiOutlineCalendar /> Check Out
                               </p>
                               <p className="text-sm font-medium">{selectedRoom.checkOutDate ? new Date(selectedRoom.checkOutDate).toLocaleDateString('en-GB') : '-'}</p>
                            </div>
                         </div>
                      </section>
                   )}

                   {/* Room Specs */}
                   <section className="grid grid-cols-2 gap-8 text-sm">
                      <div className="space-y-1">
                         <p className="text-slate-500 text-[10px] uppercase tracking-widest">Base Rate</p>
                         <p className="text-white font-bold">{formatIDR(selectedRoom.price)}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-slate-500 text-[10px] uppercase tracking-widest">Capacity</p>
                         <p className="text-white">{selectedRoom.capacity || '2 Adults'}</p>
                      </div>
                   </section>
                </div>

                {/* Actions - FIXED FOOTER */}
                <footer className="pt-8 border-t border-white/5 space-y-4 shrink-0">
                  {selectedRoom.isOccupied && selectedRoom.bookingId ? (
                    <div className="flex flex-col gap-3">
                        <ExtendStayButton id={selectedRoom.bookingId} currentCheckOut={selectedRoom.checkOutDate || ""} />
                        <CheckOutBookingButton 
                          id={selectedRoom.bookingId} 
                          checkInDate={selectedRoom.checkInDate}
                          checkOutDate={selectedRoom.checkOutDate} 
                          roomPrice={selectedRoom.price} 
                        />
                    </div>
                  ) : selectedRoom.isBooked && selectedRoom.bookingId ? (
                    <CheckInBookingButton id={selectedRoom.bookingId} />
                  ) : (
                    <Link 
                        href="/admin/bookings/walk-in"
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gold-500 text-slate-950 font-bold uppercase tracking-widest text-xs hover:bg-gold-600 transition-all shadow-xl shadow-gold-500/10"
                    >
                        New Walk-in Booking
                    </Link>
                  )}
                </footer>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { AnimatePresence, motion } from "framer-motion";
