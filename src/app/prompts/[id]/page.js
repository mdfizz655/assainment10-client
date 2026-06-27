"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Bookmark, Flag, Copy, Star, User, ArrowLeft, Terminal, ShieldCheck, Layers, Send, Zap, Crown } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function PromptDetails() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/prompts/${id}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews/prompt/${id}`)
        ]);
        setPrompt(pRes.data);
        setReviews(rRes.data);
        if (session?.user?.email) {
            const token = localStorage.getItem("access-token");
            const bRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/${session.user.email}`, { headers: { authorization: `Bearer ${token}` } });
            setIsBookmarked(bRes.data.some(item => item.promptId === id));
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, [id, session]);

  const isPremium = session?.user?.status === "Premium";
  const isLocked = prompt?.visibility === "private" && !isPremium;

  const handleCopy = async () => {
    if(isLocked) return toast.error("Upgrade to Pro to copy!");
    await navigator.clipboard.writeText(prompt.promptContent);
    await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/prompts/copy-count/${id}`);
    toast.success("Copied to clipboard!");
  };

  const handleBookmark = async () => {
    if (!session) return toast.error("Login first");
    try {
        const token = localStorage.getItem("access-token");
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks`, { userEmail: session.user.email, promptId: id, title: prompt.title, aiTool: prompt.aiTool }, { headers: { authorization: `Bearer ${token}` } });
        setIsBookmarked(res.data.message === "saved");
        toast.info(res.data.message === "saved" ? "Added to collection" : "Removed");
    } catch (err) { toast.error("Failed"); }
  };

  if (loading) return <div className="min-h-screen bg-[#05070A] flex items-center justify-center font-black text-white animate-pulse">SYNCING NEURAL DATA...</div>;

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-200 pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">{prompt.title}</h1>
          <p className="text-lg text-slate-400 italic">"{prompt.description}"</p>
          
          <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/5">
            <div className={`p-10 md:p-14 font-mono text-xl md:text-2xl leading-relaxed italic transition-all duration-1000 ${isLocked ? 'blur-2xl pointer-events-none' : ''}`}> "{prompt.promptContent}" </div>
            {isLocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                 <Crown className="text-violet-500 mb-4" size={40} /><h4 className="text-xl font-black text-white uppercase tracking-widest mb-6">Neural Data Locked</h4>
                 <Link href="/dashboard/payment" className="bg-violet-600 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl">Upgrade to Pro ($5)</Link>
              </div>
            )}
            {!isLocked && <button onClick={handleCopy} className="absolute top-6 right-8 bg-indigo-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all">Copy</button>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard icon={<Zap className="text-amber-400" />} label="AI Engine" value={prompt.aiTool} />
              <StatCard icon={<Layers className="text-blue-400" />} label="Category" value={prompt.category} />
              <StatCard icon={<ShieldCheck className="text-green-400" />} label="Complexity" value={prompt.difficulty} />
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#0D1117] border border-white/5 p-8 rounded-[2.5rem] h-fit sticky top-28 space-y-8">
            <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-slate-500">Access Mode</span><span className="text-xs font-black text-white uppercase">{prompt.visibility}</span></div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10"><User size={24} className="text-indigo-400" /><div><p className="text-sm font-black text-white uppercase">{prompt.creatorName}</p><p className="text-[10px] text-slate-500 font-bold uppercase">Verified Creator</p></div></div>
            <button onClick={handleBookmark} className={`w-full py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${isBookmarked ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400'}`}><Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"}/> {isBookmarked ? "Saved" : "Save Prompt"}</button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-[#0D1117] border border-white/5 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
      <div className="mb-4">{icon}</div>
      <p className="text-[10px] font-black uppercase text-slate-500 mb-1">{label}</p>
      <p className="text-xs font-black text-white uppercase">{value}</p>
    </div>
  );
}