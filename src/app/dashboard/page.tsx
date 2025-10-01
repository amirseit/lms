import { currentUser } from "@clerk/nextjs/server";
import { ensureDbUser } from "@/lib/sync-user";

export default async function Dashboard() {
  const user = await currentUser();
  if (!user) return <div className="p-6">Not signed in</div>;

  await ensureDbUser();

  const email = user.emailAddresses[0]?.emailAddress ?? "unknown";

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p>Welcome, {email}</p>
    </div>
  );
}
