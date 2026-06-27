"use client";
import { useState, useEffect } from "react";
import PromptCard from "@/components/PromptCard";
import axios from "axios";

export default function AllPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
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
        // ব্যাকএন্ড থেকে { result, total } অবজেক্ট আসবে, তাই .result নিতে হবে
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
        <header className="text-center mb-16">
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">Catalog Hub<span className="text-yellow-500">.</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">Explore approved neural instructions</p>
        </header>

        {/* Filters */}
        <div className="bg-[#0F172A] border border-white/5 p-6 rounded-[2rem] mb-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search prompts..." className="bg-black/20 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-indigo-500" />
          <select onChange={(e) => setCategory(e.target.value)} className="bg-[#1E293B] border border-white/10 p-3 rounded-xl text-white outline-none">
            <option value="">Categories</option>
            <option value="Coding">Coding</option>
            <option value="Art">Art</option>
          </select>
          <select onChange={(e) => setTool(e.target.value)} className="bg-[#1E293B] border border-white/10 p-3 rounded-xl text-white outline-none">
            <option value="">AI Engines</option>
            <option value="ChatGPT">ChatGPT</option>
            <option value="Midjourney">Midjourney</option>
          </select>
          <select onChange={(e) => setSort(e.target.value)} className="bg-[#1E293B] border border-white/10 p-3 rounded-xl text-white outline-none">
            <option value="latest">Latest</option>
            <option value="popular">Popular</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 font-black text-white animate-pulse">RETRIVING DATA...</div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-20 text-slate-600 font-bold uppercase">No approved prompts found in catalog.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prompts.map((p) => <PromptCard key={p._id} prompt={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}