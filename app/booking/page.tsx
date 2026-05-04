import { getRooms } from "@/lib/data";
import { BookingForm } from "@/components/booking/booking-form";
import { Suspense } from "react";

export default async function BookingPage() {
  const rooms = await getRooms();

  return (
    <main className="bg-slate-950 min-h-screen pt-[200px] pb-[128px]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          
          {/* Left Side: Text Content */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="h-px w-12 bg-gold-500/50" />
                <span className="text-gold-500 font-bold uppercase tracking-[0.4em] text-[10px]">Reservation</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-serif text-white uppercase leading-[1.1] tracking-widest">
                Secure Your <br />
                <span className="text-gold-500 italic">Sanctuary</span>
              </h1>
            </div>

            <div className="space-y-8 text-white/40 font-light leading-relaxed text-sm">
              <p>
                Experience the pinnacle of luxury. Fill out the reservation inquiry form, 
                and our private concierge team will tailor your stay to your exact desires.
              </p>
              <div className="pt-8 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-widest text-[10px]">Direct Line</span>
                  <span className="text-white font-medium">+1 (800) AUREUM-01</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-widest text-[10px]">Concierge</span>
                  <span className="text-white font-medium">butler@aureumgrand.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Booking Form */}
          <div className="lg:col-span-7 bg-white/2 border border-white/5 p-12 lg:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <Suspense fallback={<div className="text-white/20 uppercase tracking-widest text-[10px] text-center py-20">Initializing Concierge...</div>}>
              <BookingForm rooms={rooms} />
            </Suspense>
          </div>

        </div>
      </div>
    </main>
  );
}
