import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white border-t-2 border-black pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-1 mb-6">
            {/* Zap SVG Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-black"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
            <span className="text-xl font-black tracking-tighter">PROMPTLY.</span>
          </Link>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            The world's first modern AI prompt marketplace for creators and engineers.
          </p>
        </div>
        
        <div>
          <h5 className="font-black uppercase text-xs tracking-widest mb-6">Marketplace</h5>
          <ul className="space-y-4 text-sm font-bold text-gray-400">
            <li><Link href="/prompts" className="hover:text-black">All Prompts</Link></li>
            <li className="hover:text-black cursor-pointer">Midjourney</li>
            <li className="hover:text-black cursor-pointer">ChatGPT</li>
          </ul>
        </div>

        <div>
          <h5 className="font-black uppercase text-xs tracking-widest mb-6">Support</h5>
          <ul className="space-y-4 text-sm font-bold text-gray-400">
            <li className="hover:text-black cursor-pointer">Help Center</li>
            <li className="hover:text-black cursor-pointer">Terms of Service</li>
            <li className="hover:text-black cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h5 className="font-black uppercase text-xs tracking-widest mb-6">Socials</h5>
          <div className="flex gap-4">
            {/* X (Twitter) SVG */}
            <div className="p-3 border-2 border-black rounded-xl hover:bg-yellow-400 transition-colors cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"></path></svg>
            </div>
            
            {/* GitHub SVG */}
            <div className="p-3 border-2 border-black rounded-xl hover:bg-yellow-400 transition-colors cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            </div>

            {/* LinkedIn SVG */}
            <div className="p-3 border-2 border-black rounded-xl hover:bg-yellow-400 transition-colors cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-100 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} Promptly. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;