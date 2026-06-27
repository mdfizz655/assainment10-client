"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Bookmark, Flag, Copy, Star, User, ArrowLeft, Terminal, ShieldCheck, Layers, Send, Zap } from "lucide-react";
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

        // ইউজার লগইন থাকলে চেক করা সেভ করা আছে কি না
        if (session?.user?.email) {
            const token = localStorage.getItem("access-token");
            const bRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks/${session.user.email}`, {
                headers: { authorization: `Bearer ${token}` }
            });
            const alreadySaved = bRes.data.some(item => item.promptId === id);
            setIsBookmarked(alreadySaved);
        }
      } catch (error) {
        console.error("Fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, session]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.promptContent);
    await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/prompts/copy-count/${id}`);
    toast.success("Prompt copied to clipboard!");
  };

  const handleBookmark = async () => {
    if (!session) return toast.error("Login to save prompts");
    try {
        const token = localStorage.getItem("access-token");
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks`, {
            userEmail: session.user.email,
            promptId: id,
            title: prompt.title,
            aiTool: prompt.aiTool,
            category: prompt.category
        }, { headers: { authorization: `Bearer ${token}` } });

        if (res.data.message === "saved") {
            setIsBookmarked(true);
            toast.success("Saved to your collection!");
        } else {
            setIsBookmarked(false);
            toast.info("Removed from saved items");
        }
    } catch (err) { toast.error("Action failed"); }
  };

  const handleReport = async () => {
    if (!session) return toast.error("Login to report");
    const reason = window.prompt("Reason for report (Spam, Inappropriate, Copyright, etc.):");
    if (!reason) return;
    
    try {
        const token = localStorage.getItem("access-token");
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
            promptId: id,
            promptTitle: prompt.title,
            reporterEmail: session.user.email,
            reason: reason,
            details: "User reported this content for moderation review."
        }, { headers: { authorization: `Bearer ${token}` } });
        toast.warning("Report submitted to Admin Queue.");
    } catch (err) { toast.error("Failed to report"); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!session) return toast.error("Login to review");
    const reviewData = {
      promptId: id, promptTitle: prompt.title, aiTool: prompt.aiTool,
      reviewerName: session.user.name, reviewerEmail: session.user.email,
      rating, comment: e.target.comment.value, date: new Date()
    };
    try {
      const token = localStorage.getItem("access-token");
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, reviewData, {
        headers: { authorization: `Bearer ${token}` }
      });
      setReviews([reviewData, ...reviews]);
      toast.success("Review Posted!");
      e.target.reset();
    } catch (err) { toast.error("Failed to post review"); }
  };

  if (loading) return <div className="min-h-screen bg-[#05070A] flex items-center justify-center font-black text-white animate-pulse uppercase tracking-[0.5em]">Syncing...</div>;
  if (!prompt) return <div className="min-h-screen bg-[#05070A] flex items-center justify-center text-white">404 | NOT FOUND</div>;

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-200 pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. Top Navigation */}
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Catalog
          </button>
          <div className="flex gap-3">
            {/* Bookmark Button */}
            <button onClick={handleBookmark} className={`p-2.5 rounded-xl border border-white/5 transition-all ${isBookmarked ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400'}`}>
              <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
            {/* Report Button */}
            <button onClick={handleReport} className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-red-400 transition-all">
              <Flag size={18} />
            </button>
          </div>
        </div>

        {/* 2. Title Section */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 uppercase tracking-tighter max-w-4xl">
            {prompt.title}
          </h1>
          <p className="text-lg text-slate-400 font-medium italic border-l-2 border-indigo-500 pl-6 max-w-3xl">
            "{prompt.description}"
          </p>
        </div>

        {/* 3. Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-[#0D1117] border border-white/5 rounded-[2.5rem] overflow-hidden group">
              <div className="flex justify-between items-center px-8 py-5 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2 text-slate-500">
                  <Terminal size={18} className="text-indigo-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Normal Template</span>
                </div>
                <button onClick={handleCopy} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Copy Code</button>
              </div>
              <div className="p-10 md:p-14 font-mono text-xl md:text-2xl text-indigo-100/90 leading-relaxed italic">
                "{prompt.promptContent}"
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatBox icon={<Zap size={18}/>} label="AI Engine" value={prompt.aiTool} color="text-yellow-400" />
              <StatBox icon={<Layers size={18}/>} label="Category" value={prompt.category} color="text-blue-400" />
              <StatBox icon={<ShieldCheck size={18}/>} label="Complexity" value={prompt.difficulty} color="text-green-400" />
            </div>

            {/* Reviews Section */}
            <div className="pt-20 border-t border-white/5">
              <h3 className="text-3xl font-black text-white mb-10 uppercase tracking-tight">Community Feedback ({reviews.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#0F172A] border border-white/5 p-8 rounded-[2rem] h-fit">
                  <h4 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest">Share Your Experience</h4>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="flex gap-2 mb-6">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={22} className={`cursor-pointer transition ${rating >= i ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} onClick={() => setRating(i)} />
                      ))}
                    </div>
                    <textarea name="comment" placeholder="What results did you get?" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-indigo-500 mb-4 h-32" required></textarea>
                    <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase text-[10px] tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all"><Send size={16} /> Post Review</button>
                  </form>
                </div>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                  {reviews.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-white/10 rounded-[2rem] text-slate-600 font-bold uppercase text-xs">No Transmission Logged Yet</div>
                  ) : reviews.map((r, i) => (
                    <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs">{r.reviewerName[0]}</div>
                          <p className="text-xs font-bold text-white uppercase">{r.reviewerName}</p>
                        </div>
                        <div className="flex text-amber-400 text-xs">{"★".repeat(r.rating)}</div>
                      </div>
                      <p className="text-sm text-slate-400 italic">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-to-b from-[#0F172A] to-black border border-white/5 rounded-[2.5rem] p-8 sticky top-28 space-y-10">
              <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4 text-center">Prompt Meta-Data</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-xs font-bold uppercase"><span className="text-slate-500">Total Copies</span><span className="text-white">{prompt.copyCount || 0}</span></div>
                   <div className="flex justify-between items-center text-xs font-bold uppercase"><span className="text-slate-500">Access Mode</span><span className="text-indigo-400">{prompt.visibility}</span></div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Authorized Creator</p>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white">{prompt.creatorName?.[0]}</div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-black text-white truncate uppercase">{prompt.creatorName}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Verified Hub</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, color }) {
  return (
    <div className="bg-[#0F172A] border border-white/5 p-6 rounded-3xl">
      <div className={`mb-4 ${color}`}>{icon}</div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xs font-black text-white uppercase">{value}</p>
    </div>
  );
}