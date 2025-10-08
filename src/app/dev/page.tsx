"use client";

import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

// client-side schema (keep in sync with server)
const CourseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 chars"),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes"),
  summary: z.string().min(10, "Summary must be at least 10 chars"),
});

// ✅ new: response schema (no any)
const CourseResponseSchema = z.object({
  ok: z.literal(true),
  course: CourseFormSchema.extend({ id: z.string() }),
});

type CoursePayload = z.infer<typeof CourseFormSchema>;
type CourseResponse = z.infer<typeof CourseResponseSchema>;
type ServerError = { ok?: false; errors?: Record<string, string[] | string>; error?: string };

export default function DevPage() {
  const [form, setForm] = useState<CoursePayload>({
    title: "",
    slug: "",
    summary: "",
  });

  const mutation = useMutation({
    mutationFn: async (payload: CoursePayload): Promise<CourseResponse> => {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: unknown = await res.json();

      if (!res.ok) {
        // bubble server error; onError will narrow it
        throw data;
      }

      // ✅ replace the any-casts with Zod validation
      const parsed = CourseResponseSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error("Unexpected response shape");
      }
      return parsed.data;
    },

    onSuccess: (data) => {
      toast.success("Course created", { description: `id: ${data.course.id}` });
      setForm({ title: "", slug: "", summary: "" });
    },

    onError: (err: unknown) => {
      let msg = "Unknown error";

      if (err instanceof Error) {
        msg = err.message;
      } else if (err && typeof err === "object") {
        const maybe = err as ServerError;
        if (maybe.errors) {
          msg = Object.entries(maybe.errors)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
            .join(" | ");
        } else if (typeof maybe.error === "string") {
          msg = maybe.error;
        }
      }

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
            onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
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
      </form>
    </main>
  );
}
