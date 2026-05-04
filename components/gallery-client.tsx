"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "./magnetic-button";
import { GalleryItem } from "@/lib/types";

interface GalleryClientProps {
  initialData: GalleryItem[];
}

export default function GalleryClient({ initialData }: GalleryClientProps) {
  const [items] = useState<GalleryItem[]>(initialData);
  const [activeCategory, setActiveCategory] = useState("ALL");

  const categories = ["ALL", ...new Set(items.map(item => item.category.toUpperCase()))];

  const filteredItems = activeCategory === "ALL" 
    ? items 
    : items.filter(item => item.category.toUpperCase() === activeCategory);

  return (
    <main className="bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzlcwdoPJS3PUFgNHdPJVJQHQBiJESB84mqLZX1foKHNYm5lnBLf9YIygV5e3e2Mnv_2ytUJDfep0xnI_ekehpXipU52bGCZj1TVQ-Z7wG2X30GRvk49VCLftgp1DoknbfOjun-dawWuwfiPETESM0sIL0xAzGzrALjB1vUY-6boO7ojCjunSDQ7NJzKtMk1sYwTYCsH4aRBy0gnpHbOYyD9s54a-bDhKXDHmZRWTr82u7eyTNwrvpS4I5QnyRSGomPXOIPZ0z6n5M"
            alt="Aureum Grand Gallery"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-slate-950" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold-500 font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block"
          >
            Aureum Grand
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-7xl md:text-[84px] font-serif text-white italic tracking-tighter"
          >
            The Gallery
          </motion.h1>
        </div>
      </section>

      {/* Filter System */}
      <div className="sticky top-20 z-40 bg-slate-950/95 backdrop-blur-md py-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 flex justify-center gap-12 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-500 relative pb-1 ${
                activeCategory === cat ? "text-gold-500" : "text-white/30 hover:text-white"
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div 
                  layoutId="activeGalleryFilter"
                  className="absolute bottom-0 left-0 w-full h-px bg-gold-500"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <motion.div 
          layout
          className="columns-1 md:columns-2 gap-8 space-y-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="relative group overflow-hidden break-inside-avoid border border-white/5 bg-slate-900"
              >
                <div className="relative aspect-auto">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    width={800}
                    height={1000}
                    className="w-full grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-all duration-700" />
                  <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 bg-linear-to-t from-slate-950/90 to-transparent">
                     <span className="text-gold-500 font-bold tracking-[0.3em] text-[8px] uppercase mb-1 block">{item.category}</span>
                     <h3 className="text-xl font-serif text-white tracking-wider italic">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="bg-slate-900 py-32 px-12 text-center">
        <div className="max-w-2xl mx-auto space-y-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white italic"
          >
            Experience the Incomparable
          </motion.h2>
          <p className="text-white/40 text-lg font-light leading-relaxed">
            Step into the world of Aureum Grand. Allow us to curate a private tour of the estate tailored to your refined sensibilities.
          </p>
          <div className="pt-8">
            <MagneticButton 
              href="/booking" 
              variant="outline"
              className="px-16 py-5 border-gold-500/30 text-[11px]"
            >
              Request a Private Tour
            </MagneticButton>
          </div>
        </div>
      </section>
    </main>
  );
}
