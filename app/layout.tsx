import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "GCSE Mathematics Dashboard",
  description:
    "Monitor GCSE mathematics student performance, mastery, and assessments in real time.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
