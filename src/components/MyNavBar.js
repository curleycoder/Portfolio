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
  "hover:bg-white/10 hover:text-white " +
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
    <nav className="sticky top-0 z-40 border-b border-neutral-800 bg-black/90 backdrop-blur shadow-xl shadow-blue-500/20">
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
                      className={`${navItem} bg-transparent data-[state=open]:bg-white/10 data-[state=open]:text-black`}
                    >
                      Resume
                    </NavigationMenuTrigger>

                    <NavigationMenuContent className="mt-2 rounded-md border border-neutral-800 bg-black/95 p-2 shadow-lg backdrop-blur">
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

              <Link href="/blog" className={navItem}>
                Blog
              </Link>
            </div>
          </div>

          {/* RIGHT DESKTOP */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/calendar"
              className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60"
            >
              Book a Call
            </Link>

            <Link href="/contact" className={navItem}>
              Contact
            </Link>

            <AuthButton />
          </div>

          {/* MOBILE */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/calendar"
              className="rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-500"
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
