import type { Metadata } from "next";
import { Header } from "@/src/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaS Boilerplate",
  description: "SaaS starter with auth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
