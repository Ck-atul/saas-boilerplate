"use client";

import Link from "next/link";
import { useState } from "react";

export function LoginForm({
  showRegisteredMessage = false,
  showVerifiedMessage = false,
}: {
  showRegisteredMessage?: boolean;
  showVerifiedMessage?: boolean;
}) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        // Full navigation so the new auth cookie is sent on the next request
        window.location.assign("/dashboard");
        return;
      }
      if (data.needsVerification) {
        window.location.assign(
          `/verify-pending?email=${encodeURIComponent(form.email)}`
        );
        return;
      }
      setMsg(data.error ?? "Login failed");
    } catch {
      setMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <h1 className="mb-1 text-2xl font-bold">Log in</h1>
      <p className="mb-6 text-sm text-gray-600">
        No account?{" "}
        <Link href="/signup" className="text-indigo-600 hover:underline">
          Sign up
        </Link>
      </p>

      {showVerifiedMessage && (
        <p className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Your account is active. Sign in with your email and password.
        </p>
      )}

      {showRegisteredMessage && !showVerifiedMessage && (
        <p className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Account created. Please log in.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full rounded border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={form.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-indigo-600 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-3 text-center text-sm">
        <Link
          href="/forgot-password"
          className="text-indigo-600 hover:underline"
        >
          Forgot password?
        </Link>
      </p>

      {msg && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {msg}
        </p>
      )}
    </section>
  );
}
