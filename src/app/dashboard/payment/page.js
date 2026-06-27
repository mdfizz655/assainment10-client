"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import { Diamond, CheckCircle, ShieldCheck } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";

// আপনার .env.local ফাইলে NEXT_PUBLIC_STRIPE_PK থাকতে হবে
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

export default function PaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access-token");
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/simulate-payment`, {}, {
        headers: { authorization: `Bearer ${token}` }
      });
      toast.success("Upgrade Successful via Sandbox!");
      router.push("/dashboard");
    } catch (err) { toast.error("Simulation Error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in duration-700">
      <div className="text-center mb-16">
        <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Diamond className="text-cyan-400" size={32} />
        </div>
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Upgrade Account</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Plan Info */}
        <div className="bg-[#0F172A] border border-white/5 p-10 rounded-[2.5rem]">
          <h2 className="text-3xl font-bold text-white mb-6">PROMPTLY Pro Access</h2>
          <div className="text-5xl font-black text-white mb-8">$5.00 <span className="text-xs text-slate-500 uppercase">One-time</span></div>
          <ul className="space-y-4 mb-10">
            <li className="flex gap-3 text-sm text-slate-400 font-bold uppercase"><CheckCircle size={18} className="text-green-500"/> Unlimited Private Prompts</li>
            <li className="flex gap-3 text-sm text-slate-400 font-bold uppercase"><CheckCircle size={18} className="text-green-500"/> Priority Support</li>
          </ul>
          <p className="text-[10px] text-slate-600 font-black uppercase flex items-center gap-2"><ShieldCheck size={14}/> Stripe Encrypted Payments</p>
        </div>

        {/* Card Form & Simulation */}
        <div className="bg-[#0F172A] border border-white/5 p-10 rounded-[2.5rem] space-y-8">
            <p className="text-sm font-black uppercase text-white tracking-widest italic border-b border-white/5 pb-4">Secure Checkout</p>
            
            {/* Real Stripe Elements wrap */}
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>

            <div className="pt-8 border-t border-dashed border-white/10 text-center">
                <p className="text-[10px] font-black text-violet-400 uppercase mb-4 tracking-widest">Stripe Testing Assist</p>
                <button 
                  onClick={handleSimulatePayment}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 text-cyan-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                >
                  {loading ? "Authorizing..." : "Simulate $5 Test Checkout"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}