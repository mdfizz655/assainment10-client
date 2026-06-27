"use client";
import { useSession } from "next-auth/react";
import { BadgeCheck, Files, Crown, ExternalLink, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Profile() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ promptCount: 0 });
  const isPremium = session?.user?.status === "Premium";

  useEffect(() => {
    if (session?.user?.email) {
      const token = localStorage.getItem("access-token");
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-stats/${session.user.email}`, {
        headers: { authorization: `Bearer ${token}` }
      }).then(res => setStats(res.data)).catch(err => console.error(err));
    }
  }, [session]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header><h1 className="text-4xl font-black text-white uppercase italic tracking-tight">Account Overview</h1></header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0F172A] border border-white/5 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8">
            <div className={`w-24 h-24 rounded-3xl p-1 ${isPremium ? 'bg-green-500' : 'bg-cyan-500'}`}>
                <div className="w-full h-full rounded-[1.4rem] bg-[#020617] flex items-center justify-center text-4xl font-black text-white">{session?.user?.name?.charAt(0)}</div>
            </div>
            <div className="text-center md:text-left space-y-3">
                <h2 className="text-3xl font-bold text-white">{session?.user?.name}</h2>
                <p className="text-slate-400 font-medium">{session?.user?.email}</p>
                <div className="flex gap-3 font-black">
                    <span className="bg-white/5 text-cyan-400 border border-white/10 px-4 py-1.5 rounded-xl text-[10px] uppercase">Role: {session?.user?.role}</span>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] uppercase border ${isPremium ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>Plan: {session?.user?.status || 'Free'}</span>
                </div>
            </div>
        </div>
        {!isPremium && (
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl">
              <div><Crown className="mb-4 text-white/50" /><h4 className="text-xl font-bold mb-2">PROMPTLY. Pro</h4><p className="text-indigo-100/70 text-sm">Unlock all private prompts and priority support.</p></div>
              <Link href="/dashboard/payment" className="bg-white text-indigo-600 w-full py-4 rounded-2xl font-black text-center text-xs uppercase tracking-widest hover:bg-slate-100 transition shadow-lg">Upgrade Now ($5)</Link>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-black">
          <div className="bg-[#0F172A] border border-white/5 p-8 rounded-[2rem] flex items-center gap-6">
            <div className="p-4 bg-white/5 rounded-2xl"><Files className="text-cyan-500" /></div>
            <div><p className="text-slate-500 text-[10px] uppercase mb-2">Prompts Published</p><h4 className="text-3xl font-bold text-white">{stats.promptCount}</h4></div>
          </div>
          <div className="bg-[#0F172A] border border-white/5 p-8 rounded-[2rem] flex items-center gap-6">
            <div className="p-4 bg-white/5 rounded-2xl"><BadgeCheck className="text-green-500" /></div>
            <div><p className="text-slate-500 text-[10px] uppercase mb-2">Account Status</p><h4 className="text-3xl font-bold text-green-400">Verified Member</h4></div>
          </div>
      </div>
    </div>
  );
}