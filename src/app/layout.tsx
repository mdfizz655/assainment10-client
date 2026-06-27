"use client";
import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // চেক করুন ইউজার ড্যাশবোর্ড রাউটে আছে কি না
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white" suppressHydrationWarning>
        <Providers>
          {/* যদি ড্যাশবোর্ড না হয়, তবেই Navbar দেখাও */}
          {!isDashboard && <Navbar />}
          
          <main className="min-h-screen">
            {children}
          </main>

          {/* যদি ড্যাশবোর্ড না হয়, তবেই Footer দেখাও */}
          {!isDashboard && <Footer />}
        </Providers>
      </body>
    </html>
  );
}