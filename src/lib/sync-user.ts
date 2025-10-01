// src/lib/sync-user.ts
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function ensureDbUser() {
  const u = await currentUser();
  if (!u) return null;

  return prisma.user.upsert({
    where: { clerkId: u.id },
    create: { clerkId: u.id, email: u.emailAddresses[0]?.emailAddress ?? "" },
    update: { email: u.emailAddresses[0]?.emailAddress ?? "" },
  });
}
