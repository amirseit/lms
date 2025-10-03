"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

function Ping() {
  const { data, isLoading } = useQuery({
    queryKey: ["ping"],
    queryFn: () => fetch("/api/ping").then((r) => r.json()),
  });

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading ping…</div>;
  return <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(data, null, 2)}</pre>;
}

export default function Home() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">LMS MVP</h1>

      <SignedOut>
        <div className="flex gap-3">
          <SignInButton mode="modal"><Button>Sign in</Button></SignInButton>
          <SignUpButton mode="modal"><Button variant="outline">Sign up</Button></SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <Button onClick={() => toast.success("Signed in!", { description: "Welcome back 👋" })}>
            Test toast
          </Button>
        </div>
        <Ping />
      </SignedIn>
    </main>
  );
}
