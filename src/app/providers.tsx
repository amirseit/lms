"use client";

import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  // one client for the whole app
  const [qc] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={qc}>
      {children}
      <Toaster richColors />
    </QueryClientProvider>
  );
}
