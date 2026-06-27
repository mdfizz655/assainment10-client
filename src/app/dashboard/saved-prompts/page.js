"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Eye, Trash2, Bookmark } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function SavedPrompts() {
  const { data: session } = useSession();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    if (session?.user?.email) {
      const token = localStorage.getItem("access-token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/${session.user.email}`, {
        headers: { authorization: `Bearer ${token}` }
      });
      setSaved(res.data);
      setLoading(false);
    }
  };

  useEffect(() => { fetchSaved(); }, [session]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header><h1 className="text-3xl font-black text-white uppercase italic">Saved Templates</h1></header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? <p className="text-white animate-pulse">Retriving Saved Items...</p> : 
         saved.length === 0 ? <p className="text-slate-500 uppercase font-bold text-xs">No saved items found.</p> :
         saved.map((item) => (
          <div key={item._id} className="bg-[#0F172A] border border-white/5 p-8 rounded-[2.5rem] hover:border-violet-500/30 transition-all">
             <div className="flex gap-2 mb-4">
               <span className="bg-violet-600/10 text-violet-400 border border-violet-600/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase">{item.aiTool}</span>
             </div>
             <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">{item.title}</h3>
             <div className="flex gap-3">
               <Link href={`/prompts/${item.promptId}`} className="flex-1 bg-violet-600 text-white py-3 rounded-xl font-black text-[10px] uppercase text-center flex items-center justify-center gap-2 hover:bg-violet-500 transition-all"><Eye size={16}/> View Details</Link>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}