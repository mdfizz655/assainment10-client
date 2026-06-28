"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Upload, Send, AlertTriangle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddPrompt() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [fileName, setFileName] = useState("");

  


  useEffect(() => {
    const fetchCount = async () => {
      if (session?.user?.email) {
        try {
          const token = localStorage.getItem("access-token");
          

          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/my-prompts/${session.user.email}`, {
            headers: { authorization: `Bearer ${token}` }
          });
          setPromptCount(res.data.length);
        } catch (err) {
          if (err.response?.status === 401) {
            console.error("Session expired or token invalid. Please relogin.");
          }
        }
      }
    };
    fetchCount();
  }, [session]);

  if (status === "loading") {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-black animate-pulse uppercase">Syncing Neural Data...</div>;
  }

  const handleAddPrompt = async (e) => {
    e.preventDefault();
    
   

    if (promptCount >= 3 && session?.user?.status === 'Free') {
        return toast.error("Free Tier Limit Reached! Upgrade to Pro.");
    }

    setLoading(true);
    const form = e.target;
    const image = form.image.files[0];
    
    if (!image) {
        toast.error("Please upload a thumbnail image.");
        setLoading(false);
        return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
     

      const imgRes = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, formData);
      
      if (imgRes.data.success) {
        const newPrompt = {
          title: form.title.value,
          description: form.description.value,
          promptContent: form.content.value,
          category: form.category.value,
          aiTool: form.aiTool.value,
          difficulty: form.difficulty.value,
          tags: form.tags.value.split(",").map(t => t.trim()),
          thumbnail: imgRes.data.data.display_url,
          visibility: form.visibility.value,
          creatorName: session?.user?.name,
          creatorEmail: session?.user?.email,
          status: "pending",
        };

        const token = localStorage.getItem("access-token");
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-prompt`, newPrompt, {
          headers: { authorization: `Bearer ${token}` }
        });

        if (res.data.insertedId) {
          toast.success("Prompt successfully submitted for review!");
          router.push("/dashboard/my-prompts");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to transmit data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 animate-in fade-in duration-700">
      <h1 className="text-3xl font-black text-white uppercase italic mb-10 tracking-tighter">Forge New Prompt</h1>
      
      
      {promptCount >= 3 && session?.user?.status === 'Free' && (
        <div className="mb-10 bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] flex items-start gap-4">
            <div className="p-3 bg-red-500 rounded-2xl text-white shadow-lg shadow-red-500/20">
                <AlertTriangle size={24}/>
            </div>
            <div>
                <h4 className="text-red-500 font-black uppercase tracking-tight">Free Tier Limit Reached</h4>
                <p className="text-red-400/70 text-sm mt-1 font-medium">You have used your 3 free slots. <Link href="/dashboard/payment" className="text-white underline font-black hover:text-red-400">Upgrade to Pro</Link> to unlock unlimited neural storage.</p>
            </div>
        </div>
      )}

      <form onSubmit={handleAddPrompt} className={`space-y-8 bg-[#0F172A]/50 border border-white/5 p-10 rounded-[2.5rem] ${promptCount >= 3 && session?.user?.status === 'Free' ? 'opacity-30 pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="title" placeholder="Neural Prompt Title" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-500/50 font-bold" required />
            <input name="description" placeholder="Short Meta Description" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-500/50 font-bold" required />
        </div>
        
        <textarea name="content" rows="5" placeholder="Enter Prompt Instructions Here..." className="w-full bg-white/5 border border-white/10 p-5 rounded-[2rem] outline-none text-cyan-100 font-mono leading-relaxed" required></textarea>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Category Selection</label>
                <select name="category" className="w-full bg-[#1e293b] border border-white/10 p-4 rounded-xl text-white outline-none font-bold">
                    <option value="Coding">Coding & Development</option>
                    <option value="Art">Creative Art & Image</option>
                    <option value="Marketing">SEO & Digital Marketing</option>
                    <option value="Writing">Content & Blog Writing</option>
                    <option value="Business">Business & Finance</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">AI Engine</label>
                <select name="aiTool" className="w-full bg-[#1e293b] border border-white/10 p-4 rounded-xl text-white outline-none font-bold">
                    <option value="ChatGPT">ChatGPT (OpenAI)</option>
                    <option value="Midjourney">Midjourney V6</option>
                    <option value="Claude">Claude 3 (Anthropic)</option>
                    <option value="Gemini">Google Gemini Pro</option>
                    <option value="DALL-E">DALL-E 3</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <select name="difficulty" className="bg-[#1e293b] border border-white/10 p-4 rounded-xl text-white font-bold outline-none">
                <option value="Beginner">Level: Beginner</option>
                <option value="Intermediate">Level: Intermediate</option>
                <option value="Pro">Level: Expert Pro</option>
            </select>
            <select name="visibility" className="bg-[#1e293b] border border-white/10 p-4 rounded-xl text-cyan-400 font-black uppercase text-xs outline-none">
                <option value="public">Status: Public (Free)</option>
                <option value="private">Status: Private (Premium)</option>
            </select>
        </div>

        <div className="relative border-2 border-dashed border-white/10 rounded-[2.5rem] p-12 text-center group hover:border-cyan-500/50 transition-all cursor-pointer">
            <input name="image" type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFileName(e.target.files[0]?.name)} required />
            <Upload className="mx-auto mb-3 text-cyan-500 group-hover:scale-110 transition-transform" size={32} />
            <p className="text-white text-xs font-black uppercase tracking-widest">{fileName || "Click to upload visual identity"}</p>
            <p className="text-slate-600 text-[10px] font-bold mt-2 uppercase">PNG, JPG or WEBP (Max 2MB)</p>
        </div>

        <input name="tags" placeholder="Tags (comma separated e.g. react, design, code)" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white font-bold outline-none" />

        <button disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-5 rounded-2xl font-black uppercase text-white tracking-[0.4em] shadow-xl shadow-cyan-500/20 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all">
           {loading ? "TRANSMITTING DATA..." : "Publish Prompt to Marketplace"}
        </button>
      </form>
    </div>
  );
}