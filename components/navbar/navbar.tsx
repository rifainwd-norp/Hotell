"use client";
import Link from "next/link";
import Navlink from "./navlink";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion, useScroll, useSpring } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={clsx(
        "fixed top-0 w-full z-50 transition-all duration-500 ease-in-out",
        isHome
          ? isScrolled 
            ? "bg-slate-950/90 backdrop-blur-[20px] border-b border-gold-500/10 py-3 shadow-2xl" 
            : "bg-transparent py-6"
          : "bg-slate-950/90 backdrop-blur-[20px] border-b border-gold-500/10 py-3 shadow-2xl"
      )}
    >
      {/* Integrated Scroll Progress */}
      <motion.div
        className="absolute -bottom-px left-0 right-0 h-px bg-gold-500 origin-left z-60"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-12 h-full flex items-center justify-between">
        <Link href="/" className="text-xl font-serif tracking-[0.3em] text-gold-500 hover:text-white transition-colors">
          AUREUM GRAND
        </Link>
        <Navlink />
      </div>
    </motion.header>
  );
};

export default Navbar;
