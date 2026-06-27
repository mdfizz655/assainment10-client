const creators = [
  { name: "Alex Rivera", role: "Elite Creator", prompts: 45, img: "https://i.pravatar.cc/150?u=1" },
  { name: "Sarah Chen", role: "Visual Artist", prompts: 32, img: "https://i.pravatar.cc/150?u=2" },
  { name: "Marcus Tech", role: "GPT Specialist", prompts: 28, img: "https://i.pravatar.cc/150?u=3" },
  { name: "Elena Grey", role: "Prompt Engineer", prompts: 56, img: "https://i.pravatar.cc/150?u=4" },
];

const TopCreators = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-black tracking-tighter mb-12 uppercase text-black">Top Creators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {creators.map((c, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-2 border-black rounded-3xl hover:bg-yellow-50 transition-colors">
              <img src={c.img} alt={c.name} className="w-16 h-16 rounded-2xl border-2 border-black object-cover" />
              <div>
                <h4 className="font-bold text-lg text-black">{c.name}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{c.role}</p>
                <p className="text-sm font-black text-yellow-600">{c.prompts} Prompts</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default TopCreators;