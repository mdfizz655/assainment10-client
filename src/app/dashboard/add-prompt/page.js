"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Upload, Send, Sparkles, Image as ImageIcon, AlertTriangle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddPrompt() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [promptCount, setPromptCount] = useState(0);

  // ইউজারের বর্তমান প্রম্পট সংখ্যা চেক করা (লিমিট দেখানোর জন্য)
  useEffect(() => {
    if (session?.user?.email) {
      const token = localStorage.getItem("access-token");
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/my-prompts/${session.user.email}`, {
        headers: { authorization: `Bearer ${token}` }
      })
      .then(res => setPromptCount(res.data.length))
      .catch(err => console.error("Error fetching count", err));
    }
  }, [session]);

  if (status === "loading") {
    return <div className="pt-20 text-center font-black text-white animate-pulse uppercase tracking-[0.3em]">Syncing Session...</div>;
  }

  const handleAddPrompt = async (e) => {
    e.preventDefault();
    
    // ফ্রি ইউজার ৩টির বেশি প্রম্পট অ্যাড করতে চাইলে বাধা দেওয়া
    if (promptCount >= 3 && session?.user?.status === 'Free') {
        return toast.error("Free Tier Limit Reached! Please upgrade to Pro.");
    }

    setLoading(true);
    const form = e.target;
    const token = localStorage.getItem("access-token");

    // ইমেজ ফাইল চেক
    const image = form.image.files[0];
    if (!image) {
      toast.error("Please select a thumbnail image.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      // ১. ImgBB-তে ইমেজ আপলোড
      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        formData
      );

      if (imgRes.data.success) {
        const imageUrl = imgRes.data.data.display_url;

        // ২. প্রম্পট ডাটা অবজেক্ট
        const newPrompt = {
          title: form.title.value,
          description: form.description.value,
          promptContent: form.content.value,
          category: form.category.value,
          aiTool: form.aiTool.value,
          difficulty: form.difficulty.value,
          tags: form.tags.value.split(",").map(t => t.trim()),
          thumbnail: imageUrl,
          visibility: form.visibility.value,
          creatorName: session?.user?.name,
          creatorEmail: session?.user?.email,
          status: "pending",
        };

        // ৩. ব্যাকেন্ডে পাঠানো
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/add-prompt`, 
          newPrompt, 
          { headers: { authorization: `Bearer ${token}` } }
        );

        if (res.data.insertedId) {
          toast.success("Prompt submitted for review!");
          router.push("/dashboard/my-prompts");
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add prompt";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Forge New Prompt</h1>
        <p className="text-slate-500 mt-2 font-medium uppercase text-[10px] tracking-[0.3em]">Publish your neural instructions to the world.</p>
      </header>

      {/* --- LIMIT ALERT BOX (এখানে অ্যাড করা হয়েছে) --- */}
      {promptCount >= 3 && session?.user?.status === 'Free' && (
        <div className="mb-10 bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] flex items-start gap-4">
            <div className="p-3 bg-red-500 rounded-2xl text-white shadow-lg shadow-red-500/20">
                <AlertTriangle size={24}/>
            </div>
            <div>
                <h4 className="text-red-500 font-black text-lg uppercase tracking-tight">Free Tier Limit Reached</h4>
                <p className="text-red-400/70 text-sm mt-1">You can only create up to 3 prompts on the free plan. <Link href="/dashboard/payment" className="text-white underline font-black hover:text-red-400 transition-colors">Upgrade to Pro Lifetime</Link> to add unlimited prompts!</p>
            </div>
        </div>
      )}

      <form onSubmit={handleAddPrompt} className={`space-y-8 bg-[#0F172A]/40 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] ${promptCount >= 3 && session?.user?.status === 'Free' ? 'opacity-50 pointer-events-none' : ''}`}>
        
        {/* Title & Description */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Prompt Title</label>
            <input name="title" type="text" placeholder="e.g. Masterpiece Cyberpunk Engine" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500/50 text-white font-bold" required />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Short Summary</label>
            <input name="description" type="text" placeholder="Describe the result" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500/50 text-white font-bold" required />
          </div>
        </div>

        {/* Prompt Content */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Prompt Content Template</label>
          <textarea name="content" rows="5" placeholder="Enter your prompt code here..." className="w-full bg-black/40 border border-white/10 p-5 rounded-[2rem] outline-none focus:border-cyan-500/50 text-cyan-100 font-mono text-sm leading-relaxed" required></textarea>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Category</label>
            <select name="category" className="w-full bg-[#1e293b] border border-white/10 p-4 rounded-2xl text-white font-bold outline-none cursor-pointer">
              <option value="Coding">Coding</option>
              <option value="Art">Art</option>
              <option value="Marketing">Marketing</option>
              <option value="Writing">Writing</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Engine</label>
            <select name="aiTool" className="w-full bg-[#1e293b] border border-white/10 p-4 rounded-2xl text-white font-bold outline-none cursor-pointer">
              <option value="ChatGPT">ChatGPT</option>
              <option value="Midjourney">Midjourney</option>
              <option value="Claude">Claude</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Complexity</label>
                <select name="difficulty" className="w-full bg-[#1e293b] border border-white/10 p-4 rounded-2xl text-white font-bold outline-none cursor-pointer">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Pro">Pro</option>
                </select>
            </div>
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Visibility</label>
                <div className="flex gap-6 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" name="visibility" value="public" defaultChecked className="hidden peer" />
                        <div className="w-5 h-5 border-2 border-white/20 rounded-full peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-all"></div>
                        <span className="text-[10px] font-black uppercase text-slate-400 peer-checked:text-white">Public</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" name="visibility" value="private" className="hidden peer" />
                        <div className="w-5 h-5 border-2 border-white/20 rounded-full peer-checked:bg-violet-600 peer-checked:border-violet-600 transition-all"></div>
                        <span className="text-[10px] font-black uppercase text-slate-400 peer-checked:text-white">Premium</span>
                    </label>
                </div>
            </div>
        </div>

        {/* Thumbnail */}
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Thumbnail Upload</label>
            <div className="relative border-2 border-dashed border-white/10 rounded-[2.5rem] p-12 text-center group hover:border-cyan-500/50 transition-all cursor-pointer">
                <input name="image" type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFileName(e.target.files[0]?.name)} required />
                <div className="space-y-3">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <ImageIcon className="text-cyan-500" size={24} />
                    </div>
                    <p className="text-xs font-bold text-white uppercase tracking-widest">{fileName || "Choose visual identity"}</p>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">JPG/PNG/WEBP (Max 2MB)</p>
                </div>
            </div>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tags (Comma Separated)</label>
          <input name="tags" type="text" placeholder="react, design, coding" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500/50 text-white font-bold" />
        </div>

        <button 
          disabled={loading || (promptCount >= 3 && session?.user?.status === 'Free')} 
          type="submit" 
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-5 rounded-2xl font-black text-white text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale"
        >
           {loading ? "Transmitting..." : <><Send size={18} /> Publish to Market</>}
        </button>
      </form>
    </div>
  );
}