"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/create-payment-intent`, { price: 5 }, {
        headers: { authorization: `Bearer ${localStorage.getItem("access-token")}` }
    }).then(res => setClientSecret(res.data.clientSecret));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    const card = elements.getElement(CardElement);
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card, billing_details: { email: session?.user?.email } }
    });
    if (error) { toast.error(error.message); } 
    else if (paymentIntent.status === "succeeded") {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payments`, { email: session.user.email, transactionId: paymentIntent.id }, { headers: { authorization: `Bearer ${localStorage.getItem("access-token")}` } });
        toast.success("PRO Active!");
        router.push("/dashboard");
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-black/40 border border-white/10 p-5 rounded-xl"><CardElement options={{style: {base: {color: '#fff', fontSize: '16px'}}}} /></div>
      <button disabled={!stripe || processing} className="w-full bg-violet-600 py-4 rounded-xl font-black uppercase text-white shadow-xl">Pay One-time $5.00</button>
    </form>
  );
}

export default function Payment() {
  const router = useRouter();
  const handleSimulate = async () => {
    const token = localStorage.getItem("access-token");
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/simulate-payment`, {}, { headers: { authorization: `Bearer ${token}` } });
    toast.success("Simulated Success ✅");
    router.push("/dashboard");
  };

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-[#0F172A] p-10 rounded-[2.5rem] border border-white/5 text-white">
           <h2 className="text-3xl font-bold mb-6">PRO LIFETIME ACCESS</h2>
           <div className="text-6xl font-black mb-6">$5.00</div>
           <p className="text-slate-400 mb-10 italic">Unlock infinite private neural prompts forever.</p>
           <div className="flex gap-2 text-[10px] font-black uppercase text-slate-600"><ShieldCheck size={16}/> Stripe Secured Encryption</div>
        </div>
        <div className="bg-[#0F172A] p-10 rounded-[2.5rem] border border-white/5 space-y-10">
           <Elements stripe={stripePromise}><CheckoutForm /></Elements>
           <div className="border-t border-dashed border-white/10 pt-10 text-center">
              <p className="text-[10px] font-black text-violet-400 uppercase mb-4 tracking-widest uppercase">Testing Environment</p>
              <button onClick={handleSimulate} className="w-full bg-cyan-500 py-4 rounded-xl font-black uppercase text-xs text-black shadow-lg">Simulate $5 Test Checkout</button>
           </div>
        </div>
      </div>
    </div>
  );
}