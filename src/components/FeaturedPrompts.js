"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Copy, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";

const FeaturedPrompts = () => {
  const { data: session } = useSession();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/featured-prompts`).then(res => {
      setPrompts(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-24 bg-[#05070A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16 gap-6 text-white">
          <div><h2 className="text-4xl font-black uppercase italic tracking-tighter">Featured Prompts</h2><p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">Verified neural instructions</p></div>
          <Link href="/prompts" className="text-xs font-black border-b-2 border-violet-600 pb-1 hover:text-violet-400 uppercase flex items-center gap-2">Catalog <ArrowRight size={14}/></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? [1,2,3].map(i => <div key={i} className="h-64 bg-white/5 rounded-[2.5rem] animate-pulse"></div>) : 
           prompts.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-[#0F172A] border border-white/5 p-8 rounded-[2.5rem] hover:border-violet-500/30 transition-all">
                <span className="bg-violet-600/10 text-violet-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mb-4 inline-block">{p.aiTool}</span>
                <h3 className="text-xl font-bold text-white mb-2 uppercase line-clamp-1">{p.title}</h3>
                <p className="text-xs text-slate-500 mb-8 line-clamp-2 italic">"{p.description}"</p>
                <Link href={session ? `/prompts/${p._id}` : "/login"} className="w-full py-4 bg-white/5 border border-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-violet-600 transition-all"><Eye size={16}/> View Details</Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturedPrompts;