"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { HiOutlineCalendar, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import clsx from "clsx";

interface PremiumDatePickerProps {
  label: string;
  name: string;
  defaultValue?: string;
}

export function PremiumDatePicker({ label, name, defaultValue }: PremiumDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(defaultValue ? new Date(defaultValue) : new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date(selectedDate));
  const containerRef = useRef<HTMLDivElement>(null);
  const [popoverCoords, setPopoverCoords] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Formatting for the input field
  const formattedDisplay = selectedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();

  const isoValue = selectedDate.toISOString().split('T')[0];

  // Calendar logic
  const daysInMonth = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    
    const prevMonthDays = new Date(year, month, 0).getDate();
    const padding = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      padding.push({ day: prevMonthDays - i, current: false });
    }
    
    const main = [];
    for (let i = 1; i <= days; i++) {
      main.push({ day: i, current: true });
    }
    
    return [...padding, ...main];
  }, [viewDate]);

  const monthName = viewDate.toLocaleString('default', { month: 'long' }).toUpperCase();
  const year = viewDate.getFullYear();

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() + offset);
    setViewDate(newDate);
  };

  const handleSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelectedDate(newDate);
    setIsOpen(false);
  };

  const toggleOpen = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPopoverCoords({
        top: rect.bottom + window.scrollY,
        left: Math.min(rect.left + window.scrollX, window.innerWidth - 300), // Prevent off-screen
        width: rect.width
      });
    }
    setIsOpen(!isOpen);
  };

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Also check if clicked on portal content
        const portal = document.getElementById("calendar-portal-root");
        if (portal && portal.contains(event.target as Node)) return;
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calendarContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          style={{ 
            position: 'absolute',
            top: popoverCoords.top + 10,
            left: popoverCoords.left,
            zIndex: 9999
          }}
          className="w-72 bg-slate-900 border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button 
              type="button"
              onClick={() => changeMonth(-1)}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-white/5 text-slate-400 hover:text-white hover:border-white/20 transition-all"
            >
              <HiChevronLeft />
            </button>
            <div className="text-center">
              <p className="text-[10px] font-bold text-gold-500 tracking-widest">{monthName}</p>
              <p className="text-xs text-white font-serif">{year}</p>
            </div>
            <button 
              type="button"
              onClick={() => changeMonth(1)}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-white/5 text-slate-400 hover:text-white hover:border-white/20 transition-all"
            >
              <HiChevronRight />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-[8px] text-slate-600 font-bold text-center">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((d, i) => {
              const isSelected = d.current && 
                d.day === selectedDate.getDate() && 
                viewDate.getMonth() === selectedDate.getMonth() && 
                viewDate.getFullYear() === selectedDate.getFullYear();
              
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!d.current}
                  onClick={() => handleSelect(d.day)}
                  className={clsx(
                    "w-8 h-8 text-[10px] rounded-full flex items-center justify-center transition-all",
                    !d.current ? "text-slate-800 pointer-events-none" : "text-white hover:bg-gold-500/10 hover:text-gold-500",
                    isSelected && "bg-gold-500 text-slate-950 font-bold hover:bg-gold-500 hover:text-slate-950 shadow-lg shadow-gold-500/20"
                  )}
                >
                  {d.day}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-4 group relative" ref={containerRef}>
      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500/50 group-focus-within:text-gold-500 transition-colors">
        {label}
      </label>
      
      <div 
        onClick={toggleOpen}
        className="w-full bg-transparent border-b border-white/10 py-4 flex items-center justify-between cursor-pointer group hover:border-gold-500/50 transition-all"
      >
        <span className="text-white text-sm tracking-[0.2em] font-sans">
          {formattedDisplay}
        </span>
        <HiOutlineCalendar className="text-gold-500/30 group-hover:text-gold-500 transition-all text-lg" />
        <input type="hidden" name={name} value={isoValue} />
      </div>

      {mounted && createPortal(calendarContent, document.body)}
    </div>
  );
}
