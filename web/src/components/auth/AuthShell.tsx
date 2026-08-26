import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-canvas">
      <header className="border-b border-edge-subtle px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo width={120} height={32} className="h-7" />
          </Link>
          <Link href="/" className="text-xs text-text-3 transition hover:text-text-1">
            Back to site
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          <h1 className="font-display display-3 text-text-1">{title}</h1>
          {subtitle ? (
            <p className="mt-2 text-sm leading-relaxed text-text-2">{subtitle}</p>
          ) : null}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
