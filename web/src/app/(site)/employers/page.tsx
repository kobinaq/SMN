import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Employers & Partners",
  description: "Hire talent, sponsor events, mentor members, and partner with SMN.",
};

const offers = [
  "Hire marketing talent and freelancers",
  "Source interns",
  "Partner on live client projects",
  "Sponsor events",
  "Deliver guest sessions",
  "Mentor members",
  "Submit marketing challenges and case studies",
];

export default function EmployersPage() {
  return (
    <>
      <PageHero
        eyebrow="Employers & partners"
        title="Discover skilled marketing talent and shape the next generation."
        description="Connect with trained marketers for hiring, internships, projects, mentoring, and events."
      />
      <section className="border-t border-white/10 bg-ink py-20">
        <div className="container-wide grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-white">Why partner with us</h2>
            <ul className="mt-6 space-y-3 text-white/70">
              {offers.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-white/45">
              We do not guarantee employment. We help people get ready for work and make it easier
              for brands to meet strong marketing talent.
            </p>
            <div className="mt-8">
              <Button href="/contact">General partnership enquiry</Button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-surface p-6 md:p-8">
            <h3 className="font-display text-2xl text-white">Submit a talent or partner request</h3>
            <div className="mt-6">
              <ContactForm defaultType="Talent request" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
