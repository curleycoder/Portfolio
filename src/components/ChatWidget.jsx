"use client";

import { useState } from "react";

export default function ChatWidget({
  biz = "default",
  chatUrlBase = "https://client-sand-kappa.vercel.app",
}) {
  const [open, setOpen] = useState(false);

  const src = `${chatUrlBase}/?biz=${encodeURIComponent(biz)}&embed=1`;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 9999,
          padding: "12px 14px",
          borderRadius: 999,
          border: "1px solid rgba(0,0,0,0.15)",
          background: "#111",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
        aria-label="Open chat"
      >
        Chat
      </button>

      {/* Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            padding: 18,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 380,
              height: 560,
              background: "#0b0b0b",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                borderBottom: "1px solid rgba(255,255,255,0.12)",
                background: "#111",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              <span>Assistant</span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "transparent",
                  color: "#fff",
                  border: "none",
                  fontSize: 18,
                  cursor: "pointer",
                  padding: 6,
                }}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            <iframe
              title="AI Chat"
              src={src}
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
