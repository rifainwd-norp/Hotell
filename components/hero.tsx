"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import MagneticButton from "./magnetic-button";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image with Parallax Effect */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmMzEIAlBv7zIk4zEH8GlpBHXY5ttdZ0UwN7YD6Bqx0GsZtBZikCGCUmKU9KSsZrw4tCX1NCXIq_7Yl9HKoDu7eZ-ZK56u-0C2UfdAQrcsGNFWrEpewBd1gAVXH0M17K-ldqNDjp-6dl-Zip16Gz3v4F8xEhir90Rgpma2gsY35H6_qB79KlF58vNn0tYuQbj1r1uOFoucHDBblpCBcqbgTgX2RiUadVP4NmT1wfyGaoPNdCDNjei7QHfn5GJKbLGKgoDd_pcXBT8V"
          alt="Aureum Grand Exterior"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/60 via-slate-950/0 to-slate-950/90"></div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <span className="inline-block text-gold-500 font-bold uppercase tracking-[0.5em] text-[10px] mb-8">
            The Pinnacle of Prestige
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-[84px] font-normal font-serif text-white mb-10 leading-[1.1] tracking-[-0.02em]">
            Elegance Refined.
          </h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-white/70 mb-16 font-light leading-relaxed tracking-wide"
        >
          Experience a sanctuary of unparalleled luxury where every detail is meticulously crafted for the world&apos;s most discerning travelers.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-8 justify-center items-center"
        >
          <MagneticButton
            href="/booking"
            variant="primary"
            className="px-16 py-5 text-[11px] font-bold uppercase tracking-[0.3em] min-w-[240px]"
          >
            Book Now
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="text-[9px] uppercase tracking-[0.5em] text-gold-500 mb-8 origin-left">Scroll</span>
          <div className="w-px h-16 bg-linear-to-b from-gold-500/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
