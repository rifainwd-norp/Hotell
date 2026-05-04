"use client";
import { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import MagneticButton from "./magnetic-button";
import Link from "next/link";
import { Room } from "@/lib/types";

interface FeaturedRoomsProps {
  initialData?: Room[];
}

export default function FeaturedRooms({ initialData = [] }: FeaturedRoomsProps) {
  // Group rooms by category and show one representative for each type
  const rooms = useMemo(() => {
    if (initialData.length === 0) return [];
    
    const categories = [
      { id: 'deluxe', name: 'Deluxe Rooms', keyword: 'deluxe', price: 150, image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a' },
      { id: 'executive', name: 'Executive Suites', keyword: 'executive', price: 350, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b' },
      { id: 'presidential', name: 'Presidential Villas', keyword: 'presidential', price: 1200, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb' }
    ];

    return categories.map(cat => {
      // Try to find a real room to get actual data, otherwise use defaults
      const realRoom = initialData.find(r => 
        (r.tagline || "").toLowerCase().includes(cat.keyword) || 
        r.name.toLowerCase().includes(cat.keyword)
      );

      return {
        id: realRoom?.id || cat.id,
        slug: realRoom?.slug || cat.id,
        name: cat.name,
        price: realRoom?.price || cat.price,
        tagline: `Luxury ${cat.name}`,
        images: realRoom?.images || JSON.stringify([cat.image]),
        description: realRoom?.description || `Our finest ${cat.name} offering unparalleled comfort.`,
      } as Room;
    });
  }, [initialData]);

  return (
    <section className="py-[128px] bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-gold-500 font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block"
            >
              Private Sanctuaries
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-[48px] font-serif font-normal text-white mb-6 leading-tight"
            >
              Signature Suites
            </motion.h2>
          </div>
          
          <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.5 }}
          >
            <MagneticButton 
              href="/room" 
              variant="outline"
              className="px-8 py-3 text-[10px] border-gold-500/30"
            >
              View All Accommodations
            </MagneticButton>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {rooms.map((room, idx) => {
            // Parse images carefully
            let firstImage = "";
            try {
              if (room.images) {
                const parsed = JSON.parse(room.images);
                firstImage = Array.isArray(parsed) ? parsed[0] : parsed;
              }
            } catch {
              firstImage = room.images || "";
            }

            return (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <div className="group">
                  <div className="relative aspect-4/5 overflow-hidden mb-8 bg-slate-900">
                    <Link href={`/room/${room.slug}`}>
                      {firstImage && typeof firstImage === 'string' && firstImage.trim() !== "" ? (
                        <Image
                          src={firstImage}
                          alt={room.name}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                          <span className="text-slate-600 font-serif italic text-xs uppercase tracking-widest">No Image Available</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-all duration-700" />
                      
                      <div className="absolute bottom-0 left-0 w-full p-10 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 bg-linear-to-t from-slate-950/90 to-transparent">
                         <p className="text-gold-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-2">
                           Starting from ${room.price?.toLocaleString()} / Night
                         </p>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="px-2">
                    <Link href={`/room/${room.slug}`}>
                      <h3 className="text-2xl font-serif font-normal text-white mb-2 group-hover:text-gold-500 transition-colors uppercase tracking-widest truncate">
                        {room.name}
                      </h3>
                    </Link>
                    <p className="text-gold-500/50 font-bold uppercase tracking-widest text-[9px] mb-4">
                      {room.tagline || "Luxury Accommodation"}
                    </p>
                    <p className="text-white/50 font-light leading-relaxed text-sm line-clamp-2 mb-6 h-10">
                      {room.description}
                    </p>
                    
                    <div className="flex items-center gap-6">
                      <Link 
                        href={`/room/${room.slug}`}
                        className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors"
                      >
                        View Details
                      </Link>
                      <Link 
                        href={`/booking?room=${room.slug}`}
                        className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500 hover:text-gold-400 transition-colors border-b border-gold-500/20 hover:border-gold-500 pb-1"
                      >
                        Reserve Now
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
