"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  PlusCircle, 
  LayoutDashboard, 
  Bookmark, 
  MessageSquare, 
  LogOut, 
  Zap, 
  ChevronRight,
  BarChart3,
  Users,
  Layers,
  CreditCard,
  ShieldAlert,
  Files
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // ইউজারের রোল এবং স্ট্যাটাস ধরা
  const role = session?.user?.role; // 'Admin', 'Creator', or 'User'

  // ১. সাধারণ ইউজার মেনু
  const userMenuItems = [
    { name: "My Profile", href: "/dashboard", icon: <User size={18} /> },
    { name: "Add Prompt", href: "/dashboard/add-prompt", icon: <PlusCircle size={18} /> },
    { name: "My Prompts", href: "/dashboard/my-prompts", icon: <LayoutDashboard size={18} /> },
    { name: "Saved Prompts", href: "/dashboard/saved-prompts", icon: <Bookmark size={18} /> },
    { name: "My Reviews", href: "/dashboard/my-reviews", icon: <MessageSquare size={18} /> },
  ];

  // ২. ক্রিয়েটর মেনু (আপনার দেওয়া লিস্ট অনুযায়ী)
  const creatorMenuItems = [
    { name: "My Profile", href: "/dashboard", icon: <User size={18} /> },
    { name: "Creator Home", href: "/dashboard/creator-home", icon: <LayoutDashboard size={18} /> },
    { name: "Add Prompt", href: "/dashboard/add-prompt", icon: <PlusCircle size={18} /> },
    { name: "My Prompts", href: "/dashboard/my-prompts", icon: <Files size={18} /> },
  ];

  // ৩. অ্যাডমিন মেনু
  const adminMenuItems = [
    { name: "My Profile", href: "/dashboard", icon: <User size={18} /> },
    { name: "Admin Analytics", href: "/dashboard/admin-analytics", icon: <BarChart3 size={18} /> },
    { name: "All Users", href: "/dashboard/all-users", icon: <Users size={18} /> },
    { name: "All Prompts", href: "/dashboard/all-prompts", icon: <Layers size={18} /> },
    { name: "All Payments", href: "/dashboard/all-payments", icon: <CreditCard size={18} /> },
    { name: "Reported Prompts", href: "/dashboard/reported-prompts", icon: <ShieldAlert size={18} /> },
  ];

  // লজিক: ইউজারের রোলের ওপর ভিত্তি করে কোন মেনু সেটটি দেখাবে
  let activeMenuItems = userMenuItems; // ডিফল্ট ইউজার
  if (role === "Admin") activeMenuItems = adminMenuItems;
  if (role === "Creator") activeMenuItems = creatorMenuItems;

  if (status === "loading") {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center font-black text-white animate-pulse uppercase tracking-[0.3em]">Syncing Neural Session...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-300">
      
      {/* --- Sidebar Section --- */}
      <aside className="w-72 bg-[#0F172A] border-r border-white/5 hidden md:flex flex-col fixed h-full z-50">
        
        {/* Branding - PROMPTLY. Style */}
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <Zap className="fill-white text-white" size={24} />
            <span className="text-xl font-black text-white tracking-tighter uppercase italic">
              PROMPTLY<span className="text-yellow-500">.</span>
            </span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="px-6 py-8">
            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white uppercase text-xl shadow-lg">
                    {session?.user?.name?.charAt(0) || "U"}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{session?.user?.name || "Member"}</p>
                    <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mt-1">
                        {role || "USER"}
                    </p>
                </div>
            </div>
        </div>

        {/* Dynamic Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-10">
          <p className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">
            {role === "Admin" ? "System Moderation" : "Control Center"}
          </p>
          
          {activeMenuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group ${
                pathname === item.href 
                ? "bg-white text-black shadow-xl" 
                : "hover:bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon} {item.name}
              </div>
              {pathname === item.href && <ChevronRight size={14} />}
            </Link>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-6 border-t border-white/5">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent"
          >
            <LogOut size={18} /> Logout Session
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 md:ml-72 p-10 min-h-screen relative overflow-x-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] -z-10 rounded-full"></div>
        
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}