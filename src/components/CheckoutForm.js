"use client";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
 import { useState, useEffect } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

 




export default function CheckoutForm() {
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
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card, billing_details: { email: session?.user?.email } }
    });



    if (error) {
      toast.error(error.message);
    } else if (paymentIntent.status === "succeeded") {
      const paymentInfo = { email: session.user.email, transactionId: paymentIntent.id, amount: 5, date: new Date() };
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payments`, paymentInfo, {
        headers: { authorization: `Bearer ${localStorage.getItem("access-token")}` }
      });


      toast.success("Welcome to Pro Lifetime!");
      router.push("/dashboard");
    }
    setProcessing(false);
  };


  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-black/20 border border-white/10 p-5 rounded-2xl">
        <CardElement options={{
            style: { base: { fontSize: '14px', color: '#fff', '::placeholder': { color: '#64748b' } } }
        }} />
      </div>
      <button disabled={!stripe || !clientSecret || processing} className="w-full bg-violet-600 py-4 rounded-2xl font-black text-white text-xs uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50 transition-all">
        {processing ? "Syncing..." : "Pay One-time $5.00"}
      </button>
    </form>
  );
}