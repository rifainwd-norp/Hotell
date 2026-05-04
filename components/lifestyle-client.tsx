"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "./magnetic-button";
import { GalleryItem } from "@/lib/types";

interface LifestyleClientProps {
  initialData: GalleryItem[];
}

export default function LifestyleClient({ initialData }: LifestyleClientProps) {
  const [galleryItems] = useState<GalleryItem[]>(initialData);
  const [activeCategory, setActiveCategory] = useState("ALL JOURNEYS");

  const categories = ["ALL JOURNEYS", ...new Set(galleryItems.map(item => item.category))];

  const filteredItems = activeCategory === "ALL JOURNEYS" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <main className="bg-slate-950 min-h-screen pb-32">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-950/40 to-slate-950 z-10" />
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAviX_AQXE_N8h5e7zEzKZsJlP3CgvlrmuRqfZ5c4ON70wO8McD3dDAMLodAWxYAIvCnPmnO8OxUo6Erd_XVzvJEKXCJ2cPOIkgCrp-BfjtxtzKoEVvHdJvdcerVD-3gKHK0xg7oV0x1KfNm2DX7bvGVFpOYjG_jBSdyTshnt91S2EkWoEOr_--Grf_wqjEJDmdafyn1qXE5mDkwmlRtr8FZDqQcD9eyzGJ3Gt-p0HB5klj-xJ1CYgKoxw29HTw1X8B8m1D8xWIKTBs"
          alt="Luxury Lifestyle"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-serif text-white mb-6 tracking-tight"
          >
            THE ART OF LIVING
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/40 text-xs md:text-sm tracking-[0.4em] uppercase max-w-2xl mx-auto leading-relaxed"
          >
            Defining the pinnacle of modern exclusivity and cinematic hospitality.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-20 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-12 py-8 overflow-x-auto no-scrollbar">
          <div className="flex justify-center gap-12 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-500 relative pb-2 ${
                  activeCategory === cat ? "text-gold-500" : "text-white/30 hover:text-white"
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div 
                    layoutId="activeFilter"
                    className="absolute bottom-0 left-0 w-full h-px bg-gold-500"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="max-w-7xl mx-auto px-12 py-24">
        <motion.div 
          layout
          className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative group overflow-hidden bg-slate-900 break-inside-avoid"
              >
                <div className="relative aspect-auto">
                   <Image
                    src={item.image_url}
                    alt={item.title}
                    width={800}
                    height={1000}
                    className="w-full grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-10">
                    <span className="text-gold-500 font-bold tracking-[0.3em] text-[9px] uppercase mb-2">{item.tag}</span>
                    <h3 className="text-2xl font-serif text-white uppercase tracking-wider">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center px-12">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-12 uppercase tracking-widest leading-tight">
            Experience the Unattainable
          </h2>
          <MagneticButton 
            href="/booking" 
            variant="outline"
            className="px-16 py-5 text-[11px] border-gold-500/20"
          >
            RESERVE YOUR STAY
          </MagneticButton>
        </div>
      </section>
    </main>
  );
}
