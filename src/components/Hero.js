"use client";
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
// আগের লাইনটি পরিবর্তন করে এটি দিন:


const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-white pt-20 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-100 rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
            </div>

            <div className="max-w-5xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] uppercase bg-gray-100 rounded-full">
                        Next Generation AI Marketplace
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black text-black leading-tight mb-8 tracking-tighter">
                        PROMPTS THAT <br /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">SPARK GENIUS.</span>
                    </h1>
                    
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-10 relative group">
                        <div className="absolute inset-0 bg-yellow-400 rounded-2xl blur group-hover:blur-md transition-all opacity-20"></div>
                        <div className="relative flex items-center bg-white border-2 border-black p-2 rounded-2xl">
                            <Search className="ml-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search Midjourney, ChatGPT, Claude prompts..." 
                                className="w-full p-4 outline-none text-lg font-medium"
                            />
                            <button className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition flex items-center gap-2">
                                Search <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-gray-400 tracking-widest uppercase">
                        <span>Trending:</span>
                        <span className="text-black hover:text-yellow-500 cursor-pointer">#Cyberpunk</span>
                        <span className="text-black hover:text-yellow-500 cursor-pointer">#LogoDesign</span>
                        <span className="text-black hover:text-yellow-500 cursor-pointer">#SaaS_Ideas</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;