"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function TokenManager({ children }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      const userInfo = { email: session.user.email };
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jwt`, userInfo)
        .then(res => {
          if (res.data.token) {
            localStorage.setItem('access-token', res.data.token);
            console.log("Token Secured ✅");
          }
        })
        .catch(err => console.error("JWT Error:", err));
    } else {
      localStorage.removeItem('access-token');
    }
  }, [session]);

  return children;
}

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <TokenManager>
        {children}
        <ToastContainer position="bottom-right" theme="dark" />
      </TokenManager>
    </SessionProvider>
  );
}