"use client";
import { motion } from "framer-motion";
import useScrollSpy from "@/hooks/useScroll";

const steps = [
  { id: "hero", label: "init: hero + stack" },
  { id: "projects", label: "feat: projects" },
  { id: "github", label: "chore: github activity" },
];

export default function CommitRail() {
  const active = useScrollSpy(steps.map((s) => s.id));
  const activeIndex = Math.max(0, steps.findIndex((s) => s.id === active));

  return (
    <aside className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-40">
      <div className="relative w-64">
        {/* vertical line */}
        <div className="absolute left-2 top-2 bottom-2 w-px bg-neutral-800" />

        {/* moving dot */}
        <motion.div
          className="absolute left-[5px] h-3 w-3 rounded-full bg-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.7)]"
          animate={{ top: 8 + activeIndex * 44 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        />

        {/* commit labels */}
        <div className="space-y-6 pl-8">
          {steps.map((s) => {
            const isActive = s.id === active;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={[
                  "block font-mono text-[11px] tracking-[0.14em] transition",
                  isActive ? "text-purple-200" : "text-neutral-500 hover:text-neutral-300",
                ].join(" ")}
              >
                {s.label}
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
