"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Files, MessageSquare, Copy, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access-token");
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin-stats`, {
      headers: { authorization: `Bearer ${token}` }
    }).then(res => setStats(res.data));
  }, []);

  if (!stats) return <div className="text-white animate-pulse font-black text-center pt-20">CALCULATING SYSTEM METRICS...</div>;

  const chartData = [
    { name: 'ChatGPT', copies: 240, prompts: 12 },
    { name: 'Gemini', copies: 130, prompts: 8 },
    { name: 'Claude', copies: 210, prompts: 5 },
    { name: 'Midjourney', copies: 90, prompts: 3 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-black text-white uppercase italic">Administrative System Analytics</h1>
        <p className="text-slate-500 mt-2">Aggregate metrics and engine distribution breakdowns.</p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users className="text-cyan-400"/>} label="Total Users" value={stats.totalUsers} />
        <StatCard icon={<Files className="text-blue-400"/>} label="Total Prompts" value={stats.stats?.totalPrompts || 0} />
        <StatCard icon={<MessageSquare className="text-green-400"/>} label="Total Reviews" value={stats.totalPayments || 0} />
        <StatCard icon={<Copy className="text-amber-400"/>} label="Total Copies" value={stats.stats?.totalCopies || 0} />
      </div>

      <div className="bg-[#111827] border border-white/10 p-8 rounded-[2rem] w-fit">
         <div className="flex items-center gap-4">
            <div className="p-4 bg-red-500/10 rounded-2xl"><DollarSign className="text-red-500" /></div>
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Revenue</p>
                <h2 className="text-4xl font-black text-white">${stats.totalRevenue || "0.00"}</h2>
            </div>
         </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#0F172A] border border-white/5 p-8 rounded-[2.5rem]">
              <h3 className="text-white font-bold mb-8 flex items-center gap-3"><Files size={18}/> Engine Prompts Density vs Total Copies</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                        <Bar dataKey="copies" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="prompts" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
    return (
        <div className="bg-[#0F172A] border border-white/5 p-6 rounded-[2rem] flex items-center gap-5 hover:border-white/20 transition-all">
            <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
                <h4 className="text-2xl font-bold text-white">{value}</h4>
            </div>
        </div>
    );
}