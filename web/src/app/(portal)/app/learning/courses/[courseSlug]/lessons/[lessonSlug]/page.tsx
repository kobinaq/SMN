import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Download, ExternalLink, FileText, PlayCircle } from "lucide-react";
import { CourseCompletionBanner } from "@/components/app/CourseCompletionBanner";
import { LmsProgressButton } from "@/components/app/LmsProgressButton";
import { AITutor } from "@/components/app/AITutor";
import { Button } from "@/components/ui/Button";
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
  const hasMaterials = Boolean(lesson.youtubeEmbedUrl || lesson.body || lesson.resourceUrl || lesson.attachments.length);

  return (
    <div className="space-y-7">
      <div>
        <Link href={lesson.course.href} className="text-sm text-white/45 transition hover:text-white">
          {lesson.course.title}
        </Link>
        <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">
          {lesson.moduleTitle} · {lesson.lessonType}
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-2xl text-white sm:text-3xl">{lesson.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">{lesson.summary}</p>
            <p className="mt-3 text-xs text-white/40">
              Course progress · {lesson.course.completedCount}/{lesson.course.lessonCount} lessons ·{" "}
              {lesson.course.percentage}%
            </p>
          </div>
          <LmsProgressButton
            courseId={lesson.course.id}
            lessonId={lesson.id}
            initialStatus={lesson.status}
          />
        </div>
      </div>

      <CourseCompletionBanner
        courseTitle={lesson.course.title}
        percentage={lesson.course.percentage}
        certificateEnabled={lesson.course.certificateEnabled}
        courseHref={lesson.course.href}
      />

      {lesson.youtubeEmbedUrl ? (
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-black">
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
        <section className="rounded-2xl border border-dashed border-white/15 bg-surface p-6">
          <PlayCircle className="h-7 w-7 text-baby-blue" />
          <p className="mt-4 font-display text-lg text-white">Video not added yet</p>
          <p className="mt-2 text-sm text-white/50">
            Staff can add an unlisted YouTube URL in Course Builder for this lesson.
          </p>
        </section>
      ) : null}

      {lesson.resourceUrl ? (
        <section className="rounded-2xl border border-white/10 bg-surface p-5">
          <h2 className="font-display text-lg text-white">External resource</h2>
          <p className="mt-2 text-sm text-white/50">Open the linked article or document for this lesson.</p>
          <a
            href={lesson.resourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-baby-blue hover:underline"
          >
            {lesson.resourceLabel}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </section>
      ) : null}

      {lesson.body ? (
        <section className="rounded-2xl border border-white/10 bg-surface p-5">
          <div className="flex items-center gap-2 text-baby-blue">
            <FileText className="h-4 w-4" />
            <h2 className="font-display text-lg text-white">
              {lesson.lessonType === "assignment" ? "Assignment" : "Lesson content"}
            </h2>
          </div>
          <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/60">{lesson.body}</div>
        </section>
      ) : null}

      {lesson.attachments.length ? (
        <section className="rounded-2xl border border-white/10 bg-surface p-5">
          <h2 className="font-display text-lg text-white">Downloads</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {lesson.attachments.map((attachment) => (
              <a
                key={attachment.url}
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white/65 transition hover:border-baby-blue/35 hover:text-white"
              >
                {attachment.label}
                <Download className="h-4 w-4 text-baby-blue" />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {!hasMaterials ? (
        <section className="rounded-2xl border border-dashed border-white/15 bg-surface p-6">
          <FileText className="h-7 w-7 text-baby-blue" />
          <p className="mt-4 font-display text-lg text-white">Materials coming soon</p>
          <p className="mt-2 text-sm text-white/50">
            Staff have not added reading text, a resource link, documents, or video for this lesson yet.
          </p>
        </section>
      ) : null}

      <div className="flex flex-col justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
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
