"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import MagneticButton from "./magnetic-button";
import { OfferItem } from "@/lib/types";

interface OffersProps {
  initialData?: OfferItem[];
}

export default function Offers({ initialData = [] }: OffersProps) {
  const [offers] = useState<OfferItem[]>(initialData);

  if (offers.length === 0) return null;

  return (
    <section className="py-[128px] bg-slate-900 px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gold-500 font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block"
          >
            Exclusive Benefits
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl font-serif text-white italic"
          >
            Curated Privileges
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {offers.map((offer, idx) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="group relative h-[500px] overflow-hidden"
            >
              <Image
                src={offer.image_url}
                alt={offer.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/60 transition-colors duration-700" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-16">
                <span className="text-gold-500 font-bold tracking-[0.4em] text-[9px] uppercase mb-4 block">
                  {offer.tag}
                </span>
                <h3 className="text-3xl font-serif text-white mb-6 uppercase tracking-widest">
                  {offer.title}
                </h3>
                <p className="text-white/60 font-light text-sm mb-10 max-w-sm leading-relaxed opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                  {offer.description}
                </p>
                <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                  <MagneticButton 
                    href={offer.link_url || "/booking"} 
                    variant="outline"
                    className="px-8 py-3 text-[9px] border-gold-500/30"
                  >
                    Experience Privilege
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
