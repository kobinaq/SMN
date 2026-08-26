import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Download, ExternalLink, FileText, PlayCircle } from "@/components/ui/icons";
import { CourseCompletionBanner } from "@/components/app/CourseCompletionBanner";
import { LmsProgressButton } from "@/components/app/LmsProgressButton";
import { AITutor } from "@/components/app/AITutor";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Surface";
import { requireMember } from "@/lib/auth/member";
import { getLmsLesson } from "@/lib/lms";

export const metadata = { title: "Lesson" };

export default async function LmsLessonPage(
  props: { params: Promise<{ courseSlug: string; lessonSlug: string }> },
) {
  const { courseSlug, lessonSlug } = await props.params;
  const member = await requireMember(`/app/learning/courses/${courseSlug}/lessons/${lessonSlug}`);
  const lesson = await getLmsLesson(member, courseSlug, lessonSlug);
  if (!lesson) notFound();

  const showVideoEmpty = lesson.lessonType === "video" && !lesson.youtubeEmbedUrl;
  const hasMaterials = Boolean(
    lesson.youtubeEmbedUrl ||
      lesson.body ||
      lesson.resourceUrl ||
      lesson.attachments.length ||
      lesson.lessonType === "classroom",
  );

  return (
    <div className="space-y-7">
      <div>
        <Link href={lesson.course.href} className="text-sm text-text-3 transition-colors hover:text-text-1">
          {lesson.course.title}
        </Link>
        <p className="eyebrow mt-5 text-accent">
          {lesson.moduleTitle} · {lesson.lessonType}
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-2xl text-text-1 sm:text-3xl">{lesson.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2">{lesson.summary}</p>
            <p className="tnum mt-3 text-xs text-text-3">
              Course progress · {lesson.course.completedCount}/{lesson.course.lessonCount} lessons ·{" "}
              {lesson.course.percentage}%
            </p>
          </div>
          <LmsProgressButton courseId={lesson.course.id} lessonId={lesson.id} initialStatus={lesson.status} />
        </div>
      </div>

      <CourseCompletionBanner
        courseTitle={lesson.course.title}
        percentage={lesson.course.percentage}
        certificateEnabled={lesson.course.certificateEnabled}
        courseHref={lesson.course.href}
      />

      {lesson.youtubeEmbedUrl ? (
        <section className="overflow-hidden rounded-[var(--radius-lg)] border border-edge-subtle bg-black shadow-[var(--shadow-1)]">
          <iframe
            title={lesson.title}
            src={lesson.youtubeEmbedUrl}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </section>
      ) : null}

      {showVideoEmpty ? (
        <Card className="border-dashed">
          <PlayCircle className="h-7 w-7 text-accent" />
          <p className="mt-4 font-display text-lg text-text-1">Video not added yet</p>
          <p className="mt-2 text-sm text-text-3">Staff can add an unlisted YouTube URL in Course Builder for this lesson.</p>
        </Card>
      ) : null}

      {lesson.lessonType === "classroom" ? (
        <Card className="border-ai/25 bg-ai-bg">
          <p className="eyebrow text-ai">Live class</p>
          <h2 className="mt-3 font-display text-xl text-text-1">This lesson runs in Google Classroom</h2>
          <p className="mt-2 text-sm text-text-2">
            Join with the invite for your cohort, then mark the lesson complete here when you are done.
          </p>
          {lesson.sessionAt ? (
            <p className="tnum mt-3 text-sm text-text-2">
              Session ·{" "}
              {new Date(lesson.sessionAt).toLocaleString("en-GH", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          ) : null}
          {lesson.classroomUrl ? (
            <Button href={lesson.classroomUrl} target="_blank" rel="noreferrer" variant="ai" className="mt-5">
              Open Classroom <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <p className="mt-4 text-sm text-text-3">Staff have not added a Classroom invite for this cohort yet.</p>
          )}
        </Card>
      ) : null}

      {lesson.resourceUrl ? (
        <Card>
          <h2 className="font-display text-lg text-text-1">External resource</h2>
          <p className="mt-2 text-sm text-text-3">Open the linked article or document for this lesson.</p>
          <a
            href={lesson.resourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-accent hover:underline"
          >
            {lesson.resourceLabel}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Card>
      ) : null}

      {lesson.body ? (
        <Card>
          <div className="flex items-center gap-2 text-accent">
            <FileText className="h-4 w-4" />
            <h2 className="font-display text-lg text-text-1">
              {lesson.lessonType === "assignment" ? "Assignment" : "Lesson content"}
            </h2>
          </div>
          <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-text-2">{lesson.body}</div>
        </Card>
      ) : null}

      {lesson.attachments.length ? (
        <Card>
          <h2 className="font-display text-lg text-text-1">Downloads</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {lesson.attachments.map((attachment) => (
              <a
                key={attachment.url}
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-edge-subtle bg-inset px-4 py-3 text-sm text-text-2 transition-colors hover:border-accent/35 hover:text-text-1"
              >
                {attachment.label}
                <Download className="h-4 w-4 text-accent" />
              </a>
            ))}
          </div>
        </Card>
      ) : null}

      {!hasMaterials ? (
        <Card className="border-dashed">
          <FileText className="h-7 w-7 text-accent" />
          <p className="mt-4 font-display text-lg text-text-1">Materials coming soon</p>
          <p className="mt-2 text-sm text-text-3">
            Staff have not added reading text, a resource link, documents, or video for this lesson yet.
          </p>
        </Card>
      ) : null}

      <div className="flex flex-col justify-between gap-3 border-t border-edge-subtle pt-6 sm:flex-row">
        {lesson.previousHref ? (
          <Button href={lesson.previousHref} variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
        ) : (
          <span />
        )}
        {lesson.nextHref ? (
          <Button href={lesson.nextHref}>
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button href={lesson.course.href} variant="secondary">
            Back to course
          </Button>
        )}
      </div>
      {process.env.AI_TUTOR_ENABLED === "true" && lesson.course.tutorEnabled ? (
        <AITutor courseId={lesson.course.id} lessonId={lesson.id} />
      ) : null}
    </div>
  );
}
