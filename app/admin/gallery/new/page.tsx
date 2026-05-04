import { addGalleryItem } from "@/lib/actions/gallery";
import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi";

export default function NewGalleryItemPage() {
  async function handleAddGalleryItem(formData: FormData) {
    "use server";
    await addGalleryItem(formData);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <Link href="/admin/gallery" className="text-slate-500 hover:text-gold-500 flex items-center gap-2 mb-4 transition-colors group">
          <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Gallery
        </Link>
        <h1 className="text-3xl font-serif text-white">Add Gallery Image</h1>
        <p className="text-slate-400 mt-1">Input the URL of the lifestyle image you want to showcase.</p>
      </header>

      <form action={handleAddGalleryItem} className="bg-slate-900/50 p-8 rounded-3xl border border-gold-500/10 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Image Title</label>
          <input 
            name="title" 
            type="text" 
            required 
            placeholder="e.g. Sunset Dinner at the Terrace"
            className="w-full bg-slate-950 border border-gold-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Category</label>
          <select 
            name="category" 
            required
            className="w-full bg-slate-950 border border-gold-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all appearance-none"
          >
            <option value="Lifestyle">Lifestyle</option>
            <option value="Dining">Dining</option>
            <option value="Wellness">Wellness</option>
            <option value="Architecture">Architecture</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Image URL</label>
          <input 
            name="image_url" 
            type="url" 
            required 
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-slate-950 border border-gold-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all" 
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-gold-500 hover:bg-gold-600 text-slate-950 font-sans font-bold py-4 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-gold-500/20"
          >
            Add to Gallery
          </button>
        </div>
      </form>
    </div>
  );
}
