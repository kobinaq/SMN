import { CalendarDays, CheckCircle2, Circle, Clock, Download, ExternalLink, ScrollText, Users, Video } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { Card, ProgressRing } from "@/components/ui/Surface";
import { Chip, type ChipTone } from "@/components/ui/Chip";
import { CohortDiscussion } from "@/components/app/CohortDiscussion";
import type { CohortWorkspace as CohortWorkspaceData } from "@/lib/lms";

function formatDateTime(value: string) {
  if (!value) return "Date to be confirmed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be confirmed";
  return date.toLocaleString("en-GH", { dateStyle: "medium", timeStyle: "short" });
}

function attendanceChip(session: CohortWorkspaceData["sessions"][number]): { label: string; tone: ChipTone } {
  if (session.attended) return { label: session.attendance === "excused" ? "Excused" : "Attended", tone: "ai" };
  if (session.attendance === "absent") return { label: "Missed", tone: "danger" };
  if (session.isPast) return { label: "Not recorded", tone: "neutral" };
  return { label: "Upcoming", tone: "accent" };
}

export function CohortWorkspace({ workspace }: { workspace: CohortWorkspaceData }) {
  const { sessions, nextSession, announcements, roster, discussion, course } = workspace;

  return (
    <div className="space-y-7">
      {nextSession ? (
        <Card className="rise border-ai/25 bg-gradient-to-br from-ai-bg to-raised">
          <p className="eyebrow text-ai">Next live session</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-xl text-text-1">{nextSession.title}</h2>
              <p className="tnum mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-2">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-ai" />
                  {formatDateTime(nextSession.sessionAt)}
                </span>
                {nextSession.durationMinutes ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-ai" />
                    {nextSession.durationMinutes} min
                  </span>
                ) : null}
              </p>
            </div>
            {nextSession.joinUrl ? (
              <Button href={nextSession.joinUrl} target="_blank" rel="noreferrer" variant="ai" className="shrink-0">
                Join live <Video className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </Card>
      ) : (
        <Card>
          <p className="eyebrow text-ai">Live sessions</p>
          <p className="mt-2 text-sm text-text-2">
            No upcoming sessions scheduled right now. Your facilitator will post the next date here.
          </p>
        </Card>
      )}

      <Card className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <ProgressRing value={workspace.percentage} size={80} tone="ai" />
        <div className="min-w-0">
          <p className="eyebrow text-ai">Attendance</p>
          <p className="tnum mt-1 font-display text-xl text-text-1">
            {workspace.attendedCount} of {workspace.sessionCount} sessions attended
          </p>
          <p className="mt-1.5 text-xs text-text-3">
            Cohort progress reflects the live sessions you attend. Attendance is taken by your facilitator.
          </p>
        </div>
      </Card>

      <section>
        <h2 className="font-display text-xl text-text-1">Session schedule</h2>
        <div className="mt-3 space-y-2">
          {sessions.length ? (
            sessions.map((session) => {
              const chip = attendanceChip(session);
              return (
                <Card key={String(session.id)} padded={false} className="grid gap-3 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                      session.attended ? "border-ai/40 bg-ai-bg text-ai" : "border-edge text-text-3"
                    }`}
                  >
                    {session.attended ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-base text-text-1">{session.title}</span>
                      <Chip tone={chip.tone}>{chip.label}</Chip>
                    </span>
                    <span className="tnum mt-1 block text-xs text-text-3">
                      {formatDateTime(session.sessionAt)}
                      {session.durationMinutes ? ` · ${session.durationMinutes} min` : ""}
                    </span>
                    {session.summary ? (
                      <span className="mt-1 block text-sm leading-relaxed text-text-2">{session.summary}</span>
                    ) : null}
                    {session.resources.length ? (
                      <span className="mt-2 flex flex-wrap gap-2">
                        {session.resources.map((resource) => (
                          <a
                            key={resource.url}
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-edge-subtle bg-inset px-2.5 py-1 text-xs text-text-2 transition-colors hover:border-accent/35 hover:text-text-1"
                          >
                            <Download className="h-3.5 w-3.5 text-accent" />
                            {resource.label}
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
                </Card>
              );
            })
          ) : (
            <Card className="border-dashed text-center text-sm text-text-3">
              The session schedule will appear here once your facilitator adds it.
            </Card>
          )}
        </div>
      </section>

      {announcements.length ? (
        <section>
          <div className="flex items-center gap-2 text-accent">
            <ScrollText className="h-4 w-4" />
            <h2 className="font-display text-xl text-text-1">Announcements</h2>
          </div>
          <div className="mt-3 space-y-2">
            {announcements.map((announcement) => (
              <Card key={String(announcement.id)}>
                <div className="flex flex-wrap items-center gap-2">
                  {announcement.pinned ? <Chip tone="accent">Pinned</Chip> : null}
                  <h3 className="font-display text-base text-text-1">{announcement.title}</h3>
                  <span className="ml-auto text-xs text-text-3">
                    {announcement.author}
                    {announcement.publishedAt
                      ? ` · ${new Date(announcement.publishedAt).toLocaleDateString("en-GH", { dateStyle: "medium" })}`
                      : ""}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-2">{announcement.body}</p>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <CohortDiscussion courseId={course.id} posts={discussion} />

      <Card>
        <div className="flex items-center gap-2 text-accent">
          <Users className="h-4 w-4" />
          <h2 className="font-display text-lg text-text-1">Your cohort</h2>
          <span className="tnum text-sm text-text-3">· {roster.length}</span>
        </div>
        {roster.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {roster.map((person) => (
              <span
                key={String(person.id)}
                className="inline-flex items-center gap-2 rounded-full border border-edge-subtle bg-inset px-3 py-1.5 text-sm text-text-2"
              >
                {person.name}
                {person.handle ? <span className="text-xs text-text-3">@{person.handle}</span> : null}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-text-3">Cohort members will appear here as they enrol.</p>
        )}
      </Card>
    </div>
  );
}
