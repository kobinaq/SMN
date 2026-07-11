import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

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
    <div className="flex min-h-svh flex-col bg-near-black">
      <header className="border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/Logos/Logo on white.png"
              alt={site.name}
              width={120}
              height={32}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <Link href="/" className="text-xs text-white/45 transition hover:text-white">
            Back to site
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          <h1 className="font-display text-2xl text-white sm:text-3xl">{title}</h1>
          {subtitle ? (
            <p className="mt-2 text-sm leading-relaxed text-white/55">{subtitle}</p>
          ) : null}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
