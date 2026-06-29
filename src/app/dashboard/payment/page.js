"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ShieldCheck, Diamond, Loader2, CreditCard } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";



const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

export default function PaymentPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  


  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access-token");
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/simulate-payment`, {}, {
        headers: { authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success("Identity Verified: PRO Access Activated!");
       


        window.location.href = "/dashboard"; 
      }
    } catch (error) {
      toast.error("Simulation failed! Make sure your backend is live.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in duration-700">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">Upgrade Account</h1>
        <p className="text-slate-500 mt-2 font-medium uppercase text-[10px] tracking-[0.4em]">Neural Mainframe Integration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
       

        <div className="bg-[#0F172A] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
            <Diamond className="text-cyan-400" size={28} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tight">PRO LIFETIME ACCESS</h2>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-6xl font-black text-white">$5.00</span>
            <span className="text-slate-500 font-bold uppercase text-xs">/ One-time</span>
          </div>
          <ul className="space-y-4 mb-10 text-slate-400 font-medium italic">
            <li>• Unlock all restricted neural prompts</li>
            <li>• Unlimited copy-to-clipboard actions</li>
            <li>• Priority support from verified creators</li>
            <li>• Special PRO badge on your profile</li>
          </ul>
          <div className="flex gap-2 text-[10px] font-black uppercase text-slate-600 border-t border-white/5 pt-6">
            <ShieldCheck size={16} className="text-green-500" /> Stripe Secured Encryption
          </div>
        </div>

       

        <div className="bg-[#0F172A] border border-white/5 p-10 rounded-[2.5rem] space-y-10 shadow-2xl">
           <div className="flex items-center gap-3 text-white font-bold uppercase tracking-widest text-xs italic border-b border-white/5 pb-4">
              <CreditCard size={18} className="text-violet-500" /> Secure Checkout
           </div>

          

           <Elements stripe={stripePromise}>
              <CheckoutForm />
           </Elements>
           
           
           
           <div className="border-t border-dashed border-white/10 pt-10 text-center">
              <p className="text-[10px] font-black text-violet-400 uppercase mb-6 tracking-widest">Stripe Sandbox Assist</p>
              <button 
                onClick={handleSimulatePayment}
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                {loading ? <Loader2 className="animate-spin" size={16}/> : "Simulate $5 Test Checkout"}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}