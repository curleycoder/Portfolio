"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useReducedMotion } from "framer-motion";

export default function ParticlesHero() {
  const reduce = useReducedMotion();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  if (reduce) return null;

  return (
    <Particles
      init={particlesInit}
      className="absolute inset-0 -z-10"
      options={{
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          number: { value: 38, density: { enable: true, area: 800 } },
          color: { value: ["#a855f7", "#22d3ee", "#3b82f6"] },
          opacity: { value: 0.18 },
          size: { value: { min: 1, max: 2 } },
          move: { enable: true, speed: 0.6, outModes: { default: "out" } },
          links: { enable: true, distance: 140, opacity: 0.12, width: 1 },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            onClick: { enable: true, mode: "push" },
            resize: true,
          },
          modes: {
            repulse: { distance: 120, duration: 0.4 },
            push: { quantity: 2 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
