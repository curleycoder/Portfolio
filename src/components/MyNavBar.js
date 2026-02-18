"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AuthButton from "@/components/AuthButton";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

const navItem =
  "inline-flex items-center rounded-md px-3 py-2 text-sm text-neutral-200 transition-colors " +
  "hover:bg-purple-500/40 hover:text-white " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60";

export default function MyNavBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  return (
    <nav className="sticky top-0 z-40 border-b border-neutral-800 bg-black/90 backdrop-blur shadow-xl shadow-purple-500/20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* TOP BAR */}
        <div className="flex items-center justify-between py-3 font-ui">
          {/* LEFT */}
          <div className="flex items-center gap-8">
            {/* BRAND */}
            <Link href="/" className="group flex items-center">
              <span className="relative inline-flex items-center justify-center rounded-full transition-transform duration-200 group-hover:rotate-6">
                <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-100 bg-purple-500/30" />
                <Image
                  src="/butterfly.png"
                  alt="Brand logo"
                  width={48}
                  height={48}
                  priority
                  className="relative"
                />
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/" className={navItem}>
                Home
              </Link>

              <Link href="/projects" className={navItem}>
                Projects
              </Link>

              {/* RESUME DROPDOWN */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={`${navItem} bg-transparent data-[state=open]:bg-purple/50 data-[state=open]:text-black`}
                    >
                      Resume
                    </NavigationMenuTrigger>

                    <NavigationMenuContent className="mt-2 rounded-md border border-purple-800 bg-purple/95 p-2 shadow-lg backdrop-blur">
                      <NavigationMenuLink asChild>
                        <Link href="/resume" className={navItem}>
                          Online
                        </Link>
                      </NavigationMenuLink>

                      <NavigationMenuLink asChild>
                        <Link href="/resume/pdf" className={navItem}>
                          PDF
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <Link href="/contact" className={navItem}>
              Contact
            </Link>

              {/* <Link href="/blog" className={navItem}>
                Blog
              </Link> */}
            </div>
          </div>

          {/* RIGHT DESKTOP */}
          <div className="hidden items-center gap-2 md:flex">
            {/* <Link
              href="/calendar"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-500/40 px-4 py-2 text-sm font-semibold text-purple-100 ring-1 ring-purple-500/25 transition hover:bg-purple-500/22 hover:ring-purple-500/22"
            >
              Book a Call
            </Link> */}

            

            <AuthButton />
          </div>

          {/* MOBILE */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500/40 px-5 py-2.5 text-sm font-semibold text-purple-100 ring-1 ring-purple-500/25 transition hover:bg-purple-500/22 hover:ring-purple-500/22"
            >
              Book a Call
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-200 hover:bg-white/10"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    open
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="border-t border-neutral-800 bg-black md:hidden animate-in fade-in duration-200">
            <div className="flex flex-col gap-2 px-2 py-3 text-sm text-neutral-100">
              <Link href="/" className={navItem} onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link
                href="/projects"
                className={navItem}
                onClick={() => setOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/resume"
                className={navItem}
                onClick={() => setOpen(false)}
              >
                Resume – Online
              </Link>
              <Link
                href="/resume/pdf"
                className={navItem}
                onClick={() => setOpen(false)}
              >
                Resume – PDF
              </Link>
              <Link
                href="/blog"
                className={navItem}
                onClick={() => setOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className={navItem}
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>

              <div className="mt-2 border-t border-neutral-800 pt-2">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
