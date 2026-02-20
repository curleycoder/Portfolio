"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";

const ease = [0.16, 1, 0.3, 1];

export default function MyHero({ hero }) {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
  };

  const item = {
    hidden: reduce
      ? { opacity: 0 }
      : { opacity: 0, y: 14, filter: "blur(6px)" },
    show: reduce
      ? { opacity: 1 }
      : {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.55, ease },
        },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="relative pb-3">
      <div className="grid gap-6 md:grid-cols-[1.10fr_0.90fr] md:items-stretch">
        {/* LEFT */}
        <div className="min-w-0 flex flex-col justify-center">
          <motion.div variants={item} className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Portfolio
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-2 font-heading text-4xl sm:text-5xl leading-[1.02] tracking-[-0.02em]"
          >
            {hero.fullName}
          </motion.h1>

          <motion.div variants={item} className="mt-4">
            <div className="text-base sm:text-lg">
              <span className="text-muted-foreground">I do </span>
              <span className="font-semibold text-foreground">
                <TypeAnimation
                  sequence={[
                    "Full-Stack Development",
                    1400,
                    "Frontend Development",
                    1400,
                    "Agile Delivery (Scrum)",
                    1400,
                    "Product & Project Execution",
                    1400,
                  ]}
                  speed={50}
                  repeat={Infinity}
                  cursor
                />
              </span>
            </div>
          </motion.div>

          <motion.p variants={item} className="mt-5 max-w-xl text-sm sm:text-base text-muted-foreground">
            {hero.shortDescription}
          </motion.p>

          <motion.div variants={item} className="mt-7 flex flex-wrap gap-2">
            <a
              href="/calendar"
              className="
                inline-flex items-center gap-2 rounded-xl
                bg-primary text-primary-foreground
                border border-border
                px-5 py-3 text-sm font-semibold
                transition hover:opacity-90
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                focus-visible:ring-offset-2 focus-visible:ring-offset-background
                no-underline
              "
            >
              Book a Call <span className="opacity-70">→</span>
            </a>

            <a
              href="/projects"
              className="
                inline-flex items-center gap-2 rounded-xl
                border border-border bg-card/30 text-foreground
                px-5 py-3 text-sm font-semibold
                transition hover:bg-accent/60
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                focus-visible:ring-offset-2 focus-visible:ring-offset-background
                no-underline
              "
            >
              View Projects
            </a>
          </motion.div>
        </div>

        {/* RIGHT */}
        <motion.div variants={item} className="relative">
          <div
            className="
              relative min-h-[460px] overflow-hidden rounded-2xl
              border border-border bg-card/70 backdrop-blur
              shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]
            "
          >
            <Image
              src={hero.avatar}
              alt=""
              fill
              priority
              sizes="(min-width: 800px) 40vw, 100vw"
              className="object-cover object-center"
            />

            {/* soften image for readability across themes */}
            <div className="absolute inset-0 bg-gradient-to-l from-background/15 via-background/35 to-background/80" />

            {/* subtle grid texture */}
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--foreground)_6%,transparent)_1px,transparent_0)] bg-[length:24px_24px]" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}