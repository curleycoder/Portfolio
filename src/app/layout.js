import MyNavBar from "@/components/MyNavBar";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shabnam's Portfolio",
  description: "A showcase of Shabnam's work and projects",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <div className="sticky top-0 z-50 p-4">
            <MyNavBar />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}

