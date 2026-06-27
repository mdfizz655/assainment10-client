"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, User, DollarSign, Hash, CreditCard } from "lucide-react";

export default function AllPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("access-token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/all-payments`, {
          headers: { authorization: `Bearer ${token}` }
        });
        setPayments(res.data);
      } catch (error) {
        console.error("Error fetching payments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tight">Stripe Premium Payments Log</h1>
        <p className="text-slate-500 mt-2 font-medium">Comprehensive database of customer subscription transactions.</p>
      </header>

      <div className="bg-[#0F172A] border border-white/5 rounded-[2.5rem] overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[1000px] border-collapse">
          <thead className="bg-white/5">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Transaction ID</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Purchaser Details</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">Billing Email</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Amount Charged</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Payment Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan="5" className="px-8 py-20 text-center font-black animate-pulse text-violet-400 uppercase tracking-[0.5em]">Syncing Ledger...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-500 font-bold uppercase text-xs">No transactions recorded yet.</td></tr>
            ) : payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-white/[0.02] transition-colors group">
                {/* Transaction ID */}
                <td className="px-8 py-6">
                  <p className="text-sm font-black text-cyan-400 font-mono tracking-tighter truncate w-48 group-hover:text-cyan-300 transition">
                    {payment.transactionId}
                  </p>
                </td>

                {/* Purchaser Details */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                        <User size={16} className="text-slate-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white uppercase">{payment.email.split('@')[0]}</p>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">ID: {payment._id.slice(-10)}</p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-8 py-6 text-sm text-slate-400 font-medium italic">
                  {payment.email}
                </td>

                {/* Amount */}
                <td className="px-8 py-6 text-center">
                  <span className="text-green-500 font-black text-lg">
                    ${parseFloat(payment.amount || 5).toFixed(2)}
                  </span>
                </td>

                {/* Date */}
                <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-500 font-bold uppercase text-[10px]">
                        <Calendar size={14} className="text-slate-600" />
                        <span>{new Date(payment.date).toLocaleString()}</span>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}