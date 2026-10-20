import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="device-safe mx-auto grid min-h-dvh max-w-xl content-center gap-4 px-5 py-16">
      <p className="font-mono text-sm text-ink-3">404</p>
      <h1 className="page-title">Page not found.</h1>
      <p className="text-ink-2">Check the address, or head back to the home page.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={ROUTES.build} className="btn btn-primary">Build resume</Link>
        <Link href={ROUTES.home} className="btn btn-secondary">Back to home</Link>
      </div>
    </main>
  );
}
