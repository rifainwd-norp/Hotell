"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBack, IoChevronForward, IoCheckmarkCircleOutline } from "react-icons/io5";
import MagneticButton from "./magnetic-button";

interface RoomDetailClientProps {
  room: any;
}

export default function RoomDetailClient({ room }: RoomDetailClientProps) {
  const [activeImage, setActiveImage] = useState(0);
  const images = typeof room.images === 'string' ? JSON.parse(room.images) : (room.images || []);
  const amenities = typeof room.amenities === 'string' ? JSON.parse(room.amenities) : (room.amenities || []);

  const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <main className="bg-slate-950 min-h-screen text-white">
      {/* Hero Gallery Section */}
      <section className="relative h-[85vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeImage]}
              alt={room.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-slate-950/60 via-transparent to-slate-950" />
          </motion.div>
        </AnimatePresence>

        {/* Gallery Controls */}
        <div className="absolute bottom-12 right-12 flex gap-4 z-20">
          <button onClick={prevImage} className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <IoChevronBack size={24} />
          </button>
          <button onClick={nextImage} className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <IoChevronForward size={24} />
          </button>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end px-12 pb-24 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="text-gold-500 font-bold uppercase tracking-[0.6em] text-[10px] mb-8 block">
              {room.tagline}
            </span>
            <h1 className="text-6xl md:text-8xl font-serif mb-8 italic">
              {room.name}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Detail Content Section */}
      <section className="py-[128px] px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          {/* Left Column: Description */}
          <div className="lg:col-span-7">
            <div className="flex gap-12 mb-16 pb-12 border-b border-white/5">
              <div>
                <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest block mb-2">Size</span>
                <span className="text-xl font-serif italic">{room.size}</span>
              </div>
              <div>
                <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest block mb-2">Capacity</span>
                <span className="text-xl font-serif italic">{room.capacity}</span>
              </div>
              <div>
                <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest block mb-2">View</span>
                <span className="text-xl font-serif italic">{room.view}</span>
              </div>
            </div>

            <p className="text-white/50 text-xl font-light leading-relaxed mb-16 first-letter:text-5xl first-letter:font-serif first-letter:text-gold-500 first-letter:mr-3 first-letter:float-left">
              {room.long_description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              {amenities.map((amenity: any, idx: number) => (
                <div key={idx} className="flex gap-6 items-start p-8 bg-white/2 rounded-xs border border-white/5 hover:border-gold-500/20 transition-colors group">
                  <IoCheckmarkCircleOutline className="text-gold-500 mt-1 shrink-0 group-hover:scale-110 transition-transform" size={20} />
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-[11px] mb-2">{amenity.title}</h4>
                    <p className="text-white/30 text-[11px] leading-relaxed uppercase tracking-wider">{amenity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-40 bg-slate-900 border border-white/5 p-12">
              <div className="mb-12">
                <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest block mb-2">Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-serif text-gold-500">${room.price?.toLocaleString()}</span>
                  <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest">per night</span>
                </div>
              </div>

              <div className="space-y-6 mb-12">
                <div className="p-6 bg-slate-950 border border-white/5 rounded-xs">
                  <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-2">Service Excellence</span>
                  <p className="text-white text-xs uppercase tracking-widest font-bold">{room.service}</p>
                </div>
              </div>

              <MagneticButton href="/booking" variant="primary" className="w-full py-5 rounded-none text-[10px]">
                Initiate Reservation
              </MagneticButton>
              
              <p className="text-center text-white/20 text-[9px] mt-8 uppercase tracking-[0.2em]">
                Best Rate Guaranteed for Direct Bookings
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
