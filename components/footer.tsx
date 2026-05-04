import Link from "next/link";
import { IoLocationOutline, IoCallOutline, IoMailOutline } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-[128px] pb-12 border-t border-gold-500/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col items-center justify-center text-center mb-24">
          <Link href="/" className="inline-block mb-12 group">
            <span className="text-3xl font-bold font-serif tracking-[0.3em] text-gold-500">
              AUREUM GRAND<span className="text-white group-hover:text-gold-300 transition-colors">.</span>
            </span>
          </Link>
          
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-20">
            {['Privacy Policy', 'Contact Us', 'Careers', 'Press', 'Lifestyle'].map((item) => (
              <Link 
                key={item} 
                href="#" 
                className="text-white/30 hover:text-gold-500 transition-all duration-300 text-[10px] uppercase tracking-[0.2em] font-medium"
              >
                {item}
              </Link>
            ))}
          </div>
          
          <div className="w-24 h-px bg-gold-500/20 mb-12" />
          
          <p className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-light max-w-lg leading-relaxed">
            © {new Date().getFullYear()} AUREUM GRAND HOTELS & RESORTS. <br className="md:hidden" /> ALL RIGHTS RESERVED.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/5 opacity-40">
           <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-white/50">
             <IoLocationOutline className="text-gold-500 text-lg" />
             <span>123 Luxury Avenue, Maldives</span>
           </div>
           <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-white/50">
             <IoCallOutline className="text-gold-500 text-lg" />
             <span>+1 (800) 123-4567</span>
           </div>
           <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-white/50">
             <IoMailOutline className="text-gold-500 text-lg" />
             <span>concierge@aureumgrand.com</span>
           </div>
        </div>
      </div>
    </footer>
  );
}
