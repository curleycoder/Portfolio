"use client";
import { useEffect, useState } from "react";

export default function useScrollSpy(ids) {
  const [active, setActive] = useState(ids?.[0] ?? "");

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);

    const io = new IntersectionObserver(
      (entries) => {
        const topMost = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (topMost?.target?.id) setActive(topMost.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0.1, 0.2, 0.3] }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}
