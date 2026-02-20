"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AuthButton from "@/components/AuthButton";
import ThemeToggle from "./ThemeToggle";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

const navItem =
  "inline-flex items-center rounded-xl px-3 py-2 text-sm " +
  "text-muted-foreground transition-colors " +
  "border border-border/60 bg-card/30 " +
  "hover:bg-accent/60 hover:text-foreground " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background";

const primaryCta =
  "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold " +
  "text-primary-foreground transition hover:opacity-90 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background";

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
    <nav className="relative">
      <div className="flex items-center justify-between py-3">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center" aria-label="Home">
            <span className="relative inline-flex items-center justify-center rounded-full transition-transform duration-200 group-hover:rotate-6">
              <Image
                src="/butterfly.png"
                alt="Brand logo"
                width={44}
                height={44}
                priority
                className="relative"
              />
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/" className={navItem}>Home</Link>
            <Link href="/projects" className={navItem}>Projects</Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={`${navItem} data-[state=open]:bg-accent/60 data-[state=open]:text-foreground`}
                  >
                    Resume
                  </NavigationMenuTrigger>

                  <NavigationMenuContent className="rounded-xl bg-card/85 text-foreground backdrop-blur-lg border border-border shadow-[0_10px_30px_-18px_rgba(0,0,0,0.45)]">
                    <div className="flex flex-col gap-2 p-2">
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
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/contact" className={navItem}>Contact</Link>
          </div>
        </div>

        {/* RIGHT DESKTOP */}
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/calendar" className={primaryCta}>
            Book a Call
          </Link>
          <ThemeToggle />
          <AuthButton />
        </div>

        {/* MOBILE */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card/40 p-2 text-muted-foreground hover:bg-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="mt-2 rounded-2xl border border-border bg-card/70 backdrop-blur md:hidden animate-in fade-in duration-200">
          <div className="flex flex-col gap-2 p-3 text-sm">
            <Link href="/" className={navItem} onClick={() => setOpen(false)}>Home</Link>
            <Link href="/projects" className={navItem} onClick={() => setOpen(false)}>Projects</Link>
            <Link href="/resume" className={navItem} onClick={() => setOpen(false)}>Resume – Online</Link>
            <Link href="/resume/pdf" className={navItem} onClick={() => setOpen(false)}>Resume – PDF</Link>
            <Link href="/contact" className={navItem} onClick={() => setOpen(false)}>Contact</Link>

            <Link href="/calendar" className={primaryCta} onClick={() => setOpen(false)}>
              Book a Call
            </Link>

            <div className="pt-1">
              <AuthButton />
            </div>
          </div>
        </div>
      )}

      {/* subtle bottom accent line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary/60 via-primary/40 to-transparent opacity-80" />
    </nav>
  );
}