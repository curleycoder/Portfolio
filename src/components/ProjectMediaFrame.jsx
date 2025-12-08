"use client";

import { useState } from "react";
import Image from "next/image";

export function ProjectMediaFrame({ title, images, isMobile, link }) {
  const safeImages = (images || []).filter(Boolean);
  const [index, setIndex] = useState(0);

  if (!safeImages.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-neutral-500">
        No image set
      </div>
    );
  }

  const current = safeImages[index];

  const goPrev = () =>
    setIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  const goNext = () =>
    setIndex((prev) =>
      prev === safeImages.length - 1 ? 0 : prev + 1
    );

  return (
    <div className="space-y-3">
      {/* Frame with blue glow */}
      <div className="relative overflow-hidden">
        {/* Fake browser bar for web apps */}
        {!isMobile && (
          <div className="flex items-center gap-2 border-b border-neutral-80 px-3 py-2 text-[10px] text-neutral-400">
            <span className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500/70" />
              <span className="h-2 w-2 rounded-full bg-amber-400/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
            </span>
            <span className="ml-2 truncate">
              {link?.replace(/^https?:\/\//, "") || "localhost:3000"}
            </span>
          </div>
        )}

        <div className="relative flex items-center justify-center px-4 py-4">
          {isMobile ? (
            // PHONE FRAME
            <div className="relative flex items-center justify-center">
              <div className="relative h-[420px] w-[200px] overflow-hidden">
                <Image
                  src={current}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            // WEB FRAME (screen area)
            <div className="relative h-72 w-full overflow-hidden">
              <Image
                src={current}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Slider arrows */}
          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-sm text-neutral-100 hover:bg-black/90"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-sm text-neutral-100 hover:bg-black/90"
                aria-label="Next image"
              >
                →
              </button>
            </>
          )}
        </div>
      </div>

      {/* Dots */}
      {safeImages.length > 1 && (
        <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400">
          {safeImages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${
                i === index ? "bg-blue-400" : "bg-neutral-700"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
