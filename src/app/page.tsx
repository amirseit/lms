"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">LMS MVP</h1>
      <Button
        onClick={() =>
          toast.success("Hello! 🎉", {
            description: "Your shadcn+Sonner toaster is working.",
          })
        }
      >
        Show toast
      </Button>
    </main>
  );
}
