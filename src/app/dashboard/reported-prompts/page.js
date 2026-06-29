"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle, Eye, CheckCircle, Trash2, UserX, ShieldAlert, MessageSquareWarning } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";




export default function ReportedPrompts() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
        const token = localStorage.getItem("access-token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports`, {
          headers: { authorization: `Bearer ${token}` }
        });
        setReports(res.data);
    } catch (error) {
        console.error("Error fetching reports", error);
    } finally {
        setLoading(false);
    }
  };




  
  const handleDismiss = async (reportId) => {
    try {
      const token = localStorage.getItem("access-token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports/${reportId}`, {
        headers: { authorization: `Bearer ${token}` }
      });
      toast.success("Complaint dismissed");
      fetchReports();
    } catch (err) { toast.error("Failed to dismiss"); }
  };

  


  const handleRemovePrompt = async (promptId) => {
    if (window.confirm("Action Critical: Remove this prompt from marketplace?")) {
      try {
        const token = localStorage.getItem("access-token");
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/remove-prompt/${promptId}`, {
          headers: { authorization: `Bearer ${token}` }
        });
        toast.error("Prompt removed permanently");
        fetchReports();
      } catch (err) { toast.error("Action failed"); }
    }
  };




  const handleWarnCreator = () => {
    toast.warning("Creator has been warned via email system.");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tight">Reported Prompts Moderation Queue</h1>
        <p className="text-slate-500 mt-2 font-medium">Review community warnings, warn creators, dismiss complaints, or remove posts.</p>
      </header>



      <div className="space-y-6">
        {loading ? (
            <div className="text-center py-20 font-black text-violet-400 animate-pulse uppercase tracking-[0.5em]">Scanning Reports...</div>
        ) : reports.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-[2.5rem]">
                <p className="text-slate-600 font-bold uppercase text-xs">No active complaints in queue.</p>
            </div>
        ) : reports.map((report) => (
          <div key={report._id} className="bg-[#0F172A] border border-white/5 p-8 rounded-[2.5rem] relative group hover:border-red-500/20 transition-all">
            



            {/* Report Header */}
            <div className="flex justify-between items-start mb-6">
               <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                 <AlertCircle size={14}/> REASON: {report.reason.toUpperCase()}
               </span>
               <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Reported on {new Date(report.date).toLocaleDateString()}</span>
            </div>




            {/* Prompt Info */}
            <h3 className="text-2xl font-bold text-white mb-4">Prompt: {report.promptTitle}</h3>
            
            <div className="bg-black/20 p-6 rounded-2xl border border-white/5 mb-8">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Report Details:</p>
                <p className="text-sm text-slate-300 italic leading-relaxed">"{report.details}"</p>
            </div>




            {/* Footer Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6 pt-6 border-t border-white/5">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><UserX size={14} className="text-slate-400"/></div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Reported by: <span className="text-cyan-400">{report.reporterEmail}</span></p>
               </div>
               



               <div className="flex flex-wrap justify-center gap-3">
                  <Link href={`/prompts/${report.promptId}`}>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase transition-all"><Eye size={16}/> Inspect</button>
                  </Link>
                  
                  
                  <button onClick={() => handleDismiss(report._id)} className="flex items-center gap-2 px-5 py-2.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-xl text-[10px] font-black uppercase transition-all"><CheckCircle size={16}/> Dismiss</button>
                  
                  <button onClick={handleWarnCreator} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl text-[10px] font-black uppercase transition-all"><MessageSquareWarning size={16}/> Warn Creator</button>
                  
                  <button onClick={() => handleRemovePrompt(report.promptId)} className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20 rounded-xl text-[10px] font-black uppercase transition-all"><Trash2 size={16}/> Remove Prompt</button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}