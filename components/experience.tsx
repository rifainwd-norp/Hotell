"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import MagneticButton from "./magnetic-button";

interface ExperienceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image_url: string;
}

interface ExperienceProps {
  initialData?: ExperienceItem[];
}

export default function Experience({ initialData = [] }: ExperienceProps) {
  const [experiences] = useState<ExperienceItem[]>(initialData);

  if (experiences.length === 0) return null;

  return (
    <section className="py-[160px] bg-slate-950">
      <div className="max-w-7xl mx-auto px-12">
        {experiences.map((exp, idx) => (
          <div 
            key={exp.id}
            className={`flex flex-col lg:flex-row items-center gap-24 mb-[160px] last:mb-0 ${
              idx % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            <motion.div 
              initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 relative aspect-video overflow-hidden"
            >
              <Image
                src={exp.image_url}
                alt={exp.title}
                fill
                className="object-cover scale-105"
              />
              <div className="absolute inset-0 bg-slate-950/20" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-full lg:w-1/2"
            >
              <span className="text-gold-500 font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block">
                {exp.tagline}
              </span>
              <h2 className="text-5xl font-serif text-white mb-8 italic">
                {exp.title}
              </h2>
              <p className="text-white/40 font-light leading-relaxed mb-12 text-lg">
                {exp.description}
              </p>
              <MagneticButton 
                href="/lifestyle" 
                variant="outline"
                className="px-12 py-4 text-[10px] border-gold-500/20"
              >
                Discover the Journey
              </MagneticButton>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
