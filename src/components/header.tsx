import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

export async function Header() {
  const token = (await cookies()).get("auth-token")?.value;
  const payload = token ? verifyToken(token) : null;
  const isAdmin = payload?.role === "ADMIN";

  return (
    <header className="border-b border-gray-200 bg-white/60 backdrop-blur glass shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
          SaaS Boilerplate
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/docs" className="text-gray-600 hover:text-indigo-800 transition-colors">
            API Docs
          </Link>
          {payload ? (
            <>
              <Link href="/dashboard" className="hover:text-indigo-800 transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/profile" className="hover:text-indigo-800 transition-colors">
                Profile
              </Link>
              {isAdmin && (
                <Link href="/admin" className="hover:text-indigo-800 transition-colors">
                  Admin
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-indigo-600">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
