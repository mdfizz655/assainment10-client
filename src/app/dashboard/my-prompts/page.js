"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Trash2, Eye, BarChart2, Edit3, Star } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";



export default function MyPrompts() {
  const { data: session } = useSession();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    if (session?.user?.email) {
      const fetchMyPrompts = async () => {
        try {
            const token = localStorage.getItem("access-token");
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/my-prompts/${session.user.email}`, {
              headers: { authorization: `Bearer ${token}` }
            });
            setPrompts(res.data);
        } catch (error) {
            console.error("Error fetching prompts", error);
        } finally {
            setLoading(false);
        }
      };
      fetchMyPrompts();
    }
  }, [session]);




  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this prompt?")) {
      try {
        const token = localStorage.getItem("access-token");
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/prompts/${id}`, {
          headers: { authorization: `Bearer ${token}` }
        });
        setPrompts(prompts.filter(p => p._id !== id));
        toast.success("Prompt Deleted!");
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight uppercase italic">My Prompt Templates</h1>
        <p className="text-slate-500 mt-1 font-medium italic">Review, manage and optimize your creations.</p>
      </header>





      <div className="bg-[#0F172A] border border-white/5 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Title</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Engine</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Copies</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Rating</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center font-black text-violet-400 animate-pulse">RETRIVING DATA...</td></tr>
            ) : prompts.length === 0 ? (
                <tr><td colSpan="6" className="px-8 py-20 text-center text-slate-500 uppercase font-bold text-xs">No prompts found</td></tr>
            ) : prompts.map((prompt) => (
              <tr key={prompt._id} className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6">
                  <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition">{prompt.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{prompt.category}</p>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className="bg-white/5 text-slate-400 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">{prompt.aiTool}</span>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                    prompt.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                    prompt.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {prompt.status || 'pending'}
                  </span>
                </td>
                <td className="px-8 py-6 text-center font-bold text-white text-sm">
                    {prompt.copyCount || 0}
                </td>
                <td className="px-8 py-6 text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-sm">
                    <Star size={14} fill="currentColor" /> {prompt.rating || 0}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-center items-center gap-2">
                    <Link href={`/prompts/${prompt._id}`} title="View Details">
                        <button className="p-2.5 bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 rounded-xl transition cursor-pointer"><Eye size={16} /></button>
                    </Link>
                    <Link href={`/dashboard/edit-prompt/${prompt._id}`} title="Edit Prompt">
                        <button className="p-2.5 bg-white/5 hover:bg-amber-500/20 hover:text-amber-400 rounded-xl transition cursor-pointer"><Edit3 size={16} /></button>
                    </Link>
                    <button onClick={() => handleDelete(prompt._id)} className="p-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition cursor-pointer" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}