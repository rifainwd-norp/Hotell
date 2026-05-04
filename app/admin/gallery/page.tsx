import Image from "next/image";
import { sql } from "@/lib/db";
import { HiOutlinePlus } from "react-icons/hi";
import { GalleryItem } from "@/lib/types";
import Link from "next/link";
import { DeleteGalleryButton } from "@/components/admin/gallery-buttons";

export default async function GalleryAdmin() {
  const items = sql ? await sql`SELECT * FROM lifestyle_gallery ORDER BY created_at DESC` as unknown as GalleryItem[] : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white">Gallery Management</h1>
          <p className="text-slate-400 mt-1">Curate the lifestyle imagery for the homepage.</p>
        </div>
        <Link 
          href="/admin/gallery/new" 
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-slate-950 px-6 py-3 rounded-full font-sans font-semibold transition-all hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
        >
          <HiOutlinePlus className="text-xl" />
          Add Image URL
        </Link>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 italic bg-slate-900 rounded-2xl border border-gold-500/10">
            No gallery items found.
          </div>
        ) : (
          items.map((item: GalleryItem) => (
            <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-gold-500/10">
              <Image 
                src={item.image_url} 
                alt={item.title} 
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white text-sm font-medium truncate">{item.title}</p>
                <p className="text-gold-500 text-xs uppercase tracking-widest">{item.category}</p>
                <DeleteGalleryButton id={item.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
