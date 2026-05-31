"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

export function ProfileForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setName(data.name);
        setMobile(data.mobile);
        setEmail(data.email);
        setImage(data.image);
        setLoading(false);
      });
  }, [router]);

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("/api/user/avatar", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setImage(data.image);
      setMessage("Avatar updated.");
      router.refresh();
    } else {
      setMessage(data.error ?? "Upload failed.");
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const body: { name: string; mobile: string; password?: string } = {
      name,
      mobile,
    };
    if (password) body.password = password;

    const res = await fetch("/api/user/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Profile updated successfully.");
      setPassword("");
      router.refresh();
    } else {
      setMessage(data.error ?? "Update failed.");
    }
    setSaving(false);
  }

  if (loading) {
    return <p className="text-gray-600">Loading profile…</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt="Avatar"
              className="h-20 w-20 rounded-full border object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-400">
              ?
            </div>
          )}
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleAvatar}
              disabled={uploading}
            />
            <p className="mt-1 text-xs text-gray-500">PNG/JPG, max 2MB</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input value={email} disabled />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Mobile</label>
              <Input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                New password
              </label>
              <Input
                type="password"
                placeholder="Leave blank to keep current"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {message && (
        <p
          className={`rounded border p-3 text-sm ${
            message.toLowerCase().includes("success") ||
            message.toLowerCase().includes("updated")
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-gray-200 bg-gray-50 text-gray-800"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
