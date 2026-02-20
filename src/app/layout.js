import MyNavBar from "@/components/MyNavBar";
import "./globals.css";
import { Arvo, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import { Suspense } from "react";
import AnalyticsTracker from "@/components/Analytics";
import Footer from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const arvo = Arvo({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata = {
  title: "Shabnam Beiraghian",
  description: "A showcase of Shabnam's work and projects",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          inter.variable,
          arvo.variable,
          "min-h-screen bg-background text-foreground antialiased",
        ].join(" ")}
      >
        <Providers>
          {/* global background texture */}
          <div className="dev-grid min-h-screen">
            {/* sticky header with subtle glass */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur">
              <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <MyNavBar />
              </div>
            </header>

            <Suspense fallback={null}>
              <AnalyticsTracker />
            </Suspense>

            <Toaster />

            {/* consistent site width everywhere */}
            <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
              {children}
            </main>

            <footer className="mt-20 border-t border-border">
              <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <Footer />
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}