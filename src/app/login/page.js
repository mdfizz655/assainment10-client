"use client";
import { signIn } from "next-auth/react";
import { Zap, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      toast.error("Invalid credentials!");
    } else {
      toast.success("Welcome Back!");
      router.push("/dashboard"); // লগইন শেষে সরাসরি ড্যাশবোর্ড
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 px-4">
      <div className="max-w-md w-full bg-white border-2 border-black p-10 rounded-[40px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-8">
          <div className="bg-black w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-12">
            <Zap className="text-yellow-400 fill-yellow-400" size={28} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Login Session</h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">Access your creator dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
            <input name="email" type="email" placeholder="Email" className="w-full p-4 pl-12 border-2 border-black rounded-2xl outline-none font-bold text-sm" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
            <input name="password" type="password" placeholder="Password" className="w-full p-4 pl-12 border-2 border-black rounded-2xl outline-none font-bold text-sm" required />
          </div>
          <button disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 disabled:opacity-50">
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6">
          <button onClick={handleGoogleLogin} className="w-full bg-white border-2 border-black text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="G" />
            Sign in with Google
          </button>
        </div>

        <p className="text-center mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          New Creator? <Link href="/register" className="text-black border-b-2 border-yellow-400 ml-1">Register</Link>
        </p>
      </div>
    </div>
  );
}