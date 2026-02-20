"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

function isDataUrl(src) {
  return typeof src === "string" && src.startsWith("data:image");
}

function dedupe(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr || []) {
    if (!x) continue;
    const v = String(x).trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

export default function GallerySlider({
  title,
  isMobile,
  linkText,
  images = [],
  showControlsWhenSingle = false,
  className = "",
  imgClassName,
}) {
  const items = useMemo(() => dedupe(images), [images]);
  const [i, setI] = useState(0);

  const hasImages = items.length > 0;
  const src = items[i];

  const prev = () => setI((p) => (p - 1 + items.length) % items.length);
  const next = () => setI((p) => (p + 1) % items.length);

  useEffect(() => {
    if (!items.length) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  useEffect(() => {
    if (i >= items.length) setI(0);
  }, [items.length, i]);

  const showControls =
    items.length > 1 || (showControlsWhenSingle && items.length === 1);

const imageFitClass = imgClassName ?? (isMobile ? "object-cover" : "object-contain");
  const ctrlBtn =
    "rounded-xl border border-border bg-background/55 backdrop-blur px-3 py-2 text-xs " +
    "text-foreground shadow-sm transition hover:bg-accent/60 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "disabled:opacity-40";

  const counterPill =
    "rounded-full border border-border bg-background/55 backdrop-blur px-2 py-0.5 " +
    "text-[10px] text-foreground/90";

  return (
    <div className={["flex justify-center", className].join(" ")}>
      {isMobile ? (
        // PHONE FRAME
        <div className="relative flex items-center justify-center">
          <div
            className="
              relative h-120 w-[210px] overflow-hidden rounded-[1.6rem]
              border border-border bg-card/60 backdrop-blur
              shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]
            "
          >
            {/* subtle top highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent opacity-70" />

            {hasImages ? (
              <Image
                src={src}
                alt={title}
                fill
                className={imageFitClass}
                unoptimized={isDataUrl(src)}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                No preview
              </div>
            )}

            {/* Controls */}
            {showControls && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous"
                  disabled={items.length < 2}
                  className={["absolute left-2 top-1/2 -translate-y-1/2", ctrlBtn].join(" ")}
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Next"
                  disabled={items.length < 2}
                  className={["absolute right-2 top-1/2 -translate-y-1/2", ctrlBtn].join(" ")}
                >
                  →
                </button>

                <div className={["absolute bottom-2 left-1/2 -translate-x-1/2", counterPill].join(" ")}>
                  {items.length ? `${i + 1}/${items.length}` : "0/0"}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        // WEB BROWSER FRAME
        <div
          className="
            relative w-full overflow-hidden rounded-2xl
            border border-border bg-card/60 backdrop-blur
            shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]
          "
        >
          <div className="flex items-center gap-2 border-b border-border bg-background/35 px-3 py-2 text-[10px]">
            <span className="flex gap-1">
              {/* keep these as “browser chrome” accents */}
              <span className="h-2 w-2 rounded-full bg-red-500/70" />
              <span className="h-2 w-2 rounded-full bg-amber-400/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
            </span>

            <span className="ml-2 flex-1 truncate text-muted-foreground">
              {linkText || "localhost:3000"}
            </span>

            {items.length > 1 && (
              <span className="text-muted-foreground">
                {i + 1}/{items.length}
              </span>
            )}
          </div>

          {/* aspect-video keeps it consistent */}
          <div className="relative aspect-video w-full bg-background/25">
            {hasImages ? (
              <Image
                src={src}
                alt={title}
                fill
                className={imageFitClass}
                unoptimized={isDataUrl(src)}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                No preview
              </div>
            )}

            {/* Controls */}
            {showControls && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous"
                  disabled={items.length < 2}
                  className={["absolute left-3 top-1/2 -translate-y-1/2", ctrlBtn].join(" ")}
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Next"
                  disabled={items.length < 2}
                  className={["absolute right-3 top-1/2 -translate-y-1/2", ctrlBtn].join(" ")}
                >
                  →
                </button>

                {items.length > 1 && (
                  <div className={["absolute bottom-3 left-1/2 -translate-x-1/2", counterPill].join(" ")}>
                    {i + 1}/{items.length}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}