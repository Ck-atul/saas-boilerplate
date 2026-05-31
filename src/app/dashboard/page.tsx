import Link from "next/link";
import prisma from "@/lib/prisma";
import { getAuthPayload } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Users, Shield, Activity, Mail } from "lucide-react";

export default async function DashboardPage() {
  const payload = await getAuthPayload();
  if (!payload) return null;

  const [user, activityCount, recentLogs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        image: true,
        emailVerified: true,
        createdAt: true,
      },
    }),
    prisma.auditLog.count({ where: { userId: payload.userId } }),
    prisma.auditLog.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  if (!user) return null;

  const stats = [
    {
      label: "Account role",
      value: user.role,
      icon: Shield,
    },
    {
      label: "Activity events",
      value: String(activityCount),
      icon: Activity,
    },
    {
      label: "Email status",
      value: user.emailVerified ? "Verified" : "Pending",
      icon: Mail,
    },
    {
      label: "Member since",
      value: new Date(user.createdAt).toLocaleDateString(),
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name}
              className="h-16 w-16 rounded-full border object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
            <p className="text-gray-600">
              {user.email} · User ID #{user.id}
            </p>
          </div>
        </div>
        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
          {user.role}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-gray-500">Mobile:</span> {user.mobile}
            </p>
            <p>
              <span className="text-gray-500">Email verified:</span>{" "}
              {user.emailVerified ? "Yes" : "No"}
            </p>
            <Link
              href="/dashboard/profile"
              className="inline-block text-indigo-600 hover:underline"
            >
              Manage profile →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-gray-500">No activity yet.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {recentLogs.map((log) => (
                  <li
                    key={log.id}
                    className="flex justify-between gap-2 border-b border-gray-100 pb-2 last:border-0"
                  >
                    <span className="font-medium">{log.action}</span>
                    <span className="shrink-0 text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-end gap-2">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-indigo-500/80"
                style={{ height: `${h}%` }}
                title={`Day ${i + 1}`}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Placeholder activity chart — connect real metrics in production.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
