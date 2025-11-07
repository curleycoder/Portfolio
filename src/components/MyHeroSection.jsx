"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MyHero() {
  return (
    <section className="mx-auto bg-blue-100 max-w-6xl px-4 py-10">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="relative aspect-square md:aspect-auto md:h-full">
            {/* Place a logo.jpg under public/ */}
            <Image
              src="/logo11.jpg"
              alt="Profile"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="p-6">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-3xl md:text-4xl">Shabnam Beiraghian</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-base leading-relaxed">
              <p>
                Frontend developer focused on clean UI and fast user
                experiences. I build with Next.js, Tailwind, and shadcn/ui.
              </p>
            </CardContent>
          </div>
        </div>
      </Card>
    </section>
  );
}
