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
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(6px)" },
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
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative px-6 pb-6"
    >
      {/* tiny terminal hint */}
      <motion.div
        variants={item}
        className="pt-3 font-mono text-[11px] tracking-[0.16em] text-neutral-500"
      >
        $ whoami
      </motion.div>

      {/* 2-column hero: text left, image right */}
      <div className="mt-4 grid gap-8 md:grid-cols-[1.25fr_0.75fr] md:items-stretch">
        {/* LEFT: text */}
        <div className="min-w-0 flex flex-col justify-center">
          <motion.h1
            variants={item}
            className="text-4xl font-extrabold tracking-tight md:text-5xl"
          >
            {hero.fullName}
          </motion.h1>

          <motion.div variants={item} className="mt-4">
            <div className="font-mono text-[11px] tracking-[0.16em] text-neutral-500">
              $ i do
            </div>

            <div className="mt-1 text-xl font-semibold md:text-2xl">
              <span className="text-neutral-200">I do </span>
              <span className="text-[#BB0FAE]">
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

          <motion.p variants={item} className="mt-5 max-w-xl text-neutral-300">
            {hero.shortDescription}
          </motion.p>

          <motion.div variants={item} className="mt-7">
            <a
              href="/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-500/15 px-5 py-2.5 text-sm font-semibold text-purple-100 ring-1 ring-purple-500/25 transition hover:bg-purple-500/22 hover:ring-purple-500/40"
            >
              View Projects <span className="opacity-70">→</span>
            </a>
          </motion.div>
        </div>

        {/* RIGHT: image (full height of its column) */}
        <motion.div variants={item} className="relative">
          <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-neutral-800">
            <Image
              src={hero.avatar}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover object-center"
            />

            {/* darken + focus text side */}
            <div className="absolute inset-0 bg-gradient-to-l from-neutral-950/20 via-neutral-950/55 to-neutral-950" />

            {/* subtle grid texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.035)_1px,transparent_0)] bg-[length:24px_24px]" />
          </div>

          {/* optional caption (dev vibe, low noise) */}
          <div className="mt-3 font-mono text-[10px] tracking-[0.16em] text-neutral-500">
            // building → shipping → iterating
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
