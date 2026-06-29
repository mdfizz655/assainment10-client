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
    toast.success("Prompt copied!");
  };

  const handleBookmark = async () => {
    if (!session) return toast.error("Login first");
    try {
        const token = localStorage.getItem("access-token");
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks`, { userEmail: session.user.email, promptId: id, title: prompt.title, aiTool: prompt.aiTool }, { headers: { authorization: `Bearer ${token}` } });
        setIsBookmarked(res.data.message === "saved");
        toast.info(res.data.message === "saved" ? "Saved to collection" : "Removed from saved");
    } catch (err) { toast.error("Action failed"); }
  };

  const handleReport = async () => {
    const reason = window.prompt("Reason for report (Spam, Copyright, etc.):");
    if (!reason) return;
    try {
        const token = localStorage.getItem("access-token");
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reports`, { promptId: id, promptTitle: prompt.title, reporterEmail: session.user.email, reason }, { headers: { authorization: `Bearer ${token}` } });
        toast.warning("Report submitted to Admin.");
    } catch (err) { toast.error("Report failed"); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const reviewData = { promptId: id, promptTitle: prompt.title, reviewerName: session.user.name, reviewerEmail: session.user.email, rating, comment: e.target.comment.value, date: new Date() };
    try {
      const token = localStorage.getItem("access-token");
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, reviewData, { headers: { authorization: `Bearer ${token}` } });
      setReviews([reviewData, ...reviews]);
      toast.success("Review Posted!");
      e.target.reset();
    } catch (err) { toast.error("Failed"); }
  };

  if (loading) return <div className="min-h-screen bg-[#05070A] flex items-center justify-center text-white animate-pulse">SYNCING NEURAL DATA...</div>;

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-200 pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition uppercase"><ArrowLeft size={16}/> Back</button>
          <div className="flex gap-3">
            <button onClick={handleBookmark} className={`p-2.5 rounded-xl border border-white/5 ${isBookmarked ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400'}`}><Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} /></button>
            <button onClick={handleReport} className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-red-400"><Flag size={18} /></button>
          </div>
        </div>

        <div className="mb-16"><h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-4">{prompt.title}</h1><p className="text-lg text-slate-400 italic">"{prompt.description}"</p></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0D1117]">
                <div className="flex justify-between items-center px-8 py-4 border-b border-white/5"><span className="text-[10px] font-black uppercase text-slate-500">Prompt Template</span>{!isLocked && <button onClick={handleCopy} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase">Copy</button>}</div>
                <div className={`p-10 md:p-14 font-mono text-xl leading-relaxed italic ${isLocked ? 'blur-3xl' : ''}`}> "{prompt.promptContent}" </div>
                {isLocked && <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"><Crown className="text-violet-500 mb-4" size={40} /><Link href="/dashboard/payment" className="bg-violet-600 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px]">Upgrade to Pro ($5)</Link></div>}
            </div>

            <div className="grid grid-cols-3 gap-4">
                <StatCard icon={<Zap className="text-amber-400" />} label="Engine" value={prompt.aiTool} />
                <StatCard icon={<Layers className="text-blue-400" />} label="Category" value={prompt.category} />
                <StatCard icon={<ShieldCheck className="text-green-400" />} label="Level" value={prompt.difficulty} />
            </div>



            {/* REVIEW SECTION */}
            <div className="pt-20 border-t border-white/5">
                <h3 className="text-3xl font-black text-white mb-10 uppercase tracking-tight">Community Feedback ({reviews.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-[#0F172A] border border-white/5 p-8 rounded-[2rem] h-fit">
                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                            <div className="flex gap-2">{[1,2,3,4,5].map(i => <Star key={i} size={22} className={`cursor-pointer ${rating >= i ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} onClick={() => setRating(i)} />)}</div>
                            <textarea name="comment" placeholder="Write your review..." className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none h-32" required></textarea>
                            <button type="submit" className="w-full bg-indigo-600 py-4 rounded-2xl font-black uppercase text-[10px]">Submit Review</button>
                        </form>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {reviews.map((r, i) => (
                            <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                <div className="flex justify-between mb-2"><p className="text-xs font-bold text-white uppercase">{r.reviewerName}</p><div className="flex text-amber-400 text-xs">{"★".repeat(r.rating)}</div></div>
                                <p className="text-sm text-slate-400 italic">"{r.comment}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#0D1117] border border-white/5 p-8 rounded-[2.5rem] h-fit sticky top-28 space-y-6">
              <div className="flex justify-between text-xs font-black uppercase"><span className="text-slate-500">Access</span><span className="text-white">{prompt.visibility}</span></div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10"><User className="text-indigo-400" /><p className="text-sm font-black text-white uppercase">{prompt.creatorName}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
function StatCard({ icon, label, value }) {
    return <div className="bg-[#0D1117] border border-white/5 p-6 rounded-3xl text-center"><div className="mb-3 flex justify-center">{icon}</div><p className="text-[9px] font-black uppercase text-slate-500">{label}</p><p className="text-xs font-black text-white uppercase">{value}</p></div>;
}