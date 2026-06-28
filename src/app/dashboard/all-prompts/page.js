"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Trash2, Eye } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function AllPromptsAdmin() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPrompts(); }, []);

  const fetchPrompts = async () => {
    try {
        const token = localStorage.getItem("access-token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/all-prompts`, {
          headers: { authorization: `Bearer ${token}` }
        });
        setPrompts(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleStatusUpdate = async (id, status) => {
    let feedback = "";
    if (status === 'rejected') {
      feedback = window.prompt("Enter rejection reason:");
      if (!feedback) return;
    }
    try {
      const token = localStorage.getItem("access-token");
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/admin/prompt-status/${id}`, { 
        status: status,
        feedback 
      }, { headers: { authorization: `Bearer ${token}` } });
      toast.success(`Prompt ${status}!`);
      fetchPrompts(); 
    } catch (err) { toast.error("Action failed"); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h1 className="text-3xl font-black text-white uppercase italic">Moderation Queue</h1>
      <div className="bg-[#0F172A] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500">Prompt Title</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500">Status</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {prompts.map((p) => (
              <tr key={p._id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-6 font-bold text-white uppercase text-sm">{p.title}</td>
                <td className="px-6 py-6">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${p.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>{p.status}</span>
                </td>
                <td className="px-6 py-6 text-right flex justify-end gap-2">
                   <Link href={`/prompts/${p._id}`}><button className="p-2.5 bg-white/5 rounded-xl hover:text-cyan-400 transition"><Eye size={16}/></button></Link>
                   <button onClick={() => handleStatusUpdate(p._id, 'approved')} className="p-2.5 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition"><CheckCircle size={16}/></button>
                   <button onClick={() => handleStatusUpdate(p._id, 'rejected')} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition"><XCircle size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}