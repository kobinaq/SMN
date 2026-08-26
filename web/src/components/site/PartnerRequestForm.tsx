"use client";

import { useState } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Segmented } from "@/components/ui/Segmented";
import { Checklist } from "@/components/site/kit";

/**
 * One request form for partners.
 *
 * "Post a job" and "Request an intern" used to be separate pages carrying the
 * same form with a different `defaultType` and a different bullet list. They
 * are the same action with a different subject, so they are one form with a
 * switch — and the switch shows what each request needs, which the split pages
 * could only do by making you leave and come back.
 */
const REQUESTS = {
  talent: {
    label: "Hire talent",
    type: "Talent request",
    blurb: "Tell us what you need. This is an employer enquiry, not a member application.",
    needs: [
      "The kind of work and the level you are hiring for",
      "Full-time, contract, freelance, or project",
      "Location or remote preference",
      "How you would like to meet candidates",
    ],
  },
  intern: {
    label: "Request an intern",
    type: "Intern request",
    blurb:
      "We match motivated marketers from the Network, including Experience Programme participants where the fit is right. Placements are not guaranteed.",
    needs: [
      "Role focus, duration, and location or remote preference",
      "Must-have skills and the work they will actually do",
      "A named point of contact and a habit of giving feedback",
      "A defined scope — internships fail when the brief is “help with social”",
    ],
  },
  job: {
    label: "Post a job",
    type: "Job posting",
    blurb:
      "Share openings with marketers who train for strategy, campaigns, and proof of work. Staff review listings before they appear on the public careers board.",
    needs: [
      "Role title, company, and location or remote preference",
      "Employment type: full-time, contract, freelance, or project",
      "What success looks like in the first 30 to 90 days",
      "Application link or how you want candidates to respond",
    ],
  },
  training: {
    label: "Train a team",
    type: "Training request",
    blurb:
      "We design specialised training around your team, industry, and needs — from social and AI foundations to analytics and strategy workshops.",
    needs: [
      "Team size, roles, and current level",
      "The capability gap you are trying to close",
      "Preferred format and timeline",
      "Any industry specifics we should build around",
    ],
  },
} as const;

export type RequestKind = keyof typeof REQUESTS;

export function PartnerRequestForm({ initial = "talent" }: { initial?: RequestKind }) {
  const [kind, setKind] = useState<RequestKind>(initial);
  const request = REQUESTS[kind];

  return (
    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div>
        <h2 className="font-display display-3 text-text-1">What do you need?</h2>
        <Segmented
          className="mt-6"
          aria-label="Request type"
          value={kind}
          onChange={setKind}
          options={(Object.keys(REQUESTS) as RequestKind[]).map((value) => ({
            value,
            label: REQUESTS[value].label,
          }))}
        />
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-text-2">{request.blurb}</p>
        <p className="mt-6 eyebrow text-text-3">Helpful to include</p>
        <Checklist className="mt-3" items={request.needs} />
        <p className="mt-8 rule pt-6 text-sm text-text-3">
          We do not guarantee employment outcomes. We help members prepare for work and make it
          easier for brands to meet strong marketing talent.
        </p>
      </div>
      <div className="border border-edge-subtle bg-raised p-6 sm:p-8">
        <h3 className="font-display text-2xl text-text-1">{request.label}</h3>
        <p className="mt-2 text-sm text-text-2">
          We follow up if we need more detail before going further.
        </p>
        {/* Remounting on `kind` resets the form fields with the new default
            type — carrying a half-typed job posting into an intern request
            would only produce a confusing enquiry. */}
        <div className="mt-6">
          <ContactForm key={kind} defaultType={request.type} />
        </div>
      </div>
    </div>
  );
}
