"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

const POLL_MS = 3000;
const STORAGE_KEY = "email-verified-signal";

function goToLogin() {
  sessionStorage.removeItem("pendingVerifyEmail");
  window.location.assign("/login?verified=1");
}

function VerifyPendingContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const fromUrl = searchParams.get("email");
    const stored = sessionStorage.getItem("pendingVerifyEmail");
    const initial = fromUrl ?? stored ?? "";
    if (initial) setEmail(decodeURIComponent(initial));
  }, [searchParams]);

  const checkVerified = useCallback(async () => {
    if (!email) return false;

    setChecking(true);
    try {
      const res = await fetch(
        `/api/auth/verification-status?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (data.verified) {
        goToLogin();
        return true;
      }
    } finally {
      setChecking(false);
    }
    return false;
  }, [email]);

  useEffect(() => {
    if (!email) return;

    sessionStorage.setItem("pendingVerifyEmail", email);

    checkVerified();

    const interval = setInterval(checkVerified, POLL_MS);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue === "1") {
        goToLogin();
      }
    };

    const onFocus = () => {
      checkVerified();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        checkVerified();
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [email, checkVerified]);

  async function resend(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMessage(data.message ?? data.error);
    sessionStorage.setItem("pendingVerifyEmail", email);
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Activate your account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          We&apos;ve sent an <strong>activation link</strong> to your email.
          Open it to activate your account — then you can sign in. This page
          will redirect you automatically once activated.
        </p>
        {checking && (
          <p className="text-xs text-indigo-600">Checking verification status…</p>
        )}
        <form onSubmit={resend} className="space-y-3">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Resend verification email
          </Button>
        </form>
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </CardContent>
    </Card>
  );
}

export default function VerifyPendingPage() {
  return (
    <Suspense fallback={<p className="text-gray-600">Loading…</p>}>
      <VerifyPendingContent />
    </Suspense>
  );
}
