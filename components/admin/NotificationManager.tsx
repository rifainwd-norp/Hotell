"use client";

import { useEffect, useState, useRef } from "react";
import { HiOutlineBell, HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Booking } from "@/lib/types";

export function NotificationManager() {
  const [newBookingCount, setNewBookingCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);
  const prevCountRef = useRef(0);

  useEffect(() => {
    async function checkNewBookings() {
      try {
        const res = await fetch("/api/admin/bookings/list");
        const bookings: Booking[] = await res.json();
        
        // Filter pending bookings (new ones)
        const pending = bookings.filter((b: Booking) => b.status === "pending");
        const currentCount = pending.length;

        // If count increased, show toast
        if (currentCount > prevCountRef.current && prevCountRef.current !== 0) {
          const latest = pending[0]; // Assuming sorted by desc
          if (latest.id !== lastNotificationId) {
             setLastNotificationId(latest.id);
             setShowToast(true);
             // Auto hide after 10 seconds
             setTimeout(() => setShowToast(false), 10000);
          }
        }
        
        setNewBookingCount(currentCount);
        prevCountRef.current = currentCount;
      } catch (err) {
        console.error("Notification Polling Error:", err);
      }
    }

    // Initial check
    checkNewBookings();

    // Poll every 20 seconds
    const interval = setInterval(checkNewBookings, 20000);
    return () => clearInterval(interval);
  }, [lastNotificationId]);

  return (
    <>
      {/* Top Header Notification Badge (Always visible in layout) */}
      <div className="fixed top-8 right-12 z-50 flex items-center gap-4 no-print">
        <div className="relative group">
           <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 group-hover:text-gold-500 group-hover:border-gold-500/50 transition-all cursor-pointer backdrop-blur-md">
              <HiOutlineBell className="text-2xl" />
              {newBookingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-slate-900 animate-pulse">
                  {newBookingCount}
                </span>
              )}
           </div>
           
           {/* Dropdown/Hover Info */}
           <div className="absolute top-full right-0 mt-4 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-3">Recent Alerts</p>
              {newBookingCount > 0 ? (
                <p className="text-xs text-white">You have <span className="text-gold-500 font-bold">{newBookingCount} pending</span> bookings awaiting your confirmation.</p>
              ) : (
                <p className="text-xs text-slate-600 italic">No new notifications at the moment.</p>
              )}
           </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 20, x: "-50%", scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6 no-print"
          >
            <div className="bg-slate-900/90 backdrop-blur-xl border border-gold-500/30 p-6 rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0 border border-gold-500/20">
                <HiOutlineBell className="text-2xl animate-bounce" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-serif font-bold text-lg">New Booking Received!</h4>
                <p className="text-slate-400 text-xs">A new guest reservation is awaiting your confirmation in the hub.</p>
              </div>
              <button 
                onClick={() => setShowToast(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <HiOutlineX className="text-xl" />
              </button>
            </div>
            {/* Progress Bar for Auto-hide */}
            <div className="absolute bottom-6 left-12 right-12 h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: "100%" }}
                 animate={{ width: 0 }}
                 transition={{ duration: 10, ease: "linear" }}
                 className="h-full bg-gold-500/50"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
