"use client";

import Script from "next/script";

export default function GitHubCalendar() {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">GitHub Activity</h2>

      <Script
        src="https://unpkg.com/github-calendar@latest/dist/github-calendar.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== "undefined" && window.GitHubCalendar) {
            window.GitHubCalendar(".calendar", "curleycoder", {
              responsive: true,
            });
          }
        }}
      />

      <link
        rel="stylesheet"
        href="https://unpkg.com/github-calendar@latest/dist/github-calendar-responsive.css"
      />

      <div className="calendar border rounded-lg p-4">
        Loading your GitHub activity…
      </div>
    </div>
  );
}
