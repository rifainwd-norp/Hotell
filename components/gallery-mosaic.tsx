"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import MagneticButton from "./magnetic-button";

interface GalleryItem {
  id: string;
  category: string;
  title: string;
  tag: string;
  image_url: string;
}

interface GalleryMosaicProps {
  initialData?: GalleryItem[];
}

export default function GalleryMosaic({ initialData = [] }: GalleryMosaicProps) {
  const [items] = useState<GalleryItem[]>(initialData);

  if (items.length === 0) return null;

  // Select 4 items for the mosaic
  const mosaicItems = items.slice(0, 4);

  return (
    <section className="py-[128px] bg-slate-950 px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-gold-500 font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block"
            >
              Visual Legacy
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl font-serif text-white italic leading-tight"
            >
              The Aureum Chronology
            </motion.h2>
          </div>
          <MagneticButton href="/gallery" variant="outline" className="px-12 py-4 text-[10px] border-gold-500/20">
            Visit the Gallery
          </MagneticButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[800px]">
          {/* Large Vertical Item */}
          {mosaicItems[0] && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="md:col-span-4 relative group overflow-hidden"
            >
              <Image
                src={mosaicItems[0].image_url}
                alt={mosaicItems[0].title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/60 transition-colors duration-700" />
            </motion.div>
          )}

          {/* Right Column Grid */}
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {mosaicItems.slice(1).map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className={`relative group overflow-hidden ${idx === 0 ? "md:col-span-2 h-[400px]" : "h-[368px]"}`}
              >
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/60 transition-colors duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
