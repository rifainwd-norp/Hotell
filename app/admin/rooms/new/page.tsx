import { createRoom } from "@/lib/actions/rooms";
import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi";

export default function NewRoomPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header>
        <Link href="/admin/rooms" className="text-slate-500 hover:text-gold-500 flex items-center gap-2 mb-4 transition-colors group">
          <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Rooms
        </Link>
        <h1 className="text-3xl font-serif text-white">Create New Room</h1>
        <p className="text-slate-400 mt-1">Add a new luxury suite or villa to your hotel collection.</p>
      </header>

      <form action={createRoom} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Room Name</label>
            <input 
              name="name" 
              type="text" 
              required 
              placeholder="e.g. The Royal Penthouse"
              className="w-full bg-slate-900 border border-gold-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">URL Slug</label>
            <input 
              name="slug" 
              type="text" 
              required 
              placeholder="e.g. royal-penthouse"
              className="w-full bg-slate-900 border border-gold-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Price per Night ($)</label>
            <input 
              name="price" 
              type="number" 
              required 
              placeholder="1200"
              className="w-full bg-slate-900 border border-gold-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Tagline</label>
            <input 
              name="tagline" 
              type="text" 
              placeholder="e.g. ULTIMATE LUXURY"
              className="w-full bg-slate-900 border border-gold-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Short Description</label>
          <textarea 
            name="description" 
            required 
            rows={3}
            placeholder="A brief overview of the room..."
            className="w-full bg-slate-900 border border-gold-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all" 
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Long Description</label>
          <textarea 
            name="long_description" 
            rows={5}
            placeholder="Detailed description for the room page..."
            className="w-full bg-slate-900 border border-gold-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all" 
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Capacity</label>
            <input name="capacity" type="text" placeholder="e.g. 2 Guests" className="w-full bg-slate-900 border border-gold-500/10 rounded-xl px-4 py-3 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Size</label>
            <input name="size" type="text" placeholder="e.g. 75 SQM" className="w-full bg-slate-900 border border-gold-500/10 rounded-xl px-4 py-3 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">View</label>
            <input name="view" type="text" placeholder="e.g. Ocean View" className="w-full bg-slate-900 border border-gold-500/10 rounded-xl px-4 py-3 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Service</label>
            <input name="service" type="text" placeholder="e.g. 24/7 Butler" className="w-full bg-slate-900 border border-gold-500/10 rounded-xl px-4 py-3 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Main Image URL</label>
          <input 
            name="imageUrl" 
            type="url" 
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-slate-900 border border-gold-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all" 
          />
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            className="w-full bg-gold-500 hover:bg-gold-600 text-slate-950 font-sans font-bold py-4 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-gold-500/20"
          >
            Publish Room Listing
          </button>
        </div>
      </form>
    </div>
  );
}
