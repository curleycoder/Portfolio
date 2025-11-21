"use client";

import Script from "next/script";
import { useEffect } from "react";

export default function GitHubCalendar() {
  useEffect(() => {
    if (window.GitHubCalendar) {
      window.GitHubCalendar(".calendar", "curleycoder"); // your GitHub username
    }
  }, []);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">GitHub Activity</h2>

      <Script src="https://unpkg.com/github-calendar@latest/dist/github-calendar.min.js" />
      <link
        rel="stylesheet"
        href="https://unpkg.com/github-calendar@latest/dist/github-calendar-responsive.css"
      />

      <div className="calendar border rounded-lg p-4"></div>
    </div>
  );
}
