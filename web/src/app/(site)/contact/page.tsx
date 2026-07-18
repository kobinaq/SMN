import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Briefcase, Mail, MessageCircle, Mic2 } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Social Marketers Network for partnerships, speaking, talent, or general questions.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: Mail,
    label: "Email",
    title: site.email,
    href: `mailto:${site.email}`,
    external: false,
    body: "Partnerships, programme questions, and general enquiries.",
  },
  {
    icon: MessageCircle,
    label: "Community",
    title: "WhatsApp",
    href: site.whatsappInvite,
    external: true,
    body: "Join the Network chat for daily conversation and feedback.",
  },
  {
    icon: Briefcase,
    label: "Employers",
    title: "Hire SMN talent",
    href: "/employers",
    external: false,
    body: "Share a role or ask about marketers from the Network.",
  },
  {
    icon: Mic2,
    label: "Speaking",
    title: "Book a conversation",
    href: `mailto:${site.email}?subject=Speaking%20request`,
    external: false,
    body: "Workshops, panels, and guest sessions with SMN.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative min-h-[68svh] overflow-hidden border-b border-white/10 bg-near-black pt-[calc(5.5rem+env(safe-area-inset-top))] sm:min-h-[76svh] sm:pt-28">
        <div className="absolute inset-0">
          <Image
            src={img.aboutMission}
            alt=""
            fill
            priority
            className="object-cover object-[center_35%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-near-black via-near-black/90 to-near-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-near-black via-transparent to-near-black/45" />
        </div>

        <div className="container-wide relative z-10 flex min-h-[calc(68svh-5.5rem)] flex-col justify-end pb-14 sm:min-h-[calc(76svh-7rem)] sm:pb-20">
          <p className="font-display text-sm tracking-[0.08em] text-baby-blue sm:text-base">
            Social Marketers Network
          </p>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-[2.35rem] leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Let’s talk.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base md:text-lg">
            Partnerships, speaking, talent requests, or a quick question — send a message and we’ll
            get back to you.
          </p>
          <div className="btn-row-mobile mt-8">
            <Button href="#message">Send a message</Button>
            <Button href={site.whatsappInvite} target="_blank" rel="noreferrer" variant="secondary">
              {cta.whatsapp.communityLabel}
            </Button>
          </div>
        </div>
      </section>

      <section
        id="message"
        data-section-fade
        className="scroll-mt-24 border-b border-white/10 bg-ink py-16 sm:py-24"
      >
        <div className="container-wide grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 xl:gap-20">
          <aside>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-mint">Reach us</p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
              Pick a channel that fits.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">
              Prefer email for formal requests. WhatsApp for community. The form for anything else.
            </p>

            <ul className="mt-10 space-y-0 border-t border-white/10">
              {channels.map((item) => (
                <li key={item.label} className="border-b border-white/10">
                  <a
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group flex items-start gap-4 py-5 transition hover:bg-white/[.02]"
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-surface text-baby-blue">
                      <item.icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                        {item.label}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 font-display text-lg text-white transition group-hover:text-baby-blue">
                        {item.title}
                        <ArrowUpRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                      </span>
                      <span className="mt-1 block text-sm text-white/45">{item.body}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">
              Contact form
            </p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Send a message</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">
              Tell us what you need. We route partnership, speaking, and talent requests to the right
              inbox.
            </p>
            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-surface p-5 sm:rounded-[2rem] sm:p-8 md:p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
