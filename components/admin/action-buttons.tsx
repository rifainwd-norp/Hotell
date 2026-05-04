"use client";

import { deleteRoom, deleteBooking } from "@/lib/actions/admin";
import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { 
  HiOutlineTrash, 
  HiOutlineCheck, 
  HiOutlineLogin, 
  HiOutlineLogout, 
  HiOutlineCalendar,
  HiOutlineX,
  HiOutlineClock,
  HiOutlineInformationCircle,
  HiOutlinePrinter,
  HiOutlineSwitchHorizontal,
  HiOutlineHome
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

// Helper: Premium IDR Formatter
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IDR",
    currencyDisplay: "code",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper: Custom Modal Component
function ActionModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onConfirm, 
  confirmText = "Confirm", 
  confirmColor = "bg-gold-500",
  loading = false,
  extraAction
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  children: React.ReactNode, 
  onConfirm: () => void,
  confirmText?: string,
  confirmColor?: string,
  loading?: boolean,
  extraAction?: React.ReactNode
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 no-print">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-slate-900 border border-white/10 w-full max-w-md max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm shrink-0">
            <h3 className="text-xl font-serif text-white">{title}</h3>
            <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all">
              <HiOutlineX className="text-2xl" />
            </button>
          </div>

          {/* Body (Scrollable) */}
          <div className="p-8 overflow-y-auto flex-1 custom-scrollbar-visible">
            {children}
          </div>

          {/* Footer (Fixed) */}
          <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-sm shrink-0 space-y-3">
            {extraAction}
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                disabled={loading}
                className={clsx(
                  "flex-1 px-6 py-4 rounded-2xl text-slate-950 font-bold transition-all active:scale-95 disabled:opacity-50 text-xs uppercase tracking-widest",
                  confirmColor
                )}
              >
                {loading ? "Processing..." : confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function CheckInBookingButton({ 
  id, 
  disabled = false, 
  title = "",
  alternativeRoomId = null,
  alternativeRoomName = null
}: { 
  id: string, 
  disabled?: boolean, 
  title?: string,
  alternativeRoomId?: string | null,
  alternativeRoomName?: string | null
}) {
  const [loading, setLoading] = useState(false);

  async function handleCheckIn() {
    try {
      setLoading(true);
      
      // 1. If room is occupied but we have an alternative, switch first
      if (disabled && alternativeRoomId) {
        const switchRes = await fetch("/api/admin/bookings/change-room", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: id, newRoomId: alternativeRoomId }),
        });
        const switchData = await switchRes.json();
        if (!switchData.success) {
          alert("Failed to switch room: " + switchData.error);
          setLoading(false);
          return;
        }
      } else if (disabled && !alternativeRoomId) {
        return; // Truly stuck
      }

      // 2. Perform Check-in
      const response = await fetch("/api/admin/bookings/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      
      const result = await response.json();
      if (result?.success) window.location.reload();
      else alert("Failed: " + (result?.error || "Unknown error"));
    } catch (err) {
      console.error(err);
      alert("An error occurred during check-in.");
    } finally {
      setLoading(false);
    }
  }

  const canAutoAssign = disabled && alternativeRoomId;

  return (
    <button 
      onClick={handleCheckIn}
      disabled={loading || (disabled && !canAutoAssign)}
      title={canAutoAssign ? `Will automatically move to ${alternativeRoomName}` : (title || (disabled ? "Room is still occupied" : ""))}
      className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
        canAutoAssign 
          ? "bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/20"
          : disabled 
            ? "bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5" 
            : "bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white"
      )}
    >
      <HiOutlineLogin className="text-lg" />
      {canAutoAssign ? `Check In (${alternativeRoomName})` : disabled ? "Room Occupied" : "Check In"}
    </button>
  );
}

export function ChangeRoomButton({ 
  bookingId, 
  currentRoomName, 
  availableRoomsOfSameType 
}: { 
  bookingId: string, 
  currentRoomName: string,
  availableRoomsOfSameType: { id: string, name: string }[]
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!selectedRoomId) return;
    try {
      setLoading(true);
      const response = await fetch("/api/admin/bookings/change-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, newRoomId: selectedRoomId }),
      });
      const result = await response.json();
      if (result?.success) window.location.reload();
      else alert("Error: " + result.error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white font-bold text-[10px] uppercase tracking-widest transition-all border border-purple-500/20"
        title="Switch to another available room"
      >
        <HiOutlineSwitchHorizontal className="text-lg" />
        Switch Room
      </button>

      <ActionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Change Guest Room"
        confirmText="Confirm Swap"
        confirmColor="bg-purple-500"
        loading={loading}
        onConfirm={handleConfirm}
      >
        <div className="space-y-6">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
             <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Current Assignment</p>
             <p className="text-white font-bold text-lg">{currentRoomName}</p>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] uppercase tracking-widest text-gold-500 font-bold ml-1">Available Rooms (Same Type)</label>
             <div className="grid grid-cols-1 gap-2">
                {availableRoomsOfSameType.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-4 text-center border border-white/5 rounded-2xl">No other rooms of this type are available right now.</p>
                ) : (
                  availableRoomsOfSameType.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className={clsx(
                        "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                        selectedRoomId === room.id 
                          ? "bg-purple-500/20 border-purple-500 text-white" 
                          : "bg-white/2 border-white/5 text-slate-400 hover:border-white/20"
                      )}
                    >
                      <HiOutlineHome className={clsx("text-xl", selectedRoomId === room.id ? "text-purple-400" : "text-slate-600")} />
                      <span className="font-bold">{room.name}</span>
                      {selectedRoomId === room.id && <HiOutlineCheck className="ml-auto text-purple-400 text-xl" />}
                    </button>
                  ))
                )}
             </div>
          </div>
        </div>
      </ActionModal>
    </>
  );
}

export function CheckOutBookingButton({ 
  id, 
  checkInDate,
  checkOutDate, 
  roomPrice = 0 
}: { 
  id: string; 
  checkInDate?: string | Date;
  checkOutDate?: string | Date; 
  roomPrice?: number 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [penalty, setPenalty] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Calculate systematic penalty
  const calculatedPenalty = useMemo(() => {
    if (!checkOutDate) return 0;
    
    const now = new Date();
    const scheduled = new Date(checkOutDate);
    scheduled.setHours(12, 0, 0, 0); // Standard checkout 12:00 PM

    if (now <= scheduled) return 0;

    const diffMs = now.getTime() - scheduled.getTime();
    const msPerHour = 1000 * 60 * 60;
    const msPerDay = msPerHour * 24;

    const daysLate = Math.floor(diffMs / msPerDay);
    const remainingMs = diffMs % msPerDay;
    const extraHoursLate = Math.ceil(remainingMs / msPerHour);

    let total = (daysLate * roomPrice);
    total += (extraHoursLate * 50000);

    return total;
  }, [checkOutDate, roomPrice]);

  // Calculate base stay cost (Real-time: check-in until checkout)
  const stayDetails = useMemo(() => {
    if (!checkInDate || !checkOutDate) return { nights: 0, cost: 0 };
    
    const start = new Date(checkInDate);
    const scheduledEnd = new Date(checkOutDate);
    const now = new Date();
    
    const actualEnd = now < scheduledEnd ? now : scheduledEnd;
    
    const diffTime = Math.max(0, actualEnd.getTime() - start.getTime());
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    
    return {
      nights,
      cost: nights * roomPrice
    };
  }, [checkInDate, checkOutDate, roomPrice]);

  const handleOpen = () => {
    setPenalty(calculatedPenalty);
    setIsOpen(true);
  };

  async function handleConfirm() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/bookings/check-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, penalty }),
      });
      
      const result = await response.json();
      if (result?.success) window.location.reload();
      else alert("Error: " + result.error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const grandTotal = stayDetails.cost + penalty;

  const handlePrint = () => {
    window.print();
  };

  const notaContent = (
    <div className="print-only nota-portal-container p-4 text-black bg-white font-sans max-w-[80mm] mx-auto text-[10px] break-inside-avoid">
        <div className="text-center border-b border-black border-dashed pb-3 mb-3">
          <h1 className="text-lg font-bold uppercase tracking-wider mb-0.5">Nota Pembayaran</h1>
          <p className="text-[9px] font-bold">HOTEL RECEPTION HUB</p>
        </div>

        <div className="space-y-0.5 mb-3 text-[8px]">
          <div className="flex justify-between">
            <span>No. Nota:</span>
            <span className="font-bold">#NT-{id.slice(0, 6).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{new Date().toLocaleDateString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span>Check-in:</span>
            <span>{checkInDate ? new Date(checkInDate).toLocaleDateString('id-ID') : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span>Durasi:</span>
            <span>{stayDetails.nights} Malam</span>
          </div>
        </div>

        <div className="border-t border-b border-black border-dashed py-2 mb-3 space-y-1.5">
          <div className="flex justify-between font-bold text-[8px]">
            <span>Deskripsi</span>
            <span>Subtotal</span>
          </div>
          <div className="flex justify-between text-[8px]">
            <div className="flex flex-col">
               <span>Biaya Kamar</span>
               <span className="text-[7px] opacity-60">({formatIDR(roomPrice)} x {stayDetails.nights})</span>
            </div>
            <span>{formatIDR(stayDetails.cost)}</span>
          </div>
          {penalty > 0 && (
            <div className="flex justify-between text-[8px]">
              <span>Denda Keterlambatan</span>
              <span>{formatIDR(penalty)}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold uppercase">Total Bayar:</span>
          <span className="text-base font-bold">{formatIDR(grandTotal)}</span>
        </div>

        <div className="text-center space-y-3">
          <p className="text-[7px] italic opacity-70">*** Terima Kasih ***</p>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-black border-dashed break-inside-avoid">
            <div className="text-center">
              <p className="text-[6px] uppercase mb-4">Resepsionis</p>
              <div className="h-4"></div>
              <p className="text-[7px]">( ________ )</p>
            </div>
            <div className="text-center">
              <p className="text-[6px] uppercase mb-4">Tamu</p>
              <div className="h-4"></div>
              <p className="text-[7px]">( ________ )</p>
            </div>
          </div>
        </div>
    </div>
  );

  return (
    <>
      <button 
        onClick={handleOpen}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-all"
      >
        <HiOutlineLogout className="text-lg" />
        Check Out
      </button>

      <ActionModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Billing Summary"
        confirmText="Confirm & Settle"
        confirmColor="bg-emerald-500"
        loading={loading}
        onConfirm={handleConfirm}
        extraAction={(
          <button 
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-500 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-500/10 transition-all active:scale-[0.98]"
          >
            <HiOutlinePrinter className="text-lg" />
            Print Guest Nota
          </button>
        )}
      >
        <div className="space-y-6">
          {/* Stay Info */}
          <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 uppercase tracking-widest flex items-center gap-2"><HiOutlineInformationCircle /> Stay Duration</span>
              <span className="text-gold-500 font-bold">
                {stayDetails.nights} {stayDetails.nights > 1 ? 'Nights' : 'Night'}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] pt-4 border-t border-white/5">
              <div className="text-left">
                <span className="text-slate-500 uppercase tracking-widest block mb-1">Check-in</span>
                <span className="text-slate-200 font-medium">{checkInDate ? new Date(checkInDate).toLocaleDateString('en-GB') : 'N/A'}</span>
              </div>
              <div className="text-right">
                <span className="text-rose-500 uppercase tracking-widest block mb-1 font-bold">Actual Check-out</span>
                <span className="text-rose-400 font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Today</span>
              </div>
            </div>
          </div>

          {/* Billing Details */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold-500/70 font-bold ml-2">Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/2 border border-white/5">
                <div>
                  <p className="text-white text-sm font-medium">Room Rate</p>
                  <p className="text-[10px] text-slate-500">{formatIDR(roomPrice)} x {stayDetails.nights} Nights</p>
                </div>
                <span className="text-white font-bold">{formatIDR(stayDetails.cost)}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                  <div>
                    <p className="text-rose-500 text-sm font-medium flex items-center gap-2">
                      <HiOutlineClock /> Penalty Fee
                    </p>
                  </div>
                  <div className="text-right">
                    <input 
                      type="number" 
                      value={penalty}
                      onChange={(e) => setPenalty(Number(e.target.value))}
                      className="w-24 bg-transparent text-right text-rose-500 font-bold border-b border-rose-500/20 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="pt-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex justify-between items-center">
              <div>
                <p className="text-emerald-500 text-[10px] uppercase tracking-widest font-bold">Grand Total</p>
                <p className="text-slate-400 text-[9px] italic mt-0.5">Settlement at reception desk</p>
              </div>
              <span className="text-2xl font-serif font-bold text-emerald-500">{formatIDR(grandTotal)}</span>
            </div>
          </div>
        </div>
      </ActionModal>

      {/* PORTAL FOR PRINTING (Ensures 1 page and clean background) */}
      {mounted && createPortal(notaContent, document.body)}
    </>
  );
}

export function ExtendStayButton({ id, currentCheckOut }: { id: string; currentCheckOut: string | Date }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Safe date conversion
  const initialDate = useMemo(() => {
    if (!currentCheckOut) return new Date().toISOString().split('T')[0];
    const date = new Date(currentCheckOut);
    return isNaN(date.getTime()) ? new Date().toISOString().split('T')[0] : date.toISOString().split('T')[0];
  }, [currentCheckOut]);

  const [newDate, setNewDate] = useState(initialDate);

  async function handleConfirm() {
    if (newDate === initialDate) return;
    try {
      setLoading(true);
      const response = await fetch("/api/admin/bookings/extend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, new_check_out: newDate }),
      });
      const result = await response.json();
      if (result?.success) window.location.reload();
      else alert("Error: " + result.error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/10 text-gold-500 hover:bg-gold-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-all"
      >
        <HiOutlineCalendar className="text-lg" />
        Extend
      </button>

      <ActionModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Extend Stay Duration"
        confirmText="Update Checkout"
        confirmColor="bg-gold-500"
        loading={loading}
        onConfirm={handleConfirm}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400">Select the new check-out date for this guest.</p>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">New Check-Out Date</label>
            <input 
              type="date" 
              value={newDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-lg text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>
        </div>
      </ActionModal>
    </>
  );
}

export function DeleteRoomButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  async function handleDelete() {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      setLoading(true);
      const result = await deleteRoom(id);
      if (result?.error) alert(result.error);
      else window.location.reload();
    } catch {
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <button onClick={handleDelete} disabled={loading} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all">
      <HiOutlineTrash className="text-xl" />
    </button>
  );
}

export function DeleteBookingButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      setLoading(true);
      const result = await deleteBooking(id);
      if (result?.error) alert(result.error);
      else window.location.reload();
    } catch {
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <button onClick={handleDelete} disabled={loading} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all">
      <HiOutlineTrash className="text-xl" />
    </button>
  );
}

export function ConfirmBookingButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  async function handleConfirm() {
    setLoading(true);
    const res = await fetch("/api/admin/bookings/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if ((await res.json()).success) window.location.href = "/admin/reception";
    setLoading(false);
  }
  return (
    <button onClick={handleConfirm} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-all">
      <HiOutlineCheck className="text-lg" />
      Confirm
    </button>
  );
}
