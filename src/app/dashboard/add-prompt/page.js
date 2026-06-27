"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Upload, Send, AlertTriangle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddPrompt() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (session?.user?.email) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/my-prompts/${session.user.email}`, {
        headers: { authorization: `Bearer ${localStorage.getItem("access-token")}` }
      }).then(res => setPromptCount(res.data.length));
    }
  }, [session]);

  const handleAddPrompt = async (e) => {
    e.preventDefault();
    if (promptCount >= 3 && session?.user?.status === 'Free') return toast.error("Free Tier Limit Reached!");
    setLoading(true);
    const form = e.target;
    const image = form.image.files[0];
    const formData = new FormData();
    formData.append("image", image);

    try {
      const imgRes = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, formData);
      if (imgRes.data.success) {
        const newPrompt = {
          title: form.title.value, description: form.description.value,
          promptContent: form.content.value, category: form.category.value,
          aiTool: form.aiTool.value, difficulty: form.difficulty.value,
          tags: form.tags.value.split(",").map(t => t.trim()),
          thumbnail: imgRes.data.data.display_url, visibility: form.visibility.value,
          creatorName: session?.user?.name, creatorEmail: session?.user?.email, status: "pending",
        };
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/add-prompt`, newPrompt, {
          headers: { authorization: `Bearer ${localStorage.getItem("access-token")}` }
        });
        toast.success("Submitted for review!");
        router.push("/dashboard/my-prompts");
      }
    } catch (err) { toast.error("Error adding prompt"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-black text-white uppercase italic mb-10">Forge New Prompt</h1>
      
      {promptCount >= 3 && session?.user?.status === 'Free' && (
        <div className="mb-10 bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] flex items-start gap-4">
            <div className="p-3 bg-red-500 rounded-2xl text-white"><AlertTriangle size={24}/></div>
            <div><h4 className="text-red-500 font-black uppercase tracking-tight">Free Tier Limit Reached</h4><p className="text-red-400/70 text-sm mt-1">You can only create up to 3 prompts on the free plan. <Link href="/dashboard/payment" className="text-white underline font-black">Upgrade to Pro</Link> to add unlimited prompts!</p></div>
        </div>
      )}

      <form onSubmit={handleAddPrompt} className={`space-y-8 bg-[#0F172A]/50 border border-white/5 p-10 rounded-[2.5rem] ${promptCount >= 3 && session?.user?.status === 'Free' ? 'opacity-30 pointer-events-none' : ''}`}>
        <input name="title" placeholder="Prompt Title" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none text-white font-bold" required />
        <textarea name="content" rows="5" placeholder="Enter Prompt Content" className="w-full bg-white/5 border border-white/10 p-5 rounded-[2rem] outline-none text-white font-mono" required></textarea>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select name="category" className="bg-[#1e293b] border border-white/10 p-4 rounded-xl text-white outline-none">
                <option value="Coding">Coding & Development</option>
                <option value="Art">Creative Art & Image</option>
                <option value="Marketing">Marketing & SEO</option>
                <option value="Business">Business & Finance</option>
                <option value="Other">Miscellaneous</option>
            </select>
            <select name="aiTool" className="bg-[#1e293b] border border-white/10 p-4 rounded-xl text-white outline-none">
                <option value="ChatGPT">ChatGPT (OpenAI)</option>
                <option value="Midjourney">Midjourney V6</option>
                <option value="Claude">Claude 3 (Anthropic)</option>
                <option value="Gemini">Google Gemini</option>
                <option value="DALL-E">DALL-E 3</option>
            </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select name="difficulty" className="bg-[#1e293b] border border-white/10 p-4 rounded-xl text-white">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Pro">Expert Pro</option>
            </select>
            <select name="visibility" className="bg-[#1e293b] border border-white/10 p-4 rounded-xl text-cyan-400 font-black uppercase text-xs">
                <option value="public">Public (Free)</option>
                <option value="private">Private (Premium)</option>
            </select>
        </div>

        <div className="relative border-2 border-dashed border-white/10 rounded-[2.5rem] p-10 text-center cursor-pointer">
            <input name="image" type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFileName(e.target.files[0]?.name)} required />
            <Upload className="mx-auto mb-2 text-cyan-500" /><p className="text-sm font-black uppercase tracking-widest text-white">{fileName || "Click to upload Thumbnail"}</p>
        </div>
        <button disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-5 rounded-2xl font-black uppercase tracking-[0.3em] disabled:opacity-50"> {loading ? "TRANSMITTING..." : "Publish to Market"} </button>
      </form>
    </div>
  );
}