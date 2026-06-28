"use client";
import { useState } from "react";
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(""); 
  const tags = ["Cyberpunk", "LogoDesign", "SaaS_Ideas", "Coding", "Marketing"];

  
  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/prompts?search=${searchTerm}`);
    }
  };

  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  
  const handleTagClick = (tag) => {
    router.push(`/prompts?search=${tag}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#05070A] pt-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8 tracking-tighter uppercase italic">
                Prompts That <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
                    Spark Genius.
                </span>
            </h1>

            {/* Search Bar Area */}
            <div className="max-w-2xl mx-auto mb-10 relative group">
                <div className="relative flex items-center bg-[#0F172A] border-2 border-white/10 p-2 rounded-2xl focus-within:border-violet-500 transition-all shadow-2xl">
                    <Search className="ml-4 text-slate-500" size={20} />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        onKeyDown={handleKeyDown} 
                        placeholder="Search Midjourney, ChatGPT, Claude..." 
                        className="w-full p-4 bg-transparent outline-none text-white font-medium placeholder:text-slate-600" 
                    />
                    <button 
                        onClick={handleSearch} 
                        className="bg-white text-black px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-violet-600 hover:text-white transition-all active:scale-95"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Trending Tags */}
            <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">
                <span>Trending:</span>
                {tags.map(tag => (
                  <span 
                    key={tag} 
                    onClick={() => handleTagClick(tag)} 
                    className="text-white hover:text-yellow-400 cursor-pointer transition-colors border-b border-transparent hover:border-yellow-400"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
          </motion.div>
      </div>
    </section>
  );
};

export default Hero;