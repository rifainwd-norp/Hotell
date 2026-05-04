import RoomListing from "../../components/room-listing";
import { getRooms } from "@/lib/data";

export default async function RoomPage() {
  const rooms = await getRooms();

  return (
    <main className="pt-[160px] bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-12 mb-24">
        <span className="text-gold-500 font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block">
          Accommodations
        </span>
        <h1 className="text-6xl font-serif text-white italic mb-12">
          Private Sanctuaries
        </h1>
        <p className="text-white/40 max-w-2xl font-light text-lg leading-relaxed">
          From the soaring heights of our Presidential Villa to the intimate luxury of our Executive Suites, discover a space tailored for your absolute comfort.
        </p>
      </div>

      <RoomListing initialData={rooms} />
    </main>
  );
}
