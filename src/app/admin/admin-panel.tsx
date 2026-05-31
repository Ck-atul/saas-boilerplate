"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
};

type Stats = {
  totalUsers: number;
  verifiedUsers: number;
  adminUsers: number;
  recentSignups: number;
};

export function AdminPanel() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const [statsRes, usersRes] = await Promise.all([
      fetch("/api/admin/stats"),
      fetch("/api/admin/users"),
    ]);
    if (statsRes.ok) setStats(await statsRes.json());
    if (usersRes.ok) {
      const data = await usersRes.json();
      setUsers(data.users);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function changeRole(id: number, role: string) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setMessage(res.ok ? "Role updated." : "Failed to update role.");
    load();
  }

  async function deleteUser(id: number, name: string) {
    if (!confirm(`Delete user ${name}?`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setMessage(res.ok ? "User deleted." : "Failed to delete user.");
    load();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin dashboard</h1>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total users", stats.totalUsers],
            ["Verified", stats.verifiedUsers],
            ["Admins", stats.adminUsers],
            ["Signups (7d)", stats.recentSignups],
          ].map(([label, value]) => (
            <Card key={label as string}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {message && (
        <p className="rounded border border-gray-200 bg-gray-50 p-3 text-sm">
          {message}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Verified</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4 text-gray-500">#{user.id}</td>
                  <td className="py-3 pr-4 font-medium">{user.name}</td>
                  <td className="py-3 pr-4">{user.email}</td>
                  <td className="py-3 pr-4">
                    <Badge
                      variant={user.role === "ADMIN" ? "default" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4">
                    {user.emailVerified ? "Yes" : "No"}
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      {user.role === "USER" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => changeRole(user.id, "ADMIN")}
                        >
                          Make admin
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => changeRole(user.id, "USER")}
                        >
                          Make user
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteUser(user.id, user.name)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
