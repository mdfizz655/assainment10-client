"use client";
import { signIn } from "next-auth/react";
import { Zap, Camera, Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ১. ইমেইল/পাসওয়ার্ড দিয়ে রেজিস্ট্রেশন হ্যান্ডলার
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const photo = form.photo.value;
    const password = form.password.value;

    const newUser = { 
      name, 
      email, 
      photo, 
      password, 
      role: "User", 
      status: "Free",
      createdAt: new Date()
    };

    try {
      // আপনার ব্যাকএন্ড সার্ভারে ডাটা পাঠানো
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, newUser);
      
      if (res.data.insertedId) {
        toast.success("Account Created Successfully! Please Login.");
        router.push("/login");
      } else {
        toast.error(res.data.message || "Registration failed!");
      }
    } catch (error) {
      toast.error("Could not connect to server. Check if your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // ২. গুগল দিয়ে রেজিস্ট্রেশন/লগইন হ্যান্ডলার
  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      toast.error("Google Sign-up failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-28 pb-12 px-4">
      {/* Registration Card */}
      <div className="max-w-md w-full bg-white border-2 border-black p-10 rounded-[40px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="bg-black w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-12">
            <Zap className="text-yellow-400 fill-yellow-400" size={28} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter uppercase text-black">Join Promptly.</h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">Start your AI journey today</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-4 text-gray-400" size={18} />
            <input name="name" type="text" placeholder="Full Name" className="w-full p-4 pl-12 border-2 border-black rounded-2xl outline-none focus:bg-yellow-50 font-bold text-sm text-black" required />
          </div>
          
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
            <input name="email" type="email" placeholder="Email Address" className="w-full p-4 pl-12 border-2 border-black rounded-2xl outline-none focus:bg-yellow-50 font-bold text-sm text-black" required />
          </div>
          
          <div className="relative">
            <Camera className="absolute left-4 top-4 text-gray-400" size={18} />
            <input name="photo" type="text" placeholder="Photo URL" className="w-full p-4 pl-12 border-2 border-black rounded-2xl outline-none focus:bg-yellow-50 font-bold text-sm text-black" required />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
            <input name="password" type="password" placeholder="Password" className="w-full p-4 pl-12 border-2 border-black rounded-2xl outline-none focus:bg-yellow-50 font-bold text-sm text-black" required />
          </div>
          
          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-black text-white py-4 rounded-2xl font-black hover:bg-gray-800 transition shadow-lg active:scale-95 disabled:opacity-50 uppercase tracking-widest mt-2"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative mb-6 text-center">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
            <span className="relative bg-white px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Or Register With</span>
          </div>

          {/* Google Button */}
          <button 
            onClick={handleGoogleLogin} 
            type="button"
            className="w-full bg-white border-2 border-black text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="G" />
            Sign up with Google
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-10 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Already have an account? 
          <Link href="/login" className="text-black border-b-2 border-yellow-400 ml-1 hover:text-yellow-600 transition">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}