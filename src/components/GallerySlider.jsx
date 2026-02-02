"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

function isDataUrl(src) {
  return typeof src === "string" && src.startsWith("data:image");
}

function dedupe(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
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
}) {
  const items = useMemo(() => dedupe(images), [images]);
  const [i, setI] = useState(0);

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

  const src = items[i];
  const hasImages = items.length > 0;

  return (
    <div className="flex justify-center">
      {isMobile ? (
        // PHONE FRAME
        <div className="relative flex items-center justify-center">
          <div className="relative h-[320px] w-[150px] overflow-hidden rounded-[1.6rem] border border-neutral-700/80 bg-neutral-900">
            {hasImages ? (
              <Image
                src={src}
                alt={title}
                fill
                className="object-cover"
                unoptimized={isDataUrl(src)}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-neutral-500">
                No preview
              </div>
            )}

            {/* Controls */}
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-950/80 px-2 py-1 text-xs text-neutral-200 hover:bg-neutral-900"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-950/80 px-2 py-1 text-xs text-neutral-200 hover:bg-neutral-900"
                >
                  →
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-neutral-700 bg-neutral-950/70 px-2 py-0.5 text-[10px] text-neutral-200">
                  {i + 1}/{items.length}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        // WEB BROWSER FRAME
        <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950">
          <div className="flex items-center gap-2 px-3 py-2 text-[10px] text-neutral-400">
            <span className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500/70" />
              <span className="h-2 w-2 rounded-full bg-amber-400/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
            </span>
            <span className="ml-2 truncate text-neutral-500">
              {linkText || "localhost:3000"}
            </span>

            {items.length > 1 && (
              <span className="ml-auto text-neutral-500">
                {i + 1}/{items.length}
              </span>
            )}
          </div>

          <div className="relative h-64 w-full bg-neutral-900">
            {hasImages ? (
              <Image
                src={src}
                alt={title}
                fill
                className="object-cover"
                unoptimized={isDataUrl(src)}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-neutral-500">
                No preview
              </div>
            )}

            {/* Controls */}
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-950/80 px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-900"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-950/80 px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-900"
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
