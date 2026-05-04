import { sql } from "@/lib/db";
import { Room } from "@/lib/types";
import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { WalkInForm } from "@/components/admin/walk-in-form";

export const dynamic = "force-dynamic";

export default async function WalkInPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header>
        <Link href="/admin/reception" className="text-slate-500 hover:text-gold-500 flex items-center gap-2 mb-4 transition-colors group">
          <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Reception
        </Link>
        <h1 className="text-3xl font-serif text-white">Walk-in Check-in</h1>
        <p className="text-slate-400 mt-1">Directly check-in a guest who has arrived at the hotel.</p>
      </header>

      <div className="bg-slate-900 rounded-2xl border border-gold-500/5 p-8">
        <WalkInForm />
      </div>
    </div>
  );
}

