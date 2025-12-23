import MyNavBar from "@/components/MyNavBar";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import { Suspense } from "react";
import AnalyticsTracker from "@/components/Analytics";
import ChatWidget from "@/components/ChatWidget";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shabnam Beiraghian",
  description: "A showcase of Shabnam's work and projects",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-neutral-50`}>
        <Providers>
        <div className="sticky top-0 z-50">
            <MyNavBar />
        </div>
       <Suspense fallback={null}>
           <AnalyticsTracker />
        </Suspense>

        <Toaster/>
        <main>{children}</main>
        </Providers>
        <ChatWidget biz="beiraghian"/>
      </body>
    </html>
  );
}

