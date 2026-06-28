"use client";
import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white" suppressHydrationWarning>
        <Providers>
          
          {!isDashboard && <Navbar />}
          
          <main className="min-h-screen">
            {children}
          </main>

          
          {!isDashboard && <Footer />}
        </Providers>
      </body>
    </html>
  );
}