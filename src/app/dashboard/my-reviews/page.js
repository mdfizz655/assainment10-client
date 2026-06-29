"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Star, Eye } from "lucide-react";
import Link from "next/link"; // Link 




export default function MyReviews() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    if (session?.user?.email) {
      const fetchReviews = async () => {
        try {
            const token = localStorage.getItem("access-token");
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/my-reviews/${session.user.email}`, {
                headers: { authorization: `Bearer ${token}` }
            });
            setReviews(res.data);
        } catch (error) {
            console.error("Error fetching reviews", error);
        } finally {
            setLoading(false);
        }
      };
      fetchReviews();
    }
  }, [session]);




  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">My Feedback Hub</h1>
        <p className="text-slate-500 mt-2 font-medium">Manage all the ratings and reviews you've posted on the marketplace.</p>
      </header>




      <div className="bg-[#0F172A] border border-white/5 rounded-[2.5rem] overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-white/5">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Prompt Info</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Score</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Comment</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Date</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
                <tr><td colSpan="5" className="px-8 py-16 text-center font-black animate-pulse text-violet-400">ACCESSING FEEDBACK LOGS...</td></tr>
            ) : reviews.length === 0 ? (
                <tr><td colSpan="5" className="px-8 py-16 text-center text-slate-500 uppercase text-xs font-bold font-black">No activity recorded yet.</td></tr>
            ) : reviews.map((review) => (
              <tr key={review._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6">
                  <p className="text-sm font-bold text-white uppercase line-clamp-1">{review.promptTitle}</p>
                  <p className="text-[10px] text-cyan-400 font-black uppercase mt-1">{review.aiTool}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                    <Star size={14} fill="currentColor" /> {review.rating?.toFixed(1)}
                  </div>
                </td>
                <td className="px-8 py-6 max-w-xs">
                  <p className="text-xs text-slate-400 italic line-clamp-2">"{review.comment}"</p>
                </td>
                <td className="px-8 py-6 text-[10px] text-slate-500 font-bold uppercase text-center whitespace-nowrap">
                  {review.date ? new Date(review.date).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-8 py-6 text-right">
                  {/* Eye Icon wrapped with Link to navigate to Prompt Details */}
                  <Link href={`/prompts/${review.promptId}`}>
                    <button className="p-2.5 bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 rounded-xl transition cursor-pointer border border-transparent hover:border-cyan-500/30" title="View Prompt">
                      <Eye size={16} />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}