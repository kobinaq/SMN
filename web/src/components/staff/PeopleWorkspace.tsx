"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MemberNoteForm } from "@/components/payload/MemberNoteForm";
import { MemberPicker } from "@/components/staff/MemberPicker";
import { StaffEmpty, StaffFilterChips, StaffMetricGrid, StaffPageHeader, StaffPanel, StaffSection, staffOpsChrome } from "@/components/staff/ui";
import { Button } from "@/components/ui/Button";

type SectionId = "timeline" | "learning" | "credentials" | "mentorship" | "jobs" | "notes";

export function PeopleWorkspace({
  member,
  pickerMembers,
  metrics,
  enrollments,
  certificates,
  portfolios,
  mentorProfilesCount,
  mentorship,
  applications,
  notes,
  activity,
}: {
  member: {
    id: string | number;
    name: string;
    email: string;
    headline?: string | null;
    location?: string | null;
    cohortStatus?: string | null;
    handle?: string | null;
    skills?: Array<{ skill?: string | null } | null> | null;
    careerGoals?: string | null;
  };
  pickerMembers: Array<{ id: string | number; label: string; email?: string | null; handle?: string | null }>;
  metrics: Array<{ label: string; value: string | number }>;
  enrollments: Array<{ id: string | number; programName: string; status: string; completionPercent?: number | null; programKey?: string | null }>;
  certificates: Array<{ id: string | number; title: string; status: string }>;
  portfolios: Array<{ id: string | number; title: string; status: string; visibility: string }>;
  mentorProfilesCount: number;
  mentorship: Array<{ id: string | number; topic: string; status: string }>;
  applications: Array<{ id: string | number; title: string; status: string }>;
  notes: Array<{ id: string | number; category: string; note: string; author: string; createdAt: string }>;
  activity: Array<{ label: string; state: string; at: string; href: string }>;
}) {
  const [section, setSection] = useState<SectionId>("timeline");
  const readableDate = (value: string) =>
    value ? new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(new Date(value)) : "—";

  const filters = useMemo(
    () => [
      { id: "timeline", label: "Timeline" },
      { id: "learning", label: "Learning", count: enrollments.length },
      { id: "credentials", label: "Credentials", count: certificates.length + portfolios.length },
      { id: "mentorship", label: "Mentorship", count: mentorship.length },
      { id: "jobs", label: "Jobs", count: applications.length },
      { id: "notes", label: "Notes", count: notes.length },
    ],
    [enrollments.length, certificates.length, portfolios.length, mentorship.length, applications.length, notes.length],
  );

  return (
    <div className={`space-y-6 ${staffOpsChrome}`}>
      <StaffPageHeader eyebrow="Work" title="People" hint="One person, full context." />

      <StaffPanel>
        <MemberPicker activeId={member.id} members={pickerMembers} />
      </StaffPanel>

      <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
        <StaffPanel>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl text-white">{member.name}</h2>
                {member.cohortStatus ? (
                  <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/50">
                    {member.cohortStatus}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-white/55">{member.headline || member.email}</p>
              <p className="mt-2 text-xs text-white/40">
                {member.location || "Location not set"}
                {member.handle ? ` · @${member.handle}` : ""}
              </p>
            </div>
            {member.handle ? (
              <Link href={`/u/${member.handle}`} className="text-sm text-baby-blue hover:underline">
                Public profile
              </Link>
            ) : null}
          </div>
          <div className="mt-6">
            <StaffMetricGrid items={metrics} />
          </div>
        </StaffPanel>

        <StaffPanel className="h-fit">
          <StaffSection title="Actions" />
          <div className="flex flex-col gap-2">
            <Button type="button" variant="secondary" onClick={() => setSection("notes")}>
              Add note
            </Button>
            <Button href={`/staff/learning?tab=learners&member=${member.id}`} variant="secondary">
              Open learning
            </Button>
            <Button href="/staff/mentorship" variant="secondary">
              Mentorship
            </Button>
            <Button href="/staff/certificates" variant="secondary">
              Certificates
            </Button>
          </div>
        </StaffPanel>
      </div>

      <StaffFilterChips
        options={filters}
        value={section}
        onChange={(id) => setSection(id as SectionId)}
      />

      {section === "timeline" ? (
        <StaffPanel>
          <StaffSection title="Recent activity" />
          {activity.length ? (
            <div className="space-y-1">
              {activity.map((item) => (
                <Link
                  key={`${item.href}-${item.at}-${item.label}`}
                  href={item.href}
                  className="flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition hover:bg-white/[.03]"
                >
                  <span>
                    <b className="block text-sm text-white">{item.label}</b>
                    <small className="text-xs text-white/40">{item.state}</small>
                  </span>
                  <time className="text-xs text-white/35">{readableDate(item.at)}</time>
                </Link>
              ))}
            </div>
          ) : (
            <StaffEmpty>No recent activity.</StaffEmpty>
          )}
        </StaffPanel>
      ) : null}

      {section === "learning" ? (
        <StaffPanel>
          <StaffSection title="Learning" />
          {enrollments.length ? (
            <div className="space-y-1">
              {enrollments.map((item) => (
                <Link
                  key={item.id}
                  href={`/staff/learning?tab=learners&member=${member.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[.03]"
                >
                  <b className="text-sm text-white">{item.programName}</b>
                  <span className="text-xs text-white/45">
                    {item.status} · {item.completionPercent ?? 0}%
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <StaffEmpty>No enrollments.</StaffEmpty>
          )}
        </StaffPanel>
      ) : null}

      {section === "credentials" ? (
        <StaffPanel>
          <StaffSection title="Credentials & portfolio" />
          {certificates.length || portfolios.length ? (
            <div className="space-y-1">
              {certificates.map((item) => (
                <Link
                  key={item.id}
                  href="/staff/certificates"
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[.03]"
                >
                  <b className="text-sm text-white">{item.title}</b>
                  <span className="text-xs text-white/45">{item.status}</span>
                </Link>
              ))}
              {portfolios.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl px-3 py-3">
                  <b className="text-sm text-white">{item.title}</b>
                  <span className="text-xs text-white/45">
                    {item.status} · {item.visibility}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <StaffEmpty>No credentials or portfolio items.</StaffEmpty>
          )}
        </StaffPanel>
      ) : null}

      {section === "mentorship" ? (
        <StaffPanel>
          <StaffSection title="Mentorship" />
          <p className="mb-3 text-sm text-white/55">
            {mentorProfilesCount ? "Mentor profile on file." : "No mentor profile."}
          </p>
          {mentorship.length ? (
            <div className="space-y-1">
              {mentorship.map((item) => (
                <Link
                  key={item.id}
                  href="/staff/mentorship"
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[.03]"
                >
                  <b className="text-sm text-white">{item.topic}</b>
                  <span className="text-xs text-white/45">{item.status}</span>
                </Link>
              ))}
            </div>
          ) : (
            <StaffEmpty>No mentorship requests.</StaffEmpty>
          )}
        </StaffPanel>
      ) : null}

      {section === "jobs" ? (
        <StaffPanel>
          <StaffSection title="Job activity" />
          {applications.length ? (
            <div className="space-y-1">
              {applications.map((item) => (
                <Link
                  key={item.id}
                  href="/staff/opportunities"
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[.03]"
                >
                  <b className="text-sm text-white">{item.title}</b>
                  <span className="text-xs text-white/45">{item.status}</span>
                </Link>
              ))}
            </div>
          ) : (
            <StaffEmpty>No applications.</StaffEmpty>
          )}
        </StaffPanel>
      ) : null}

      {section === "notes" ? (
        <StaffPanel>
          <StaffSection title="Private notes" />
          <MemberNoteForm memberId={member.id} />
          <div className="mt-4 space-y-3">
            {notes.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-near-black/30 p-3">
                <b className="text-xs uppercase tracking-wider text-baby-blue">{item.category}</b>
                <p className="mt-2 text-sm text-white/75">{item.note}</p>
                <small className="mt-2 block text-xs text-white/35">
                  {item.author} · {readableDate(item.createdAt)}
                </small>
              </div>
            ))}
            {!notes.length ? <StaffEmpty>No private notes yet.</StaffEmpty> : null}
          </div>
        </StaffPanel>
      ) : null}
    </div>
  );
}
