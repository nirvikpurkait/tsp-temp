import type { Metadata } from "next";
import "@/styles/globals.css";
import { cn } from "@/utils/cn";

export const metadata: Metadata = {
  title: "Next.js Project Template",
  description:
    "A template for Next.js project to get started with perfect folder structure, along with testing frameworks (i.e: `Vitest` and `Playwright`), UI design system (i.e: `Storybook`), some utility functions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={cn(`flex min-h-svh flex-col`)}>{children}</body>
    </html>
  );
}
