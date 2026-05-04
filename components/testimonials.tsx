"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoStar } from "react-icons/io5";

interface Testimonial {
  id: string;
  author: string;
  date: string;
  quote: string;
  rating: number;
}

interface TestimonialsProps {
  initialData?: Testimonial[];
}

export default function Testimonials({ initialData = [] }: TestimonialsProps) {
  const [testimonials] = useState<Testimonial[]>(initialData);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-[128px] bg-slate-900 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-500/20 to-transparent" />
      
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-gold-500 font-bold uppercase tracking-[0.5em] text-[10px] mb-12 block"
        >
          Voices of the Elite
        </motion.span>

        <div className="relative h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-full"
            >
              <div className="flex justify-center gap-1 text-gold-500 mb-12">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <IoStar key={i} className="text-sm" />
                ))}
              </div>

              <blockquote className="text-3xl md:text-[42px] font-serif font-normal text-white italic leading-tight mb-12">
                &quot;{testimonials[activeIndex].quote}&quot;
              </blockquote>

              <div className="flex flex-col items-center">
                <span className="text-white font-bold uppercase tracking-[0.3em] text-[11px] mb-2">
                  {testimonials[activeIndex].author}
                </span>
                <span className="text-white/30 uppercase tracking-[0.2em] text-[9px]">
                  Stayed {testimonials[activeIndex].date}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-4 mt-12">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1 transition-all duration-700 ${
                activeIndex === idx ? "w-12 bg-gold-500" : "w-4 bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
