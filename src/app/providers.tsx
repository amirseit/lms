"use client";

import { Toaster } from "@/components/ui/sonner";  // 👈 from ui/sonner
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors />   {/* ready to go */}
    </>
  );
}
