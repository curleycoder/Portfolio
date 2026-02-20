"use client";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider>{children}</UserProvider>
    </ThemeProvider>
  );
}
