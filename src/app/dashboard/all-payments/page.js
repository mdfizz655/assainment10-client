"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { User, Calendar } from "lucide-react";



export default function AllPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access-token");
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/all-payments`, {
      headers: { authorization: `Bearer ${token}` }
    }).then(res => {
      setPayments(res.data);
      setLoading(false);
    });
  }, []);



  
  return (
    <div className="space-y-8 animate-in fade-in">
      <h1 className="text-3xl font-black text-white uppercase italic">Premium Payments Log</h1>
      <div className="bg-[#0F172A] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500">Transaction ID</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500">Purchaser</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 text-center">Amount</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {payments.map((p) => (
              <tr key={p._id} className="hover:bg-white/[0.02]">
                <td className="px-8 py-6 text-sm font-bold text-cyan-400 font-mono">{p.transactionId}</td>
                <td className="px-8 py-6">
                  <p className="text-sm font-bold text-white uppercase">{p.userName || p.email.split('@')[0]}</p>
                  <p className="text-[10px] text-slate-500">{p.email}</p>
                </td>
                <td className="px-8 py-6 text-center text-green-500 font-black">$5.00</td>
                <td className="px-8 py-6 text-right text-[10px] font-bold text-slate-500">{new Date(p.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}