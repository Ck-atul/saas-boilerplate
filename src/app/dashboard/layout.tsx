import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (!user.emailVerified) {
    redirect("/verify-pending");
  }

  return (
    <div>
      <nav className="mb-8 flex gap-4 border-b border-gray-200 pb-4 text-sm">
        <Link href="/dashboard" className="font-medium hover:text-indigo-600">
          Overview
        </Link>
        <Link
          href="/dashboard/profile"
          className="font-medium hover:text-indigo-600"
        >
          Profile
        </Link>
      </nav>
      {children}
    </div>
  );
}
