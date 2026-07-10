"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import AuthListener from "@/components/auth/AuthListener";
import SearchModal from "@/components/search/SearchModal";
import { NotificationsProvider } from "@/features/notifications/context/NotificationsContext";

export function NextProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        disableTransitionOnChange
      >
        <AuthListener />
        <SearchModal />
        <NotificationsProvider>
          {children}
        </NotificationsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
