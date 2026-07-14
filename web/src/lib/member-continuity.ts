import type { MemberUser } from "@/lib/auth/member";
import { getMemberCertificates } from "@/lib/certificates";
import { getLmsCourses } from "@/lib/lms";
import { getMentorApplicationStatus } from "@/lib/mentors";
import { getMemberOpportunityActivity } from "@/lib/opportunities";
import { getMemberPortfolios } from "@/lib/portfolios";
import { getPayloadClient } from "@/lib/payload";

export type ContinuityAction = {
  key: string;
  eyebrow: string;
  title: string;
  detail: string;
  href: string;
  cta: string;
  tone: "primary" | "secondary";
};

function profileCompletion(member: MemberUser) {
  const checks = [
    Boolean(member.name?.trim()),
    Boolean(member.handle?.trim()),
    Boolean(member.headline?.trim()),
    Boolean(member.bio?.trim()),
    Boolean((member.skills || []).some((item) => item?.skill?.trim())),
    Boolean((member.careerInterests || []).some((item) => item?.interest?.trim())),
    Boolean(member.careerGoals?.trim()),
    Boolean(member.location?.trim()),
    Boolean(member.visibility && member.visibility !== "private"),
  ];
  const done = checks.filter(Boolean).length;
  return {
    percent: Math.round((done / checks.length) * 100),
    missing: [
      !member.handle?.trim() ? "Add a public handle" : "",
      !member.headline?.trim() ? "Add a headline" : "",
      !(member.skills || []).some((item) => item?.skill?.trim()) ? "Add skills" : "",
      !member.careerGoals?.trim() ? "Set a career goal" : "",
      !member.visibility || member.visibility === "private" ? "Review profile visibility" : "",
    ].filter(Boolean),
  };
}

export async function getMemberContinuity(member: MemberUser) {
  const payload = await getPayloadClient();
  const [courses, opportunities, certificates, portfolios, mentorStatus, mentorshipRequests] = await Promise.all([
    getLmsCourses(member),
    getMemberOpportunityActivity(member.id),
    getMemberCertificates(member),
    getMemberPortfolios(member.id),
    getMentorApplicationStatus(member.id),
    payload.find({
      collection: "mentorship-requests",
      depth: 0,
      limit: 20,
      sort: "-createdAt",
      overrideAccess: true,
      where: { requester: { equals: member.id } },
    }),
  ]);

  const profile = profileCompletion(member);
  const activeCourse =
    courses.find((course) => course.percentage > 0 && course.percentage < 100) ||
    courses.find((course) => course.percentage === 0) ||
    null;
  const openMentorship = mentorshipRequests.docs.find((item) =>
    ["new", "reviewing", "introduced"].includes(String(item.status)),
  );
  const draftPortfolios = portfolios.filter((item) => item.status === "draft");
  const recentCert = certificates[0] || null;
  const recentApplication = opportunities[0] || null;

  const primary: ContinuityAction | null = activeCourse
    ? {
        key: "continue-learning",
        eyebrow: "Continue learning",
        title: activeCourse.title,
        detail: `${activeCourse.percentage}% complete · ${activeCourse.completedCount}/${activeCourse.lessonCount} lessons`,
        href: activeCourse.continueHref,
        cta: activeCourse.percentage > 0 ? "Resume lesson" : "Start course",
        tone: "primary",
      }
    : profile.percent < 80
      ? {
          key: "complete-profile",
          eyebrow: "Get set up",
          title: "Finish the essentials on your profile",
          detail: profile.missing[0] || "Add a few details so mentors and opportunities fit better.",
          href: "/app/profile",
          cta: "Update profile",
          tone: "primary",
        }
      : {
          key: "explore-learning",
          eyebrow: "Next step",
          title: "Explore learning paths",
          detail: "Browse unlocked courses or request mentorship when you are ready.",
          href: "/app/learning",
          cta: "Open learning",
          tone: "primary",
        };

  const secondary: ContinuityAction[] = [];
  if (profile.percent < 100) {
    secondary.push({
      key: "profile",
      eyebrow: "Profile",
      title: `${profile.percent}% complete`,
      detail: profile.missing[0] || "Your profile looks solid.",
      href: "/app/profile",
      cta: "Review profile",
      tone: "secondary",
    });
  }
  if (openMentorship) {
    secondary.push({
      key: "mentorship",
      eyebrow: "Mentorship",
      title: `Request ${openMentorship.status}`,
      detail: "Track where your mentorship request sits in the review cycle.",
      href: "/app/mentors",
      cta: "View mentors",
      tone: "secondary",
    });
  } else if (mentorStatus && mentorStatus !== "approved") {
    secondary.push({
      key: "mentor-app",
      eyebrow: "Mentor application",
      title: `Application ${mentorStatus}`,
      detail: "Staff will update you when your mentor application advances.",
      href: "/app/mentors/become-a-mentor",
      cta: "View status",
      tone: "secondary",
    });
  }
  if (recentApplication) {
    secondary.push({
      key: "opportunity",
      eyebrow: "Opportunities",
      title: recentApplication.title,
      detail: `${recentApplication.company} · ${recentApplication.status}`,
      href: `/app/opportunities/${recentApplication.slug}`,
      cta: "Open listing",
      tone: "secondary",
    });
  }
  if (draftPortfolios.length) {
    secondary.push({
      key: "portfolio",
      eyebrow: "Portfolio",
      title: `${draftPortfolios.length} draft${draftPortfolios.length === 1 ? "" : "s"} waiting`,
      detail: "Finish and publish a case study when you are ready to share proof of work.",
      href: "/app/portfolio",
      cta: "Open portfolio",
      tone: "secondary",
    });
  }
  if (recentCert) {
    secondary.push({
      key: "certificate",
      eyebrow: "Credentials",
      title: recentCert.title,
      detail: "Share your verification link with employers and partners.",
      href: "/app/certificates",
      cta: "View certificates",
      tone: "secondary",
    });
  }

  return {
    profile,
    primary,
    secondary: secondary.slice(0, 4),
    courses,
    openMentorshipCount: mentorshipRequests.docs.filter((item) =>
      ["new", "reviewing", "introduced"].includes(String(item.status)),
    ).length,
    opportunityActivityCount: opportunities.length,
    certificateCount: certificates.length,
  };
}
