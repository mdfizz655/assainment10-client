"use client";
import { useSession } from "next-auth/react";
import { BadgeCheck, Files, Star, Crown, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Profile() {
  const { data: session, status } = useSession();
  
  // ইউজার প্রিমিয়াম কি না তা চেক করা
  const isPremium = session?.user?.status === "Premium";

  if (status === "loading") {
    return <div className="min-h-[50vh] flex items-center justify-center font-black text-white animate-pulse uppercase tracking-widest">Accessing Profile Data...</div>;
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Account Overview</h1>
        <p className="text-slate-500 mt-2 font-medium">Control your prompt empire and subscription status.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 bg-[#0F172A] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <BadgeCheck size={120} className={isPremium ? "text-green-500" : "text-cyan-500"} />
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* User Avatar */}
                <div className={`w-32 h-32 rounded-3xl p-1 shadow-2xl transition-all ${isPremium ? 'bg-gradient-to-br from-green-400 to-emerald-600 shadow-green-500/20' : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20'}`}>
                    <div className="w-full h-full rounded-[1.4rem] bg-[#020617] flex items-center justify-center text-4xl font-black text-white">
                        {session?.user?.name?.charAt(0) || "U"}
                    </div>
                </div>

                <div className="text-center md:text-left space-y-3">
                    <h2 className="text-3xl font-bold text-white tracking-tight">{session?.user?.name || "Member"}</h2>
                    <p className="text-slate-400 font-medium">{session?.user?.email}</p>
                    <div className="flex gap-3 justify-center md:justify-start">
                        {/* Role Badge */}
                        <span className="bg-white/5 text-slate-400 border border-white/10 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          Role: {session?.user?.role || 'User'}
                        </span>
                        
                        {/* Plan Status Badge (Dynamic) */}
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            isPremium 
                            ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                            Plan: {session?.user?.status || 'Free'}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Upgrade Card / Status Card (Dynamic Logic) */}
        {!isPremium ? (
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-500/10 relative overflow-hidden group">
              <div className="relative z-10">
                  <Crown className="mb-4 text-white/50" />
                  <h4 className="text-xl font-bold mb-2">Pro Access</h4>
                  <p className="text-indigo-100/70 text-sm leading-relaxed">Unlock unlimited private prompts and priority support.</p>
              </div>
              <Link href="/dashboard/payment" className="relative z-10 bg-white text-indigo-600 w-full py-4 rounded-2xl font-black text-center text-xs uppercase tracking-widest hover:bg-slate-100 transition active:scale-95 shadow-lg flex items-center justify-center gap-2">
                  Upgrade Now ($5) <ExternalLink size={14} />
              </Link>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-green-500/10 relative overflow-hidden group border border-green-400/20">
              <div className="relative z-10">
                  <ShieldCheck className="mb-4 text-white/50" size={32} />
                  <h4 className="text-xl font-bold mb-2">Lifetime Active</h4>
                  <p className="text-green-50 text-sm leading-relaxed">Enjoy complete access to all Prompt Marketplace items!</p>
              </div>
              <div className="bg-white/10 border border-white/20 p-4 rounded-2xl text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Professional</span>
              </div>
          </div>
        )}
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={<Files className="text-cyan-500" />} label="Prompts Published" value="1" />
          <StatCard icon={<Star className="text-amber-500" />} label="Total Reviews" value="0" />
          <StatCard icon={<BadgeCheck className="text-green-500" />} label="Account Status" value="Verified" />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
    return (
        <div className="bg-[#0F172A] border border-white/5 p-8 rounded-[2rem] hover:border-cyan-500/20 transition-all hover:bg-white/[0.02]">
            <div className="mb-6 p-3 bg-white/5 w-fit rounded-2xl">{icon}</div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
            <h4 className="text-3xl font-bold text-white">{value}</h4>
        </div>
    );
}