"use client";
import { useState, useEffect } from "react";
import PromptCard from "@/components/PromptCard";
import axios from "axios";
import { Search, SlidersHorizontal, Sparkles, Loader2 } from "lucide-react";




export default function AllPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  




  // Search & Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tool, setTool] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/prompts?search=${search}&category=${category}&aiTool=${tool}&sort=${sort}&page=${page}`);
       
        setPrompts(res.data.result || []);
      } catch (error) {
        console.error("Fetch error", error);
        setPrompts([]);
      }
      setLoading(false);
    };
    fetchPrompts();
  }, [search, category, tool, sort, page]);

  return (
    <div className="min-h-screen bg-[#05070A] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        


        {/* Header Section */}
        <header className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">
            Neural Catalog<span className="text-violet-500">.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.5em] mt-4">
            Discover verified high-performance AI instructions
          </p>
        </header>



        {/* Filters & Search Bar */}
        <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] mb-16 shadow-2xl shadow-black/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            



            {/* Search Input */}
            <div className="relative group md:col-span-1">
              <Search className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-violet-400 transition-colors" size={18} />
              <input 
                onChange={(e) => {setSearch(e.target.value); setPage(1);}} 
                type="text" 
                placeholder="Search prompts..." 
                className="w-full bg-black/40 border border-white/10 p-3.5 pl-12 rounded-2xl text-white outline-none focus:border-violet-500 transition-all font-medium" 
              />
            </div>





            {/* Category Dropdown (Top 6) */}
            <div className="relative">
              <select 
                onChange={(e) => {setCategory(e.target.value); setPage(1);}}
                className="w-full bg-black/40 border border-white/10 p-3.5 rounded-2xl text-slate-300 outline-none focus:border-violet-500 appearance-none font-bold text-xs uppercase tracking-widest cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="Coding">Coding & Dev</option>
                <option value="Art">Creative Arts</option>
                <option value="Marketing">SEO & Marketing</option>
                <option value="Writing">Content Writing</option>
                <option value="Business">Business & CRM</option>
                <option value="Academic">Learning & Study</option>
              </select>
            </div>




            {/* AI Engine Dropdown (Top 6) */}
            <div className="relative">
              <select 
                onChange={(e) => {setTool(e.target.value); setPage(1);}}
                className="w-full bg-black/40 border border-white/10 p-3.5 rounded-2xl text-slate-300 outline-none focus:border-violet-500 appearance-none font-bold text-xs uppercase tracking-widest cursor-pointer"
              >
                <option value="">AI Engines</option>
                <option value="ChatGPT">ChatGPT (v4)</option>
                <option value="Midjourney">Midjourney (v6)</option>
                <option value="Claude">Claude 3 (AI)</option>
                <option value="Gemini">Google Gemini</option>
                <option value="DALL-E">DALL-E 3</option>
                <option value="StableDiffusion">Stable Diffusion</option>
              </select>
            </div>




            {/* Sort Options */}
            <div className="relative">
              <select 
                onChange={(e) => {setSort(e.target.value); setPage(1);}}
                className="w-full bg-black/40 border border-white/10 p-3.5 rounded-2xl text-slate-300 outline-none focus:border-violet-500 appearance-none font-bold text-xs uppercase tracking-widest cursor-pointer"
              >
                <option value="latest">Sort: Newest</option>
                <option value="popular">Sort: Popular</option>
                <option value="copies">Sort: Most Copied</option>
              </select>
            </div>

          </div>
        </div>



        {/* Prompts Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
             <Loader2 className="text-violet-500 animate-spin" size={40} />
             <p className="font-black text-white uppercase tracking-[0.5em] text-xs">Synchronizing Database...</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[3rem]">
             <Sparkles className="mx-auto mb-4 text-slate-700" size={48} />
             <p className="text-slate-500 font-black uppercase text-xs tracking-widest">No matching neural instructions found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in zoom-in-95 duration-500">
            {prompts.map((p) => <PromptCard key={p._id} prompt={p} />)}
          </div>
        )}






        {/* Simple Pagination */}
        <div className="flex justify-center mt-20 gap-4">
            <button 
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
                className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-violet-600 disabled:opacity-20 disabled:pointer-events-none transition-all"
            >
                Previous
            </button>
            <button 
                onClick={() => setPage(page + 1)}
                className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-violet-600 transition-all"
            >
                Next Page
            </button>
        </div>

      </div>
    </div>
  );
}