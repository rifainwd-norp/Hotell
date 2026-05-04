"use client";
import { useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "@/components/magnetic-button";

const Navlink = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Reserves", href: "/booking" },
    { name: "Suites", href: "/room" },
    { name: "Lifestyle", href: "/lifestyle" },
    { name: "Gallery", href: "/gallery" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-12">
        <ul className="flex items-center space-x-10">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="relative py-2 text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 hover:text-gold-500 transition-all duration-300 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gold-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>
        <MagneticButton 
          href="/booking" 
          variant="secondary"
          className="px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-none border-gold-500/30"
        >
          Reserve
        </MagneticButton>
      </nav>

      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden relative z-60 text-gold-500 p-1 transition-transform active:scale-90"
      >
        {open ? <IoClose className="size-8" /> : <IoMenu className="size-8" />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#0e0e0e] flex flex-col px-8 pt-24 pb-12 overflow-y-auto"
          >
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/2 font-serif text-[120px] font-bold pointer-events-none select-none">
              AUREUM
            </div>

            <div className="relative z-10 flex flex-col h-full">
               <span className="text-gold-500 font-bold uppercase tracking-[0.5em] text-[10px] mb-8">Navigation</span>
               
               <ul className="flex flex-col space-y-6 mb-12">
                {links.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-4xl font-serif text-white hover:text-gold-500 transition-colors tracking-tight flex items-center gap-4 group"
                    >
                      <span className="text-gold-500/20 font-sans text-xs font-bold tracking-widest">0{i + 1}</span>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto border-t border-gold-500/10 pt-12 space-y-8">
                 <div>
                    <span className="text-gold-500/30 font-bold uppercase tracking-[0.4em] text-[9px] mb-4 block">Private Concierge</span>
                    <p className="text-white text-sm font-light tracking-wide">concierge@aureumgrand.com</p>
                    <p className="text-white text-sm font-light tracking-wide">+1 (800) 123-4567</p>
                 </div>

                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                 >
                   <MagneticButton 
                      href="/booking" 
                      variant="secondary"
                      onClick={() => setOpen(false)}
                      className="w-full py-5 text-[11px] font-bold uppercase tracking-[0.4em] rounded-none border-gold-500/30"
                    >
                      Request Reservation
                    </MagneticButton>
                 </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navlink;
