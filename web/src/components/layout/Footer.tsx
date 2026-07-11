import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

const footerLinks = [
  {
    title: "Learn",
    links: [
      { label: "Programs", href: "/programs" },
      { label: "Flagship Cohort", href: "/programs/cohort" },
      { label: "Self-Paced Courses", href: "/programs/courses" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    title: "Network",
    links: [
      { label: "Community", href: "/community" },
      { label: "Mentorship", href: "/mentorship" },
      { label: "Events", href: "/events" },
      { label: "Success Stories", href: "/stories" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Employers", href: "/employers" },
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink pb-[env(safe-area-inset-bottom)]">
      <div className="container-wide py-12 sm:py-16 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-12">
          <div className="sm:col-span-2 md:col-span-1">
            <Image
              src="/images/Logos/Logo on white.png"
              alt={site.name}
              width={314}
              height={161}
              className="h-8 w-auto sm:h-9"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60 sm:mt-5">
              {site.tagline}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-white/45 sm:mt-6 sm:text-sm">
              Community on WhatsApp. Courses on Selar. Live sessions on Google Classroom.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 sm:text-xs">
                {group.title}
              </p>
              <ul className="mt-3 space-y-1 sm:mt-4 sm:space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-10 items-center text-sm text-white/70 transition hover:text-white sm:min-h-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:mt-14 sm:pt-8 sm:text-sm md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-white/70">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/70">
              Terms
            </Link>
            <a
              href={site.social.instagram}
              className="hover:text-white/70"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              href={site.social.linkedin}
              className="hover:text-white/70"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
