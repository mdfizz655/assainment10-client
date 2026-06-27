"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Eye, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";

const FeaturedPrompts = () => {
  const { data: session } = useSession();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/featured-prompts`);
        setPrompts(res.data);
      } catch (error) {
        console.error("Error fetching featured prompts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-24 bg-[#05070A]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
              Featured Prompts<span className="text-violet-500">.</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-3">Handpicked neural instructions for peak creativity</p>
          </div>
          <Link href="/prompts" className="group flex items-center gap-2 text-xs font-black text-white border-b-2 border-violet-600 pb-1 hover:text-violet-400 transition-all uppercase tracking-widest">
            Explore All Catalog <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid Area */}
        {loading ? (
            <div className="text-center py-20 font-black text-white animate-pulse uppercase tracking-widest">Syncing Marketplace...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prompts.map((prompt, index) => (
                <motion.div 
                key={prompt._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-[#0F172A] border border-white/5 p-8 rounded-[2.5rem] hover:border-violet-500/30 transition-all relative overflow-hidden"
                >
                <div className="flex justify-between items-start mb-6">
                    <span className="bg-violet-600/10 text-violet-400 border border-violet-600/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {prompt.aiTool}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase">
                    <Copy size={12} /> {prompt.copyCount || 0}
                    </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 uppercase group-hover:text-violet-400 transition-colors">{prompt.title}</h3>
                <p className="text-xs text-slate-500 font-medium mb-8 line-clamp-2 italic">"{prompt.description}"</p>
                
                {/* View Details Logic: লগইন না থাকলে /login এ পাঠাবে */}
                <Link 
                    href={session ? `/prompts/${prompt._id}` : "/login"} 
                    className="flex items-center justify-center gap-2 w-full py-4 bg-white/[0.03] border border-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] group-hover:bg-violet-600 group-hover:border-violet-500 transition-all"
                >
                    <Eye size={16} /> View Details
                </Link>
                </motion.div>
            ))}
            </div>
        )}

        {/* যদি ডাটা না থাকে */}
        {!loading && prompts.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem]">
                <p className="text-slate-600 font-bold uppercase text-xs">No neural data broadcasted yet.</p>
            </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPrompts;