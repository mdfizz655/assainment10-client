"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, PlusCircle, LayoutDashboard, Bookmark, MessageSquare, LogOut, Zap, ChevronRight, BarChart3, Users, Layers, CreditCard, ShieldAlert, Files } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  const userMenuItems = [
    { name: "My Profile", href: "/dashboard", icon: <User size={18} /> },
    { name: "Add Prompt", href: "/dashboard/add-prompt", icon: <PlusCircle size={18} /> },
    { name: "My Prompts", href: "/dashboard/my-prompts", icon: <LayoutDashboard size={18} /> },
    { name: "Saved Prompts", href: "/dashboard/saved-prompts", icon: <Bookmark size={18} /> },
    { name: "My Reviews", href: "/dashboard/my-reviews", icon: <MessageSquare size={18} /> },
  ];

  const adminMenuItems = [
    { name: "My Profile", href: "/dashboard", icon: <User size={18} /> },
    { name: "Admin Analytics", href: "/dashboard/admin-analytics", icon: <BarChart3 size={18} /> },
    { name: "All Users", href: "/dashboard/all-users", icon: <Users size={18} /> },
    { name: "All Prompts", href: "/dashboard/all-prompts", icon: <Layers size={18} /> },
    { name: "All Payments", href: "/dashboard/all-payments", icon: <CreditCard size={18} /> },
    { name: "Reported Prompts", href: "/dashboard/reported-prompts", icon: <ShieldAlert size={18} /> },
  ];

  const creatorMenuItems = [
    { name: "My Profile", href: "/dashboard", icon: <User size={18} /> },
    { name: "Creator Home", href: "/dashboard/creator-home", icon: <LayoutDashboard size={18} /> },
    { name: "Add Prompt", href: "/dashboard/add-prompt", icon: <PlusCircle size={18} /> },
    { name: "My Prompts", href: "/dashboard/my-prompts", icon: <Files size={18} /> },
  ];

  let activeMenuItems = userMenuItems;
  if (role === "Admin") activeMenuItems = adminMenuItems;
  if (role === "Creator") activeMenuItems = creatorMenuItems;

  if (status === "loading") return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-black animate-pulse">AUTHORIZING...</div>;

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-300">
      <aside className="w-72 bg-[#0F172A] border-r border-white/5 hidden md:flex flex-col fixed h-full z-50">
        <div className="p-8 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <Zap className="fill-white text-white group-hover:text-yellow-400 transition-colors" size={24} />
            <span className="text-xl font-black text-white tracking-tighter uppercase italic">PROMPTLY.</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 mt-6 space-y-1 overflow-y-auto">
          {activeMenuItems.map((item) => (
            <Link key={item.name} href={item.href} className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${pathname === item.href ? "bg-white text-black" : "hover:bg-white/5 text-slate-400"}`}>
              <div className="flex items-center gap-3">{item.icon} {item.name}</div>
              {pathname === item.href && <ChevronRight size={14} />}
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5">
          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:text-red-400 transition-all border border-transparent"><LogOut size={18} /> Logout</button>
        </div>
      </aside>
      <main className="flex-1 md:ml-72 p-10 min-h-screen relative">{children}</main>
    </div>
  );
}