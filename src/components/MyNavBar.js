"use client";

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
  return (
    <nav className="sticky top-0 z-40 border-b border-neutral-800 shadow-xl shadow-blue-500/20 bg-black backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 text-sm text-neutral-100">
        {/* LEFT: main nav */}
        <div className="flex items-center gap-4">
          {/* Home + Projects as plain links */}
          <Link href="/" className="text-sm text-neutral-100 hover:underline">
            Home
          </Link>

          <Link
            href="/projects"
            className="text-sm text-neutral-100 hover:underline"
          >
            Projects
          </Link>

          {/* Resume dropdown using NavigationMenu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-neutral-100 hover:bg-blue-500/80">
                  Resume
                </NavigationMenuTrigger>

                <NavigationMenuContent
                  className="mt-2 mb-2 min-w-[120px] rounded-md border border-neutral-700 bg-white-900/80 p-2 shadow-lg"
                >
                  <NavigationMenuLink asChild>
                    <Link
                      href="/resume"
                      className="block rounded px-2 py-1 text-black-200 hover:bg-blue-400/80"
                    >
                      Online
                    </Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink asChild>
                    <Link
                      href="/resume/pdf"
                      className="block rounded px-2 py-1 text-black-200 hover:bg-blue-400/80"
                    >
                      PDF
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* RIGHT: contact + auth */}
        <div className="flex items-center gap-5">
          <Link
            href="/contact"
            className="text-sm text-neutral-200 hover:text-white hover:underline"
          >
            Contact
          </Link>

          <AuthButton className="text-sm text-neutral-200 hover:text-white hover:underline" />
        </div>
      </div>
    </nav>
  );
}
