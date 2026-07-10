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
    <footer className="border-t border-white/10 bg-ink">
      <div className="container-wide py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/brand/logo-on-blue.png"
              alt={site.name}
              width={180}
              height={54}
              className="h-10 w-auto"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              {site.tagline}
            </p>
            <p className="mt-6 text-sm text-white/45">
              Community on Discord. Courses on Selar. Live sessions on Google Classroom.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                {group.title}
              </p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-white/70">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/70">
              Terms
            </Link>
            <a href={site.social.instagram} className="hover:text-white/70" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={site.social.linkedin} className="hover:text-white/70" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
