"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Pre-calculate dates outside the component to keep the component pure
// and avoid impure function calls (Date.now) during the render phase.
// These act as session-stable constants.
const now = new Date();
const INITIAL_TODAY = now.toISOString().split('T')[0];
const INITIAL_TOMORROW = new Date(now.getTime() + 86400000).toISOString().split('T')[0];

export function WalkInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      room_type: formData.get("room_type"),
      guest_name: formData.get("guest_name"),
      guest_email: formData.get("guest_email"),
      check_in: formData.get("check_in"),
      check_out: formData.get("check_out"),
      status: "checked_in"
    };

    try {
      const response = await fetch("/api/admin/bookings/walk-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/admin/bookings");
        router.refresh();
      } else {
        setError(result.error || "Failed to create walk-in check-in");
      }
    } catch (err) {
      console.error("Walk-in Error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  const roomTypes = [
    "Deluxe Room",
    "Executive Suite",
    "Presidential Villa"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Room Type</label>
          <select 
            name="room_type" 
            required 
            className="w-full bg-slate-950 border border-gold-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all appearance-none"
          >
            <option value="">Select Room Category...</option>
            {roomTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Guest Name</label>
          <input 
            name="guest_name" 
            type="text" 
            required 
            placeholder="Guest Full Name"
            className="w-full bg-slate-950 border border-gold-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Guest Email (Optional)</label>
          <input 
            name="guest_email" 
            type="email" 
            placeholder="guest@example.com (optional)"
            className="w-full bg-slate-950 border border-gold-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Check-in</label>
            <input 
              name="check_in" 
              type="date" 
              required 
              defaultValue={INITIAL_TODAY}
              className="w-full bg-slate-950 border border-gold-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-sans text-slate-400 uppercase tracking-wider">Check-out</label>
            <input 
              name="check_out" 
              type="date" 
              required 
              defaultValue={INITIAL_TOMORROW}
              className="w-full bg-slate-950 border border-gold-500/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all" 
            />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-sans font-bold py-4 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-gold-500/20"
        >
          {loading ? "Processing Check-in..." : "Confirm Walk-in Check-in"}
        </button>
      </div>
    </form>
  );
}
