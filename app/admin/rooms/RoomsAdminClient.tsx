"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineSearch } from "react-icons/hi";
import { DeleteRoomButton } from "@/components/admin/action-buttons";
import { Room } from "@/lib/types";

export default function RoomsAdminClient({ initialRooms = [] }: { initialRooms: Room[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredRooms = useMemo(() => {
    return initialRooms.filter(room => {
      const name = room.name.toLowerCase();
      const slug = room.slug.toLowerCase();
      const tagline = (room.tagline || "").toLowerCase();
      const searchTerm = search.toLowerCase();

      const matchesSearch = name.includes(searchTerm) || slug.includes(searchTerm);
      
      let matchesFilter = filter === "all";
      if (filter === "deluxe") {
        matchesFilter = tagline.includes("deluxe") || tagline.includes("standard") || tagline.includes("superior") || name.includes("deluxe");
      } else if (filter === "executive") {
        matchesFilter = tagline.includes("executive") || tagline.includes("suite") || name.includes("executive");
      } else if (filter === "presidential") {
        matchesFilter = tagline.includes("presidential") || tagline.includes("villa") || name.includes("presidential");
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [initialRooms, search, filter]);

  const stats = useMemo(() => ({
    total: initialRooms.length,
    deluxe: initialRooms.filter(r => {
      const t = (r.tagline || "").toLowerCase();
      const n = r.name.toLowerCase();
      return t.includes("deluxe") || t.includes("standard") || t.includes("superior") || n.includes("deluxe");
    }).length,
    executive: initialRooms.filter(r => {
      const t = (r.tagline || "").toLowerCase();
      const n = r.name.toLowerCase();
      return t.includes("executive") || t.includes("suite") || n.includes("executive");
    }).length,
    presidential: initialRooms.filter(r => {
      const t = (r.tagline || "").toLowerCase();
      const n = r.name.toLowerCase();
      return t.includes("presidential") || t.includes("villa") || n.includes("presidential");
    }).length,
  }), [initialRooms]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif text-white">Room Management</h1>
          <p className="text-slate-400 mt-1">Efficiently manage your {stats.total} accommodations.</p>
        </div>
        <Link 
          href="/admin/rooms/new" 
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-slate-950 px-6 py-3 rounded-full font-sans font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.2)] whitespace-nowrap self-start"
        >
          <HiOutlinePlus className="text-xl" />
          Add New Room
        </Link>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Rooms", count: stats.total, color: "text-white" },
          { label: "Deluxe", count: stats.deluxe, color: "text-emerald-500" },
          { label: "Executive", count: stats.executive, color: "text-amber-500" },
          { label: "Presidential", count: stats.presidential, color: "text-purple-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/5 p-6 rounded-2xl">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-2xl font-serif font-bold ${stat.color}`}>{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
          <input 
            type="text" 
            placeholder="Search by name or number (e.g. 101)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50 transition-colors"
          />
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
          {["all", "deluxe", "executive", "presidential"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === t ? "bg-gold-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-gold-500/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20">
              <tr className="border-b border-gold-500/10 bg-slate-950/90 backdrop-blur-md">
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-gold-500/70 font-sans">Room</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-gold-500/70 font-sans">Type</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-gold-500/70 font-sans">Price</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-gold-500/70 font-sans text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                    No rooms match your criteria.
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room: Room) => (
                  <tr key={room.id} className="hover:bg-white/3 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium group-hover:text-gold-500 transition-colors">{room.name}</p>
                        <p className="text-slate-500 text-[10px] uppercase tracking-tighter">{room.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-400 text-xs font-medium bg-white/5 px-2 py-1 rounded border border-white/5">
                        {room.tagline || 'Standard Suite'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-gold-500 font-serif font-semibold">${room.price.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/rooms/edit/${room.id}`}
                          className="p-2 rounded-lg text-slate-500 hover:text-gold-500 hover:bg-gold-500/10 transition-all"
                        >
                          <HiOutlinePencil className="text-xl" />
                        </Link>
                        <DeleteRoomButton id={room.id} />
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
