"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Files, Copy, Bookmark, Zap } from "lucide-react";




export default function CreatorHome() {
  const { data: session } = useSession();
  const [data, setData] = useState(null);


  useEffect(() => {
    if (session?.user?.email) {
      const token = localStorage.getItem("access-token");
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/creator-stats/${session.user.email}`, {
        headers: { authorization: `Bearer ${token}` }
      }).then(res => setData(res.data));
    }
  }, [session]);

  if (!data) return <div className="text-white font-black text-center pt-20 animate-pulse">GENERATING INSIGHTS...</div>;




  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Creator Analytics Dashboard</h1>
        <p className="text-slate-500 mt-2 font-medium">Real-time usage statistics and performance insights.</p>
      </header>




      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Files className="text-violet-400" />} label="Total Prompts" value={data.stats.totalPrompts} />
        <StatCard icon={<Copy className="text-cyan-400" />} label="Total Copies" value={data.stats.totalCopies} />
        <StatCard icon={<Bookmark className="text-green-400" />} label="Total Bookmarks" value={data.stats.totalBookmarks} />
      </div>




      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart: Copies vs Bookmarks */}
        <div className="bg-[#0F172A] border border-white/5 p-8 rounded-[2.5rem]">
          <h3 className="text-white font-bold mb-8 flex items-center gap-3"><Copy size={18}/> Prompt Copies vs Bookmarks</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="title" stroke="#64748b" fontSize={10} hide />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                <Legend />
                <Bar dataKey="copyCount" name="Copies" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bookmarkCount" name="Bookmarks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>




        {/* Line Chart: Accumulative Growth (Mock Logic) */}
        <div className="bg-[#0F172A] border border-white/5 p-8 rounded-[2.5rem]">
          <h3 className="text-white font-bold mb-8 flex items-center gap-3"><Zap size={18}/> Accumulative Growth Metrics</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="title" hide />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                <Line type="monotone" dataKey="copyCount" stroke="#06b6d4" strokeWidth={3} dot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}




function StatCard({ icon, label, value }) {
  return (
    <div className="bg-[#0F172A] border border-white/5 p-8 rounded-[2rem] flex items-center gap-6">
      <div className="p-4 bg-white/5 rounded-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
        <h4 className="text-4xl font-bold text-white">{value}</h4>
      </div>
    </div>
  );
}