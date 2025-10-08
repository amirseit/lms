"use client";

import { useEffect } from "react";
import { toast } from "sonner"; // using Sonner directly for a quick toast

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // show a friendly toast
    toast.error("Something went wrong", {
      description: error.message || "Please try again.",
    });
    // You can also report to Sentry manually if you like:
    // import * as Sentry from "@sentry/nextjs";
    // Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="p-8">
        <h2 className="text-xl font-semibold mb-2">We hit a snag.</h2>
        <p className="text-sm text-muted-foreground">
          If this keeps happening, please let us know.
        </p>
        <button
          className="mt-4 border px-3 py-2 rounded"
          onClick={() => reset()}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
