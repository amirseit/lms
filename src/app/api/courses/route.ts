import { NextResponse } from "next/server";
import { z } from "zod";

// server-side schema (authoritative)
const CourseCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 chars"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Use lowercase, numbers and dashes"),
  summary: z.string().min(10, "Summary must be at least 10 chars"),
});

export async function POST(req: Request) {
  const json = await req.json();

  const parsed = CourseCreateSchema.safeParse(json);
  if (!parsed.success) {
    // return all issues
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // For the sprint detour we’ll “mock” creation.
  // (Later you’ll swap this for Prisma: prisma.course.create({...}))
  const id = crypto.randomUUID();

  return NextResponse.json({
    ok: true,
    course: { id, ...data },
  });
}
