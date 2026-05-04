"use client";
import { useState, useMemo } from "react";
import clsx from "clsx";
import { Room, Booking } from "@/lib/types";
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlineX, 
  HiOutlineCalendar, 
  HiOutlineUser
} from "react-icons/hi";
import { CheckOutBookingButton, CheckInBookingButton, ExtendStayButton } from "@/components/admin/action-buttons";
import { createBooking } from "@/lib/actions/bookings";




interface CalendarClientProps {
  allRooms: Room[];
  bookings: Booking[];
}

export default function CalendarClient({ allRooms, bookings }: CalendarClientProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const roomStatus = useMemo(() => {
    return allRooms.map(room => {
      const currentBooking = bookings.find(b => {
        const checkIn = new Date(b.check_in);
        const checkOut = new Date(b.check_out);
        checkIn.setHours(0, 0, 0, 0);
        checkOut.setHours(0, 0, 0, 0);
        return b.room_id === room.id && today >= checkIn && today < checkOut;
      });

      return {
        ...room,
        isBooked: currentBooking?.status === 'confirmed',
        isOccupied: currentBooking?.status === 'checked_in',
        guest: currentBooking?.guest_name,
        until: currentBooking?.check_out,
        bookingId: currentBooking?.id
      };
    });
  }, [allRooms, bookings, today]);



  const handleManualBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await createBooking(formData);
      if (result.success) {
        alert("Walk-in booking created successfully!");
        setShowModal(false);
        window.location.reload();
      } else {
        alert(result.error);
      }
    } catch {
      alert("Failed to create manual booking.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = useMemo(() => {
    return roomStatus.filter(r => {
      const tagline = (r.tagline || "").toLowerCase();
      const name = r.name.toLowerCase();
      const searchTerm = search.toLowerCase();
      
      const matchesSearch = name.includes(searchTerm) || tagline.includes(searchTerm);
      let matchesTab = activeTab === "all";
      if (activeTab === "deluxe") matchesTab = tagline.includes("deluxe") || tagline.includes("standard") || name.includes("deluxe");
      if (activeTab === "executive") matchesTab = tagline.includes("executive") || tagline.includes("suite") || name.includes("executive");
      if (activeTab === "presidential") matchesTab = tagline.includes("presidential") || tagline.includes("villa") || name.includes("presidential");
      if (activeTab === "booked") matchesTab = r.isBooked;
      if (activeTab === "occupied") matchesTab = r.isOccupied;
      if (activeTab === "available") matchesTab = !r.isBooked && !r.isOccupied;


      return matchesSearch && matchesTab;
    });
  }, [roomStatus, activeTab, search]);

  const stats = {
    total: roomStatus.length,
    booked: roomStatus.filter(r => r.isBooked).length,
    occupied: roomStatus.filter(r => r.isOccupied).length,
    available: roomStatus.filter(r => !r.isBooked && !r.isOccupied).length
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif text-white">Live Room Status</h1>
          <p className="text-slate-400 mt-1">Real-time occupancy for {today.toLocaleDateString('en-US', { dateStyle: 'long' })}.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {["all", "deluxe", "executive", "presidential", "available", "booked", "occupied"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={clsx(
                "px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border",
                activeTab === t 
                  ? "bg-gold-500 text-slate-950 border-gold-500" 
                  : "bg-white/5 text-slate-400 border-white/10 hover:text-white hover:border-white/20"
              )}
            >
              {t}
            </button>
          ))}
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
          <p className="text-[10px] uppercase tracking-widest mb-1 opacity-60">Awaiting Arrival</p>
          <p className="text-2xl font-serif font-bold">{stats.booked}</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl text-amber-500">
          <p className="text-[10px] uppercase tracking-widest mb-1 opacity-60">In-house Guests</p>
          <p className="text-2xl font-serif font-bold">{stats.occupied}</p>
        </div>
      </div>


      {/* Search Bar */}
      <div className="relative max-w-md">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
        <input 
          type="text" 
          placeholder="Quick search room..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50 transition-colors"
        />
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {filteredRooms.map((room) => (
          <div 
            key={room.id}
            className={clsx(
              "p-4 rounded-2xl border transition-all duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[180px]",
              room.isOccupied 
                ? "bg-slate-900 border-amber-500/20 shadow-lg shadow-amber-500/5" 
                : room.isBooked
                  ? "bg-slate-900 border-blue-500/20 shadow-lg shadow-blue-500/5"
                  : "bg-slate-900 border-emerald-500/20 hover:border-emerald-500/40"
            )}
          >
            <div className="relative z-10 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className={clsx(
                    "text-xl font-serif font-bold",
                    room.isOccupied ? "text-amber-500" : room.isBooked ? "text-blue-500" : "text-emerald-500"
                  )}>
                    {room.name.match(/\d+/)?.[0] || room.name.split(' ').pop()}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
                    {room.tagline || 'Room'}
                  </p>
                </div>
                {!room.isOccupied && !room.isBooked && (
                  <button 
                    onClick={() => {
                      setSelectedRoom(room);
                      setShowModal(true);
                    }}
                    className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                    title="Quick Walk-in"
                  >
                    <HiOutlinePlus className="text-sm" />
                  </button>
                )}
              </div>
              
              {(room.isOccupied || room.isBooked) ? (
                <div className={clsx(
                  "space-y-2 pt-2 border-t border-white/5",
                  room.isOccupied ? "text-amber-500/90" : "text-blue-500/90"
                )}>
                  <div className="flex items-center gap-1.5 font-medium truncate">
                    <HiOutlineUser className="text-sm shrink-0" />
                    <span className="text-xs truncate">{room.guest}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <HiOutlineCalendar className="text-sm shrink-0" />
                    <span className="text-[10px] font-sans uppercase">
                      {room.isOccupied ? `OUT: ${new Date(room.until!).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}` : `ARRIVES: ${new Date(room.until!).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/5 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-wider">Available</span>
                </div>
              )}
            </div>

            <div className="relative z-10 mt-4 flex flex-col gap-2">
              {room.isOccupied && room.bookingId && (
                <>
                  <ExtendStayButton id={room.bookingId} currentCheckOut={room.until!.toString()} />
                  <CheckOutBookingButton id={room.bookingId} />
                </>
              )}
              {room.isBooked && room.bookingId && (
                <CheckInBookingButton id={room.bookingId} />
              )}
            </div>

            
            {/* Background Accent */}
            <div className={clsx(
              "absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-3xl opacity-10 transition-all group-hover:scale-150",
              room.isOccupied ? "bg-amber-500" : room.isBooked ? "bg-blue-500" : "bg-emerald-500"
            )} />
          </div>
        ))}


      </div>
      
      {filteredRooms.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <p className="text-slate-500 italic">No rooms found matching your selection.</p>
        </div>
      )}

      {/* Manual Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-md bg-slate-950/80 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-gold-500/20 w-full max-w-md rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/2">
              <div>
                <h3 className="text-xl font-serif text-white uppercase tracking-widest">Manual Check-in</h3>
                <p className="text-[10px] text-gold-500 font-bold uppercase mt-1">Assigning Room: {selectedRoom?.name}</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-white/5 text-slate-500 transition-colors"
              >
                <HiOutlineX className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleManualBooking} className="p-8 space-y-6">
              {/* Pass specific room ID for manual check-in */}
              <input type="hidden" name="room_id" value={selectedRoom?.id} />

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Guest Full Name</label>
                <input 
                  name="guest_name"
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address (Optional)</label>
                <input 
                  name="guest_email"
                  type="email" 
                  placeholder="guest@email.com (optional)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Check-in</label>
                  <input 
                    name="check_in"
                    type="date" 
                    defaultValue={today.toISOString().split('T')[0]}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Check-out</label>
                  <input 
                    name="check_out"
                    type="date" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold uppercase tracking-[0.2em] py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Confirm & Check-in"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
