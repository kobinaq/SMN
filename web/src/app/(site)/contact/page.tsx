import type { Metadata } from "next";
import { ArrowUpRight, Briefcase, Mail, MessageCircle, Mic2 } from "@/components/ui/icons";
import { ContactForm } from "@/components/forms/ContactForm";
import { Masthead } from "@/components/site/kit";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";
import { getSiteSettings } from "@/lib/cms";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Social Marketers Network for partnerships, speaking, talent, or general questions.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const site = await getSiteSettings();
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
      label: "Partners",
      title: "Partner with us",
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
  return (
    <>
      <Masthead
        image={img.contactTalk}
        alt="Two people talking in the SMN space"
        kicker="Social Marketers Network"
        title="Let’s talk."
        lede="Partnerships, speaking, talent requests, or a quick question. Send a message and we will get back to you."
        actions={
          <>
            <Button href="#message">Send a message</Button>
            <Button href={site.whatsappInvite} target="_blank" rel="noreferrer" variant="secondary">
              {cta.whatsapp.communityLabel}
            </Button>
          </>
        }
      />

      <section
        id="message"
        data-section-fade
        className="scroll-mt-24 border-b border-edge-subtle bg-raised py-16 sm:py-24"
      >
        <div className="container-wide grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 xl:gap-20">
          <aside>
            <p className="eyebrow text-ai">Reach us</p>
            <h2 className="mt-3 font-display display-3 text-text-1">
              Pick a channel that fits.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-text-2">
              Prefer email for formal requests. WhatsApp for community. The form for anything else.
            </p>

            <ul className="mt-10 space-y-0 border-t border-edge-subtle">
              {channels.map((item) => (
                <li key={item.label} className="border-b border-edge-subtle">
                  <a
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group flex items-start gap-4 py-5 transition hover:bg-off-white/[.02]"
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-edge-subtle bg-raised text-accent">
                      <item.icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block eyebrow text-text-3">
                        {item.label}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 font-display text-lg text-text-1 transition group-hover:text-accent">
                        {item.title}
                        <ArrowUpRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                      </span>
                      <span className="mt-1 block text-sm text-text-3">{item.body}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div>
            <h2 className="font-display display-3 text-text-1">Send a message</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-2">
              Tell us what you need. We route partnership, speaking, and talent requests to the right
              inbox.
            </p>
            <div className="mt-8 border border-edge-subtle bg-raised p-5 sm:p-8 md:p-10">
              <ContactForm defaultType={type} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
