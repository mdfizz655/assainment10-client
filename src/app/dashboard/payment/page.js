"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Diamond, ShieldCheck, Loader2 } from "lucide-react";
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
        toast.success("Identity Verified: Pro Access Granted!");
        // সেশন রিফ্রেশ করার জন্য হার্ড রিডাইরেক্ট (এটি ডাইনামিকালি স্ট্যাটাস আপডেট করবে)
        window.location.href = "/dashboard"; 
      }
    } catch (error) {
      toast.error("Network synchronization failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in duration-700">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">Upgrade Account</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-[#0F172A] border border-white/5 p-10 rounded-[2.5rem]">
          <h2 className="text-3xl font-bold text-white mb-6 uppercase">Pro Access</h2>
          <div className="text-6xl font-black text-white mb-8">$5.00</div>
          <p className="text-slate-400 mb-10 italic">Unlimited private prompts and verified badge.</p>
          <div className="flex gap-2 text-[10px] font-black uppercase text-slate-600"><ShieldCheck size={14}/> Encrypted Transaction</div>
        </div>

        <div className="bg-[#0F172A] border border-white/5 p-10 rounded-[2.5rem] space-y-10 shadow-2xl">
           <Elements stripe={stripePromise}>
              <CheckoutForm />
           </Elements>
           
           <div className="border-t border-dashed border-white/10 pt-10 text-center">
              <p className="text-[10px] font-black text-violet-400 uppercase mb-4 tracking-widest">Neural Testing Assist</p>
              <button 
                onClick={handleSimulatePayment}
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin mx-auto"/> : "Simulate $5 Test Checkout"}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}