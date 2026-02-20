"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

function isDataUrl(src) {
  return typeof src === "string" && src.startsWith("data:image");
}

function isLikelyImageSrc(val) {
  return (
    typeof val === "string" &&
    (val.startsWith("http://") ||
      val.startsWith("https://") ||
      val.startsWith("/") ||
      val.startsWith("data:image"))
  );
}

export default function HighlightFrame({
  src,
  title,
  linkText = "localhost:3000",
  forceMode, // "mobile" | "web"
  className = "",
}) {
  const safeSrc = isLikelyImageSrc(src) ? src : "";
  const [natural, setNatural] = useState(null); // { w, h }

  useEffect(() => {
    if (!safeSrc) {
      setNatural(null);
      return;
    }

    let alive = true;
    const img = new window.Image();

    img.onload = () => {
      if (!alive) return;
      const w = img.naturalWidth || img.width || 0;
      const h = img.naturalHeight || img.height || 0;
      setNatural(w && h ? { w, h } : null);
    };

    img.onerror = () => alive && setNatural(null);
    img.src = safeSrc;

    return () => {
      alive = false;
    };
  }, [safeSrc]);

  const autoMode = useMemo(() => {
    if (!natural) return "web";
    return natural.h / natural.w > 1.15 ? "mobile" : "web";
  }, [natural]);

  const mode = forceMode || autoMode;

  if (!safeSrc) {
    return (
      <div className={`flex h-28 w-full items-center justify-center rounded-xl border border-border bg-card/60 backdrop-blur text-[10px] text-muted-foreground ${className}`}>
        No preview
      </div>
    );
  }

  const unoptimized = isDataUrl(safeSrc);

  // ✅ important: web should be "contain" inside a height-driven box
  const imgClass = "object-contain bg-background/25";

  return (
    <div className={`h-full w-full ${className}`}>
      {mode === "mobile" ? (
        // MOBILE: height-driven (fills parent)
        <div className="h-full w-full flex items-start justify-center">
          <div className="relative h-full max-h-[520px] aspect-[9/19] overflow-hidden rounded-[1.6rem] border border-border bg-card/40">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent opacity-70" />

            <Image
              src={safeSrc}
              alt={title || "Highlight"}
              fill
              className={imgClass}
              unoptimized={unoptimized}
              sizes="(min-width: 1024px) 280px, 200px"
            />
          </div>
        </div>
      ) : (
        // WEB: ✅ height-driven (fills parent) — no aspectRatio
        <div className="h-full w-full overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)] flex flex-col">
          {/* browser bar */}
          <div className="shrink-0 flex items-center gap-2 border-b border-border bg-background/35 px-3 py-2 text-[10px]">
            <span className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500/70" />
              <span className="h-2 w-2 rounded-full bg-amber-400/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
            </span>
            <span className="ml-2 flex-1 truncate text-muted-foreground">
              {linkText}
            </span>
          </div>

          {/* ✅ this now stretches to fill the rest of the parent height */}
          <div className="relative flex-1 min-h-0 bg-background/25">
            <Image
              src={safeSrc}
              alt={title || "Highlight"}
              fill
              className={imgClass}
              unoptimized={unoptimized}
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}