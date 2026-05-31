import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";

const endpoints = [
  {
    method: "POST",
    path: "/api/auth/signup",
    body: "{ name, email, mobile, password }",
    desc: "Register user and send verification email.",
  },
  {
    method: "POST",
    path: "/api/auth/login",
    body: "{ email, password }",
    desc: "Login (requires verified email). Sets auth cookie.",
  },
  {
    method: "POST",
    path: "/api/auth/logout",
    body: "—",
    desc: "Clear session cookie.",
  },
  {
    method: "GET",
    path: "/api/auth/verify?token=",
    body: "—",
    desc: "Verify email from link.",
  },
  {
    method: "POST",
    path: "/api/auth/forgot-password",
    body: "{ email }",
    desc: "Send password reset email.",
  },
  {
    method: "POST",
    path: "/api/auth/reset-password",
    body: "{ token, password }",
    desc: "Set new password from reset link.",
  },
  {
    method: "GET",
    path: "/api/user/me",
    body: "Cookie: auth-token",
    desc: "Current user profile.",
  },
  {
    method: "PATCH",
    path: "/api/user/me",
    body: "{ name?, mobile?, password? }",
    desc: "Update profile / password.",
  },
  {
    method: "POST",
    path: "/api/user/avatar",
    body: "multipart: avatar",
    desc: "Upload profile image.",
  },
  {
    method: "GET",
    path: "/api/users",
    body: "Admin cookie",
    desc: "List all users (admin only).",
  },
  {
    method: "GET",
    path: "/api/audit-logs",
    body: "Cookie: auth-token",
    desc: "Audit trail (own logs; admin sees all).",
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">API documentation</h1>
        <p className="mt-2 text-gray-600">
          REST endpoints for the SaaS boilerplate.{" "}
          <Link href="/" className="text-indigo-600 hover:underline">
            Back home
          </Link>
        </p>
      </div>

      <div className="space-y-4">
        {endpoints.map((ep) => (
          <Card key={`${ep.method}-${ep.path}`}>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <Badge
                variant={
                  ep.method === "GET"
                    ? "secondary"
                    : ep.method === "DELETE"
                      ? "destructive"
                      : "default"
                }
              >
                {ep.method}
              </Badge>
              <CardTitle className="font-mono text-base">{ep.path}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>{ep.desc}</p>
              <pre className="overflow-x-auto rounded bg-gray-100 p-3 text-xs">
                {ep.body}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
