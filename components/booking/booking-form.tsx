"use client";

import MagneticButton from "@/components/magnetic-button";
import { createBooking } from "@/lib/actions/bookings";
import { useState } from "react";
import { PremiumDatePicker } from "./PremiumDatePicker";

export function BookingForm() {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().getTime() + 86400000).toISOString().split('T')[0];
  const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(form);
    const result = await createBooking(formData);
    
    setStatus(result);
    setIsSubmitting(false);

    if (result.success) {
      form.reset();
    }
  };

  if (status?.success) {
    return (
      <div className="text-center py-10 space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto border border-gold-500/20">
          <svg className="w-10 h-10 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif text-white uppercase tracking-widest">Request Received</h3>
        <p className="text-white/50 text-sm max-w-sm mx-auto leading-relaxed">
          Thank you for choosing AUREUM GRAND. Our private concierge will contact you within 2 hours to finalize your bespoke stay.
        </p>
        <button 
          onClick={() => setStatus(null)}
          className="text-gold-500 text-[10px] font-bold uppercase tracking-[0.3em] border-b border-gold-500/20 hover:border-gold-500 pb-1 transition-all"
        >
          Make Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
      <div className="space-y-4 group">
        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500/50 group-focus-within:text-gold-500 transition-colors">Full Name</label>
        <input 
          name="guest_name"
          type="text" 
          required
          placeholder="Enter your name"
          className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-gold-500 transition-all font-sans text-white placeholder:text-white/5 text-sm tracking-[0.2em] uppercase" 
        />
      </div>
      
      <div className="space-y-4 group">
        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500/50 group-focus-within:text-gold-500 transition-colors">Email Address</label>
        <input 
          name="guest_email"
          type="email" 
          required
          placeholder="email@domain.com"
          className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-gold-500 transition-all font-sans text-white placeholder:text-white/5 text-sm tracking-[0.2em]" 
        />
      </div>

      <div className="space-y-4 group">
        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500/50 group-focus-within:text-gold-500 transition-colors">Desired Suite Type</label>
        <div className="relative">
          <select 
            name="room_type"
            required
            defaultValue=""
            className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-gold-500 transition-all font-sans text-white text-sm tracking-[0.2em] uppercase appearance-none cursor-pointer pr-10"
          >
            <option value="" disabled className="bg-slate-950">SELECT CATEGORY</option>
            <option value="deluxe" className="bg-slate-950">Deluxe Room</option>
            <option value="executive" className="bg-slate-950">Executive Suite</option>
            <option value="presidential" className="bg-slate-950">Presidential Villa</option>
          </select>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gold-500/50 group-focus-within:text-gold-500 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 md:col-span-1">
        <PremiumDatePicker label="Check-In" name="check_in" defaultValue={today} />
        <PremiumDatePicker label="Check-Out" name="check_out" defaultValue={tomorrow} />
      </div>

      {status?.error && (
        <div className="md:col-span-2 text-rose-500 text-[10px] font-bold uppercase tracking-[0.2em] text-center bg-rose-500/5 border border-rose-500/10 py-4 rounded-2xl animate-pulse">
          {status.error}
        </div>
      )}

      <div className="md:col-span-2 pt-12 flex justify-center">
        <MagneticButton
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className={`px-20 py-5 text-[11px] font-bold uppercase tracking-[0.4em] rounded-none shadow-2xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Sending Request...' : 'Inquire Bespoke Stay'}
        </MagneticButton>
      </div>
    </form>
  );
}
