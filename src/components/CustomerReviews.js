"use client";
import { motion } from "framer-motion";

const reviews = [
  { name: "John Doe", text: "The quality of Midjourney prompts here is insane! Saved me hours.", rating: 5 },
  { name: "Lisa Ray", text: "Finally a marketplace that values prompt quality over quantity.", rating: 5 },
  { name: "Mike Ross", text: "Easy to use and the premium prompts are definitely worth it.", rating: 4 },
];

const CustomerReviews = () => {
  return (
    <section className="py-24 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-black tracking-tighter mb-16 text-center uppercase">Community Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
              className="bg-zinc-900 p-8 rounded-[30px] border border-zinc-800"
            >
              <div className="flex gap-1 mb-4 text-yellow-400 font-bold text-lg">
                {"★".repeat(r.rating)}
              </div>
              <p className="text-lg font-medium mb-6 italic text-gray-300">"{r.text}"</p>
              <h5 className="font-bold uppercase tracking-widest text-[10px] text-gray-500">— {r.name}</h5>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default CustomerReviews;