"use client";
import { useState, useRef, MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import clsx from "clsx";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "outline";
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function MagneticButton({
  children,
  href,
  onClick,
  className,
  variant = "primary",
  type = "button",
  disabled = false
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const baseStyles = "relative overflow-hidden group transition-all duration-700 border-px rounded-none block text-center uppercase tracking-[0.2em] font-bold text-[10px]";
  
  const variantStyles = {
    primary: "border-gold-500 text-gold-500 hover:text-slate-950",
    secondary: "border-white/30 text-white hover:text-slate-950",
    dark: "bg-slate-950 border-slate-800 text-white hover:text-slate-950",
    outline: "border-gold-500/30 text-gold-500/70 hover:text-white hover:border-gold-500"
  };

  // Color of the expanding circle (Rich Gold Gradient)
  const circleColor = "bg-linear-to-br from-gold-300 via-gold-500 to-gold-600";
  
  const content = (
    <>
      <motion.span 
        className="relative z-10 pointer-events-none block"
        animate={{
          x: isHovered ? (coords.x - 100) * 0.1 : 0,
          y: isHovered ? (coords.y - 30) * 0.1 : 0,
        }}
      >
        {children}
      </motion.span>
      
      <motion.div
        className={clsx("absolute rounded-full pointer-events-none z-0", circleColor)}
        style={{
          left: coords.x,
          top: coords.y,
          width: "20px",
          height: "20px",
          x: "-50%",
          y: "-50%",
        }}
        initial={{ scale: 0 }}
        animate={{
          scale: isHovered ? 25 : 0,
        }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      />
    </>
  );

  const commonProps = {
    ref: buttonRef,
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    className: clsx(baseStyles, variantStyles[variant], className)
  };

  if (href) {
    return (
      <Link href={href} {...commonProps}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} {...commonProps}>
      {content}
    </button>
  );
}
