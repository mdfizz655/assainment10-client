import Link from "next/link";

const PromptCard = ({ prompt }) => {
  return (
    <div className="group border-2 border-black p-6 rounded-[32px] bg-white hover:bg-black hover:text-white transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-yellow-400 text-black border border-black">
          {prompt.aiTool}
        </span>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase opacity-60">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
          {prompt.copyCount || 0} Copied
        </div>
      </div>
      
      <h3 className="text-xl font-black mb-1 line-clamp-1">{prompt.title}</h3>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 italic">
        By {prompt.creatorName || "Anonymous"} • {prompt.category}
      </p>
      
      <Link href={`/prompts/${prompt._id}`} className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white border border-white rounded-xl font-bold group-hover:bg-yellow-400 group-hover:text-black transition-colors text-sm uppercase tracking-widest">
        View Details
      </Link>
    </div>
  );
};

export default PromptCard;