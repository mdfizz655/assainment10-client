"use client";
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { Zap } from 'lucide-react';

const Navbar = () => {
    const { data: session } = useSession();

    return (
        <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b-2 border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-1 group">
                        <Zap className="fill-black text-black group-hover:text-yellow-500 transition-colors" size={28} />
                        <span className="text-2xl font-black tracking-tighter uppercase text-black">
                            PROMPTLY<span className="text-yellow-500">.</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-[10px] font-black uppercase tracking-widest hover:text-yellow-500 transition">Home</Link>
                        <Link href="/prompts" className="text-[10px] font-black uppercase tracking-widest hover:text-yellow-500 transition">All Prompts</Link>
                        
                        {session ? (
                            <>
                                <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-violet-600 transition">Dashboard</Link>
                                <button 
                                    onClick={() => signOut()}
                                    className="bg-black text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-[10px] font-black uppercase tracking-widest hover:text-yellow-500 transition">Login</Link>
                                <Link href="/register" className="bg-black text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition shadow-[4px_4px_0px_0px_rgba(250,204,21,1)]">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;