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

  // Defaults: mobile can be cover; web should be contain to look like a full site screenshot
const imageFitClass = imgClassName ?? "object-contain bg-neutral-950";


  return (
    <div className={`flex justify-center ${className}`}>
      {isMobile ? (
        // PHONE FRAME
        <div className="relative flex items-center justify-center">
          <div className="relative h-[320px] w-[150px] overflow-hidden rounded-[1.6rem] border border-neutral-700/80 bg-neutral-900">
            {hasImages ? (
              <Image
                src={src}
                alt={title}
                fill
                className={imageFitClass}
                unoptimized={isDataUrl(src)}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-neutral-500">
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
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-950/80 px-2 py-1 text-xs text-neutral-200 hover:bg-neutral-900 disabled:opacity-40"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next"
                  disabled={items.length < 2}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-950/80 px-2 py-1 text-xs text-neutral-200 hover:bg-neutral-900 disabled:opacity-40"
                >
                  →
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-neutral-700 bg-neutral-950/70 px-2 py-0.5 text-[10px] text-neutral-200">
                  {items.length ? `${i + 1}/${items.length}` : "0/0"}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        // WEB BROWSER FRAME
        <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-lg shadow-black/40">
          <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-950/80 px-3 py-2 text-[10px] text-neutral-400">
            <span className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500/70" />
              <span className="h-2 w-2 rounded-full bg-amber-400/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
            </span>

            <span className="ml-2 flex-1 truncate text-neutral-500">
              {linkText || "localhost:3000"}
            </span>

            {items.length > 1 && (
              <span className="text-neutral-500">{i + 1}/{items.length}</span>
            )}
          </div>

          {/* KEY FIX: aspect ratio instead of fixed h-64 */}
          <div className="relative aspect-[16/9] w-full bg-neutral-900">
            {hasImages ? (
              <Image
                src={src}
                alt={title}
                fill
                className={imageFitClass}
                unoptimized={isDataUrl(src)}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-neutral-500">
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-950/80 px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-900 disabled:opacity-40"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next"
                  disabled={items.length < 2}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-950/80 px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-900 disabled:opacity-40"
                >
                  →     
                </button>

                {/* bottom counter (optional, helps UX) */}
                {items.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-neutral-700 bg-neutral-950/70 px-2 py-0.5 text-[10px] text-neutral-200">
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
