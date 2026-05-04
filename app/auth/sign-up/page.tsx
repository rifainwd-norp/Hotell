'use client';

import { useActionState } from 'react';
import { signUpWithEmail } from '../actions';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, null);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center text-slate-950 font-serif font-bold text-2xl mx-auto mb-6">
            A
          </div>
          <h1 className="text-3xl font-serif text-white mb-2 tracking-tight">Create Admin</h1>
          <p className="text-slate-400 font-sans">Initialize management access</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-sans text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              name="name" 
              type="text" 
              required 
              placeholder="John Doe"
              className="w-full bg-slate-900 border border-gold-500/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-sans text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="admin@aureumgrand.com"
              className="w-full bg-slate-900 border border-gold-500/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-sans text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-gold-500/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-slate-600"
            />
          </div>

          {state?.error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm text-center"
            >
              {state.error}
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-slate-950 font-sans font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(212,175,55,0.2)] mt-8"
          >
            {isPending ? 'Creating...' : 'Create Admin Account'}
          </button>
        </form>

        <div className="mt-12 text-center">
          <Link href="/auth/sign-in" className="text-slate-500 hover:text-white transition-colors text-sm font-sans">
            Already have an account? Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
