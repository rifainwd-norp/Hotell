"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Room {
  id: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  capacity: string;
  size: string;
}

interface RoomListingProps {
  initialData: Room[];
}

export default function RoomListing({ initialData }: RoomListingProps) {
  const [rooms] = useState<Room[]>(initialData);

  return (
    <div className="max-w-7xl mx-auto px-12 pb-[128px]">
      <div className="grid grid-cols-1 gap-24">
        {rooms.map((room, idx) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col lg:flex-row gap-16 items-center ${
              idx % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Image Section */}
            <div className="w-full lg:w-3/5 relative aspect-16/10 overflow-hidden group">
              <Link href={`/room/${room.slug}`}>
                <Image
                  src={room.images?.[0] || ""}
                  alt={room.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-all duration-700" />
              </Link>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-2/5">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-8 bg-gold-500/50" />
                <span className="text-gold-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                  ${room.price?.toLocaleString()} / Night
                </span>
              </div>
              
              <h2 className="text-4xl font-serif text-white mb-6 uppercase tracking-widest">
                {room.name}
              </h2>
              
              <div className="flex gap-8 mb-8 text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
                <span>{room.size}</span>
                <span>{room.capacity}</span>
              </div>

              <p className="text-white/40 font-light leading-relaxed mb-10 text-sm italic">
                {room.description}
              </p>

              <div className="flex items-center gap-8">
                <Link 
                  href={`/room/${room.slug}`}
                  className="inline-block text-white font-bold uppercase tracking-[0.4em] text-[10px] border-b border-gold-500/30 pb-2 hover:border-gold-500 transition-colors"
                >
                  Discover the Sanctuary
                </Link>
                <Link 
                  href={`/booking?room=${room.slug}`}
                  className="inline-block text-gold-500 font-bold uppercase tracking-[0.4em] text-[10px] border-b border-gold-500/30 pb-2 hover:border-gold-500 transition-colors"
                >
                  Direct Reservation
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
