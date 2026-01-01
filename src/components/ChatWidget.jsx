"use client";

import { useEffect, useMemo, useState } from "react";

function titleizeBiz(biz) {
  const s = String(biz || "")
    .replace(/[_-]+/g, " ")
    .trim();
  if (!s) return "Dew";
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ChatWidget({
  biz = "default",
  chatUrlBase = process.env.NEXT_PUBLIC_CHAT_URL_BASE,
  title,
  subtitle = "Quick answers • Booking help",
  avatarSrc,
}) {
  if (!chatUrlBase) {
    console.error("Missing NEXT_PUBLIC_CHAT_URL_BASE");
  }
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const iframeSrc = useMemo(() => {
    const base = chatUrlBase.replace(/\/+$/, "");
    return `${base}/?biz=${encodeURIComponent(biz)}&embed=1`;
  }, [chatUrlBase, biz]);

  const headerTitle = title || titleizeBiz(biz);

  return (
    <>
      {/* Panel */}
      <div
        className={[
          "fixed z-[999999] right-4 bottom-28 w-[380px] h-[560px]",
          "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)]",
          "rounded-2xl overflow-hidden border border-black/10",
          "bg-white/90 backdrop-blur-md shadow-2xl",
          "origin-bottom-right transition-all duration-150",
          open
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none",
          "sm:right-4",
          "max-[520px]:left-3 max-[520px]:right-3 max-[520px]:w-auto max-[520px]:h-[70vh]",
        ].join(" ")}
      >
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-black/5 bg-white">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-pink-200/70 grid place-items-center overflow-hidden">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={`${headerTitle} Assistant`}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <span className="text-[12px] font-bold text-black/80">D</span>
              )}
            </div>

            <div className="leading-tight">
              <div className="text-sm font-semibold text-black/90">
                {headerTitle}
              </div>
              <div className="text-[11px] text-black/50">{subtitle}</div>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="h-9 w-9 rounded-xl border border-black/10 bg-white/70 hover:bg-white transition grid place-items-center"
            aria-label="Close chat"
            title="Close"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>

        {/* Iframe */}
        <iframe
          title={`${headerTitle} Chat`}
          src={iframeSrc}
          className="w-full h-[calc(100%-3rem)] border-0"
        />
      </div>

      {/* Bubble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={[
            "fixed z-[999998] right-8 bottom-8 h-20 w-20 rounded-full",
            "grid place-items-center shadow-2xl",
            "bg-white ring-2 ring-[#eabec5]",
            "hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.22)]",
            "transition",
          ].join(" ")}
          aria-label="Open chat"
          title="Chat"
        >
          {avatarSrc ? (
            <img
              src={avatarSrc} // ✅ FIXED
              alt={`${headerTitle} Assistant`}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-black grid place-items-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
          )}
        </button>
      )}
    </>
  );
}
