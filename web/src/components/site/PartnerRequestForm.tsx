"use client";

import { useState } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { JobPostingForm } from "@/components/site/JobPostingForm";
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
      "Share openings with marketers who train for strategy, campaigns, and proof of work. Staff review every listing before it appears on the public careers board.",
    needs: [
      "What the role actually involves day to day",
      "What success looks like in the first 30 to 90 days",
      "Who it is a fit for — skills, level, and mindset",
      "Anything that makes it worth a strong marketer's time",
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

/** Public partner form: hire / job / intern entry points are retired (T3). */
const PUBLIC_REQUEST_KINDS = ["training"] as const satisfies readonly RequestKind[];

function publicInitial(initial: RequestKind): RequestKind {
  return (PUBLIC_REQUEST_KINDS as readonly string[]).includes(initial) ? initial : "training";
}

export function PartnerRequestForm({ initial = "training" }: { initial?: RequestKind }) {
  const [kind, setKind] = useState<RequestKind>(() => publicInitial(initial));
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
          options={PUBLIC_REQUEST_KINDS.map((value) => ({
            value,
            label: REQUESTS[value].label,
          }))}
        />
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-text-2">{request.blurb}</p>
        <p className="mt-6 eyebrow text-text-3">Helpful to include</p>
        <Checklist className="mt-3" items={request.needs} />
        <p className="mt-8 rule pt-6 text-sm text-text-3">
          Tell us about training, sponsorship, or collaboration. We follow up if we need more detail.
        </p>
      </div>
      <div className="border border-edge-subtle bg-raised p-6 sm:p-8">
        <h3 className="font-display text-2xl text-text-1">{request.label}</h3>
        <p className="mt-2 text-sm text-text-2">
          We follow up if we need more detail before going further.
        </p>
        {/* Remounting on `kind` resets the form fields. Job posting intake stays
            in the codebase for later tickets; it is not offered on the public
            partner form. */}
        <div className="mt-6">
          {kind === "job" ? (
            <JobPostingForm key={kind} />
          ) : (
            <ContactForm key={kind} defaultType={request.type} />
          )}
        </div>
      </div>
    </div>
  );
}
