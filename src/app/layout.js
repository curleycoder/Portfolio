import MyNavBar from "@/components/MyNavBar";
import "./globals.css";
import { Lato, Source_Code_Pro } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import { Suspense } from "react";
import AnalyticsTracker from "@/components/Analytics";
import ChatWidget from "@/components/ChatWidget";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-scp",
  display: "swap",
});

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
      <body
        className={`${lato.variable} ${sourceCodePro.variable} min-h-screen bg-neutral-950 text-neutral-50`}
      >
        <Providers>
          <div className="sticky top-0 z-50">
            <MyNavBar />
          </div>
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>

          <Toaster />
          <main>{children}</main>
        </Providers>
        {/* <ChatWidget
          biz="beiraghian"
          title="Dew Assistant"
          subtitle="Projects • Book a Call • Contact"
          avatarSrc="/avatar.png"
        /> */}
      </body>
    </html>
  );
}
