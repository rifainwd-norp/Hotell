import { sql } from "@/lib/db";
import { HiOutlinePlus, HiOutlineStar } from "react-icons/hi";
import { Testimonial } from "@/lib/types";

export default async function TestimonialsAdmin() {
  const testimonials = sql ? await sql`SELECT * FROM testimonials ORDER BY created_at DESC` as unknown as Testimonial[] : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white">Testimonials</h1>
          <p className="text-slate-400 mt-1">
            Manage guest reviews and feedback.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-slate-950 px-6 py-3 rounded-full font-sans font-semibold transition-all hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          <HiOutlinePlus className="text-xl" />
          Add Testimonial
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 italic bg-slate-900 rounded-2xl border border-gold-500/10">
            No testimonials found.
          </div>
        ) : (
          testimonials.map((t: Testimonial) => (
            <div
              key={t.id}
              className="p-8 rounded-2xl bg-slate-900 border border-gold-500/10 hover:border-gold-500/20 transition-all group relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-serif text-lg">{t.author}</h3>
                  <p className="text-slate-500 text-sm">{t.date}</p>
                </div>
                <div className="flex text-gold-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <HiOutlineStar key={i} className="text-sm fill-gold-500" />
                  ))}
                </div>
              </div>
              <blockquote className="text-slate-300 italic font-sans leading-relaxed">
                &quot;{t.quote}&quot;
              </blockquote>
              <div className="mt-6 flex justify-end gap-3">
                <button className="text-slate-500 hover:text-white transition-colors text-sm">
                  Edit
                </button>
                <button className="text-slate-500 hover:text-red-500 transition-colors text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
