"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditPrompt() {
  const { id } = useParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/prompts/${id}`)
      .then(res => setPrompt(res.data))
      .catch(err => toast.error("Error loading data"));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    
    // ডাটা সংগ্রহ করা
    const updatedData = {
      title: form.title.value,
      description: form.description.value,
      promptContent: form.content.value,
      category: form.category.value,
      aiTool: form.aiTool.value,
      visibility: form.visibility.value,
      status: "pending" // এডিট করার পর আবার পেন্ডিং হবে (এডমিন চেক করার জন্য)
    };

    try {
      const token = localStorage.getItem("access-token");
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/prompts/${id}`, updatedData, {
        headers: { authorization: `Bearer ${token}` }
      });
      
      if (res.data.modifiedCount > 0) {
        toast.success("Prompt Updated Successfully!");
        router.push("/dashboard/my-prompts");
      } else {
        toast.info("No changes were made.");
        router.push("/dashboard/my-prompts");
      }
    } catch (error) {
      toast.error("Update Failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!prompt) return <div className="text-center pt-20 text-white font-black animate-pulse">LOADING...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-black text-white uppercase mb-8">Update Prompt</h1>
      <form onSubmit={handleUpdate} className="bg-[#0F172A] p-10 rounded-[2.5rem] border border-white/10 space-y-6">
        <input name="title" defaultValue={prompt.title} className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white" />
        <input name="description" defaultValue={prompt.description} className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white" />
        <textarea name="content" defaultValue={prompt.promptContent} rows="6" className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white font-mono"></textarea>
        <div className="grid grid-cols-2 gap-4">
           <select name="category" defaultValue={prompt.category} className="bg-[#1E293B] p-4 rounded-xl text-white">
              <option value="Coding">Coding</option>
              <option value="Art">Art</option>
           </select>
           <select name="aiTool" defaultValue={prompt.aiTool} className="bg-[#1E293B] p-4 rounded-xl text-white">
              <option value="ChatGPT">ChatGPT</option>
              <option value="Midjourney">Midjourney</option>
           </select>
        </div>
        <select name="visibility" defaultValue={prompt.visibility} className="w-full bg-[#1E293B] p-4 rounded-xl text-white">
           <option value="public">Public</option>
           <option value="private">Private</option>
        </select>
        <button disabled={loading} className="w-full bg-cyan-500 py-4 rounded-xl font-black text-white uppercase">{loading ? "Synchronizing..." : "Apply Changes"}</button>
      </form>
    </div>
  );
}