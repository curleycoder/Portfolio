"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

function isDataUrl(src: string) {
  return typeof src === "string" && src.startsWith("data:image");
}

function isLikelyImageSrc(val: unknown) {
  return (
    typeof val === "string" &&
    (val.startsWith("http://") ||
      val.startsWith("https://") ||
      val.startsWith("/") ||
      val.startsWith("data:image"))
  );
}

type Mode = "mobile" | "web";

export default function HighlightFrame({
  src,
  title,
  linkText = "localhost:3000",
  forceMode,
}: {
  src: string;
  title: string;
  linkText?: string;
  forceMode?: Mode;
}) {
  const safeSrc = isLikelyImageSrc(src) ? src : "";
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (!safeSrc) {
      setNatural(null);
      return;
    }

    let alive = true;
    const img = new window.Image();

    img.onload = () => {
      if (!alive) return;
      const w = (img as any).naturalWidth || img.width || 0;
      const h = (img as any).naturalHeight || img.height || 0;
      setNatural(w && h ? { w, h } : null);
    };

    img.onerror = () => alive && setNatural(null);
    img.src = safeSrc;

    return () => {
      alive = false;
    };
  }, [safeSrc]);

  const autoMode: Mode = useMemo(() => {
    if (!natural) return "web";
    // Tall screenshots => mobile frame
    return natural.h / natural.w > 1.15 ? "mobile" : "web";
  }, [natural]);

  const mode = forceMode ?? autoMode;

  if (!safeSrc) {
    return (
      <div className="mt-2 flex h-28 w-full items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 text-[10px] text-neutral-500">
        No preview
      </div>
    );
  }

  const imgClass = "object-contain bg-neutral-950";
  const unoptimized = isDataUrl(safeSrc);

  // ✅ Key change: web container uses the image's real aspect ratio
  const webAspect = natural ? `${natural.w} / ${natural.h}` : "16 / 9";

  return (
    <div className="mt-2">
      {mode === "mobile" ? (
        <div className="relative flex items-center justify-center">
          <div className="relative h-[320px] w-[150px] overflow-hidden rounded-[1.6rem] border border-neutral-700/80 bg-neutral-900">
            <Image
              src={safeSrc}
              alt={title || "Highlight"}
              fill
              className={imgClass}
              unoptimized={unoptimized}
              sizes="150px"
            />
          </div>
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-lg shadow-black/40">
          <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-950/80 px-3 py-2 text-[10px] text-neutral-400">
            <span className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500/70" />
              <span className="h-2 w-2 rounded-full bg-amber-400/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
            </span>
            <span className="ml-2 flex-1 truncate text-neutral-500">
              {linkText}
            </span>
          </div>

          {/* ✅ not hard-coded 16/9 anymore */}
          <div
            className="relative w-full bg-neutral-900"
            style={{ aspectRatio: webAspect }}
          >
            <Image
              src={safeSrc}
              alt={title || "Highlight"}
              fill
              className={imgClass}
              unoptimized={unoptimized}
              sizes="(min-width: 640px) 50vw, 100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
