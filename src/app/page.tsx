import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function HomePage() {
  const token = (await cookies()).get("auth-token")?.value;
  const payload = token ? verifyToken(token) : null;

  if (payload) {
    return (
      <section className="text-center">
        <h1 className="mb-2 text-3xl font-bold">Welcome back</h1>
        <p className="mb-8 text-gray-600">
          You are signed in as <strong>{payload.role}</strong>.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
        >
          Go to dashboard
        </Link>
      </section>
    );
  }

  return (
    <section className="text-center">
      <h1 className="mb-2 text-3xl font-bold">SaaS Boilerplate</h1>
      <p className="mb-8 text-gray-600">Auth-ready starter app</p>

      <nav className="mx-auto flex max-w-xs flex-col gap-3">
        <Link
          href="/login"
          className="block rounded bg-indigo-600 py-2 text-white hover:bg-indigo-700"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="block rounded border border-indigo-600 py-2 text-indigo-600 hover:bg-indigo-50"
        >
          Sign up
        </Link>
      </nav>
    </section>
  );
}
