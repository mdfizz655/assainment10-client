"use client";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, ShieldCheck } from "lucide-react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // ১. ব্যাকএন্ড থেকে পেমেন্ট ইন্টেন্ট (Payment Intent) নেওয়া
  useEffect(() => {
    if (session?.user?.email) {
      const token = localStorage.getItem("access-token");
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/create-payment-intent`, 
        { price: 5 }, 
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then(res => {
        setClientSecret(res.data.clientSecret);
      })
      .catch(err => {
        console.error("Payment Intent Error", err);
      });
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (card == null) return;

    setProcessing(true);
    setError("");

    // ২. স্ট্রাইপ পেমেন্ট কনফার্ম করা
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          email: session?.user?.email || "unknown",
          name: session?.user?.name || "anonymous",
        },
      },
    });

    if (confirmError) {
      setError(confirmError.message);
      toast.error(confirmError.message);
      setProcessing(false);
    } else {
      if (paymentIntent.status === "succeeded") {
        // ৩. পেমেন্ট সফল হলে ডাটাবেসে তথ্য সেভ করা
        const paymentData = {
          email: session.user.email,
          transactionId: paymentIntent.id,
          amount: 5,
          date: new Date(),
          status: 'Premium'
        };

        const token = localStorage.getItem("access-token");
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payments`, paymentData, {
            headers: { authorization: `Bearer ${token}` }
          });

          if (res.data.success) {
            toast.success("Identity Verified: Pro Access Activated!");
            window.location.href = "/dashboard"; // হার্ড রিফ্রেশ যাতে প্রোফাইল আপডেট হয়
          }
        } catch (err) {
          toast.error("Database synchronization failed.");
        }
      }
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* কার্ড ইনপুট বক্স */}
      <div className="bg-black/40 border border-white/10 p-5 rounded-2xl">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#ffffff",
                fontFamily: "Inter, sans-serif",
                "::placeholder": { color: "#64748b" },
              },
              invalid: { color: "#ef4444" },
            },
          }}
        />
      </div>

      {error && <p className="text-red-500 text-xs font-bold uppercase">{error}</p>}

      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
        <ShieldCheck size={14} className="text-green-500" />
        Encrypted and Secured by Stripe
      </div>

      {/* সাবমিট বাটন */}
      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black py-4 rounded-xl uppercase text-xs tracking-[0.2em] shadow-xl shadow-violet-600/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <Loader2 className="animate-spin" size={16} /> Transmitting...
          </>
        ) : (
          "Pay One-time $5.00"
        )}
      </button>
    </form>
  );
}