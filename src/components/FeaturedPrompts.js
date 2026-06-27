"use client";
import { motion } from "framer-motion";
import { Copy, Eye, Zap } from "lucide-react";
import Link from "next/link";

const mockPrompts = [
  { id: 1, title: "Cyberpunk Character Portrait", tool: "Midjourney", category: "Art", copyCount: 120, price: "Free" },
  { id: 2, title: "SaaS Landing Page Copy", tool: "ChatGPT", category: "Marketing", copyCount: 85, price: "Premium" },
  { id: 3, title: "Minimalist Logo Vector", tool: "DALL-E", category: "Design", copyCount: 210, price: "Free" },
  { id: 4, title: "Next.js API Route Generator", tool: "Claude", category: "Coding", copyCount: 45, price: "Premium" },
  { id: 5, title: "Realistic Rain Forest", tool: "Midjourney", category: "Nature", copyCount: 300, price: "Free" },
  { id: 6, title: "Product Description SEO", tool: "Gemini", category: "Writing", copyCount: 67, price: "Free" },
];

const FeaturedPrompts = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tighter">FEATURED PROMPTS</h2>
            <p className="text-gray-500 font-medium uppercase text-xs tracking-widest mt-2">Handpicked for your creativity</p>
          </div>
          <Link href="/prompts" className="text-sm font-bold border-b-2 border-yellow-400 pb-1 hover:text-yellow-600 transition">
            VIEW ALL MARKETPLACE
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockPrompts.map((prompt, index) => (
            <motion.div 
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group border-2 border-black p-6 rounded-3xl hover:bg-black hover:text-white transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${prompt.price === 'Premium' ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-600'}`}>
                  {prompt.price}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold">
                  <Copy size={14} /> {prompt.copyCount}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400">{prompt.title}</h3>
              <p className="text-sm font-medium opacity-60 mb-6 italic">#{prompt.tool} • {prompt.category}</p>
              
              <Link href={`/prompts/${prompt.id}`} className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white border border-white rounded-xl font-bold group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                <Eye size={18} /> View Details
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPrompts;