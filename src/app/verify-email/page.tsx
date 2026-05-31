"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

const STORAGE_KEY = "email-verified-signal";

function VerifyContent() {
  const token = useSearchParams().get("token");
  const [message, setMessage] = useState("Activating your account…");

  useEffect(() => {
    if (!token) {
      setMessage("Missing verification token.");
      return;
    }

    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage(
            "Account activated! Check your inbox for a welcome email. Opening sign in…"
          );
          sessionStorage.setItem("pendingVerifyEmail", data.email ?? "");
          localStorage.setItem(STORAGE_KEY, "1");
          localStorage.removeItem(STORAGE_KEY);
          setTimeout(() => {
            window.location.assign("/login?verified=1");
          }, 1500);
        } else {
          setMessage(data.error ?? "Verification failed.");
        }
      })
      .catch(() => setMessage("Verification failed."));
  }, [token]);

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Account activation</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{message}</p>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <VerifyContent />
    </Suspense>
  );
}
