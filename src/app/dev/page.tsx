"use client";

import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
// import * as Sentry from "@sentry/nextjs";

// client-side schema (keep in sync with server)
const CourseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 chars"),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes"),
  summary: z.string().min(10, "Summary must be at least 10 chars"),
});

type CoursePayload = z.infer<typeof CourseFormSchema>;

export default function DevPage() {
  const [form, setForm] = useState<CoursePayload>({
    title: "",
    slug: "",
    summary: "",
  });

  const mutation = useMutation({
    mutationFn: async (payload: CoursePayload) => {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw data; // bubble server errors
      return data as { ok: true; course: { id: string } & CoursePayload };
    },
    onSuccess: (data) => {
      toast.success("Course created", { description: `id: ${data.course.id}` });
      setForm({ title: "", slug: "", summary: "" });
    },
    onError: (err: any) => {
      const msg = err?.errors
        ? Object.entries(err.errors)
          .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
          .join(" | ")
        : "Unknown error";
      toast.error("Create failed", { description: msg });
    },
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = CourseFormSchema.safeParse(form);
    if (!parsed.success) {
      const msg = Object.values(parsed.error.flatten().fieldErrors)
        .flat()
        .join(" | ");
      toast.error("Fix form errors", { description: msg });
      return;
    }
    mutation.mutate(parsed.data);
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dev tools</h1>

      <form onSubmit={submit} className="space-y-3 max-w-xl">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Data Center Fundamentals"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Slug</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="data-center-fundamentals"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Summary</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={3}
            value={form.summary}
            onChange={(e) =>
              setForm((f) => ({ ...f, summary: e.target.value }))
            }
            placeholder="What learners will get from this course…"
          />
        </div>

        <button
          type="submit"
          className="border rounded px-4 py-2"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating…" : "Create course"}
        </button>

        {/* <button
          onClick={() => {
            Sentry.captureException(new Error("Manual test from client"));
          }}
        >
          Throw manual error
        </button> */}
      </form>
    </main>
  );
}
