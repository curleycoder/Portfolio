"use client";

import { useState } from "react";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

export default function MyNavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-neutral-800 shadow-xl shadow-blue-500/20 bg-black backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* TOP BAR */}
        <div className="flex items-center justify-between py-3 text-sm text-neutral-100">
          {/* LEFT NAV (DESKTOP) */}
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/" className="text-sm hover:underline">
              Home
            </Link>

            <Link href="/projects" className="text-sm hover:underline">
              Projects
            </Link>

            {/* RESUME DROPDOWN */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-neutral-100 hover:bg-blue-600/60">
                    Resume
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="mt-2 rounded-md border border-neutral-700 bg-white p-2 shadow-lg">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/resume"
                        className="block rounded px-2 py-1 hover:bg-blue-500/60"
                      >
                        Online
                      </Link>
                    </NavigationMenuLink>

                    <NavigationMenuLink asChild>
                      <Link
                        href="/resume/pdf"
                        className="block rounded px-2 py-1 hover:bg-blue-500/60"
                      >
                        PDF
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/blog" className="text-sm hover:underline">
              Blog
            </Link>
          </div>

          {/* MOBILE LOGO */}
          <Link
            href="/"
            className="text-md font-semibold tracking-tight text-neutral-100 md:hidden"
          >
            Shabnam Beiraghian
          </Link>

          {/* RIGHT SIDE (DESKTOP) */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Try Dew (opens widget) */}
            <button
              type="button"
              onClick={() => {
                // open widget (preferred)
                window.dispatchEvent(new CustomEvent("dew:open"));
              }}
              className="rounded-md border border-neutral-600 px-4 py-2 text-neutral-100 hover:bg-white/10"
              title="Try the live Dew demo"
            >
              Try Dew
            </button>

            {/* Book a Call (primary) */}
            <Link
              href="/calendar"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
            >
              Book a Call
            </Link>

            <Link href="/contact" className="hover:underline">
              Contact
            </Link>

            <AuthButton className="hover:underline" />
          </div>

          {/* MOBILE: Book a Call + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/calendar"
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
            >
              Book a Call
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center p-2 text-neutral-200"
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
                  d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE MENU (combined with your clean version) */}
        {open && (
          <div className="border-t border-neutral-800 bg-black pb-3 md:hidden animate-in fade-in duration-200">
            <div className="flex flex-col gap-3 px-2 py-3 text-sm text-neutral-100">
              <Link href="/" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link href="/projects" onClick={() => setOpen(false)}>
                Projects
              </Link>
              <Link href="/resume" onClick={() => setOpen(false)}>
                Resume – Online
              </Link>
              <Link href="/resume/pdf" onClick={() => setOpen(false)}>
                Resume – PDF
              </Link>
              <Link href="/blog" onClick={() => setOpen(false)}>
                Blog
              </Link>
              <Link href="/contact" onClick={() => setOpen(false)}>
                Contact
              </Link>

              {/* Auth Button (mobile) */}
              <div className="pt-2 border-t border-neutral-800">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
