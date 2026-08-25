import { CalendarDays, CheckCircle2, Circle, Clock, Download, ExternalLink, ScrollText, Users, Video } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { CohortDiscussion } from "@/components/app/CohortDiscussion";
import type { CohortWorkspace as CohortWorkspaceData } from "@/lib/lms";

function formatDateTime(value: string) {
  if (!value) return "Date to be confirmed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be confirmed";
  return date.toLocaleString("en-GH", { dateStyle: "medium", timeStyle: "short" });
}

function attendanceChip(session: CohortWorkspaceData["sessions"][number]) {
  if (session.attended) return { label: session.attendance === "excused" ? "Excused" : "Attended", tone: "text-mint border-mint/30 bg-mint/10" };
  if (session.attendance === "absent") return { label: "Missed", tone: "text-red-300 border-red-300/30 bg-red-300/10" };
  if (session.isPast) return { label: "Not recorded", tone: "text-white/45 border-white/15" };
  return { label: "Upcoming", tone: "text-baby-blue border-baby-blue/30 bg-baby-blue/10" };
}

export function CohortWorkspace({ workspace }: { workspace: CohortWorkspaceData }) {
  const { course, sessions, nextSession, announcements, roster, discussion } = workspace;

  return (
    <div className="space-y-7">
      {nextSession ? (
        <section className="rounded-2xl border border-baby-blue/25 bg-gradient-to-br from-baby-blue/12 to-surface p-5 sm:p-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-baby-blue">Next live session</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-xl text-white">{nextSession.title}</h2>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/60">
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-baby-blue" />{formatDateTime(nextSession.sessionAt)}</span>
                {nextSession.durationMinutes ? (
                  <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-baby-blue" />{nextSession.durationMinutes} min</span>
                ) : null}
              </p>
            </div>
            {nextSession.joinUrl ? (
              <Button href={nextSession.joinUrl} target="_blank" rel="noreferrer" className="shrink-0">
                Join live <Video className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-white/10 bg-surface p-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-baby-blue">Live sessions</p>
          <p className="mt-2 text-sm text-white/55">No upcoming sessions scheduled right now. Your facilitator will post the next date here.</p>
        </section>
      )}

      <section className="rounded-2xl border border-white/10 bg-ink p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-baby-blue">Attendance</p>
            <p className="mt-2 font-display text-2xl text-white">
              {workspace.attendedCount} of {workspace.sessionCount} sessions attended
            </p>
          </div>
          <strong className="text-3xl text-mint">{workspace.percentage}%</strong>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-mint" style={{ width: `${workspace.percentage}%` }} />
        </div>
        <p className="mt-3 text-xs text-white/40">
          Cohort progress reflects the live sessions you attend. Attendance is taken by your facilitator.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl text-white">Session schedule</h2>
        <div className="mt-3 space-y-2">
          {sessions.length ? (
            sessions.map((session) => {
              const chip = attendanceChip(session);
              return (
                <article
                  key={String(session.id)}
                  className="grid gap-3 rounded-2xl border border-white/10 bg-surface p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full border ${session.attended ? "border-mint/40 bg-mint/10 text-mint" : "border-white/15 text-white/40"}`}>
                    {session.attended ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-base text-white">{session.title}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${chip.tone}`}>{chip.label}</span>
                    </span>
                    <span className="mt-1 block text-xs text-white/45">{formatDateTime(session.sessionAt)}{session.durationMinutes ? ` · ${session.durationMinutes} min` : ""}</span>
                    {session.summary ? <span className="mt-1 block text-sm leading-relaxed text-white/50">{session.summary}</span> : null}
                    {session.resources.length ? (
                      <span className="mt-2 flex flex-wrap gap-2">
                        {session.resources.map((resource) => (
                          <a
                            key={resource.url}
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-ink px-2.5 py-1 text-xs text-white/60 transition hover:border-baby-blue/35 hover:text-white"
                          >
                            <Download className="h-3.5 w-3.5 text-baby-blue" />{resource.label}
                          </a>
                        ))}
                      </span>
                    ) : null}
                  </span>
                  <span className="flex shrink-0 gap-2 sm:justify-end">
                    {!session.isPast && session.joinUrl ? (
                      <Button href={session.joinUrl} target="_blank" rel="noreferrer" variant="secondary" className="px-3 py-2 text-xs">
                        Join <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    ) : null}
                    {session.recordingUrl ? (
                      <Button href={session.recordingUrl} target="_blank" rel="noreferrer" variant="secondary" className="px-3 py-2 text-xs">
                        Recording <Video className="h-3.5 w-3.5" />
                      </Button>
                    ) : null}
                  </span>
                </article>
              );
            })
          ) : (
            <p className="rounded-2xl border border-dashed border-white/12 bg-surface px-4 py-6 text-center text-sm text-white/40">
              The session schedule will appear here once your facilitator adds it.
            </p>
          )}
        </div>
      </section>

      {announcements.length ? (
        <section>
          <div className="flex items-center gap-2 text-baby-blue">
            <ScrollText className="h-4 w-4" />
            <h2 className="font-display text-xl text-white">Announcements</h2>
          </div>
          <div className="mt-3 space-y-2">
            {announcements.map((announcement) => (
              <article key={String(announcement.id)} className="rounded-2xl border border-white/10 bg-surface p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {announcement.pinned ? (
                    <span className="rounded-full border border-baby-blue/30 bg-baby-blue/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-baby-blue">Pinned</span>
                  ) : null}
                  <h3 className="font-display text-base text-white">{announcement.title}</h3>
                  <span className="ml-auto text-xs text-white/35">
                    {announcement.author}{announcement.publishedAt ? ` · ${new Date(announcement.publishedAt).toLocaleDateString("en-GH", { dateStyle: "medium" })}` : ""}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/60">{announcement.body}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <CohortDiscussion courseId={course.id} posts={discussion} />

      <section className="rounded-2xl border border-white/10 bg-surface p-5">
        <div className="flex items-center gap-2 text-baby-blue">
          <Users className="h-4 w-4" />
          <h2 className="font-display text-lg text-white">Your cohort</h2>
          <span className="text-sm text-white/40">· {roster.length}</span>
        </div>
        {roster.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {roster.map((person) => (
              <span key={String(person.id)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink px-3 py-1.5 text-sm text-white/70">
                {person.name}
                {person.handle ? <span className="text-xs text-white/35">@{person.handle}</span> : null}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-white/40">Cohort members will appear here as they enrol.</p>
        )}
      </section>
    </div>
  );
}
