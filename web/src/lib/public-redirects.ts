/**
 * Public IA redirects for the v2 sitemap.
 * Destinations are final URLs. Do not point one of these at another source.
 * `/contact`, `/events`, `/careers`, `/apply`, `/login`, `/signup`, `/connect`,
 * and `/connect/mentors` stay as pages. `/careers/internships` lands on the jobs board.
 */
export const publicRedirects = [
  { source: "/learn/social-media-marketing-ai-programme", destination: "/programs/social-media-marketing", permanent: true },
  { source: "/learn/cohort", destination: "/programs/social-media-marketing", permanent: true },
  { source: "/learn/one-on-one-training", destination: "/programs/one-on-one-training", permanent: true },
  { source: "/learn/organisational-training", destination: "/programs/organisational-training", permanent: true },
  { source: "/learn/courses", destination: "/programs", permanent: true },
  { source: "/learn", destination: "/programs", permanent: true },
  { source: "/learn/:path*", destination: "/programs", permanent: true },

  { source: "/academy", destination: "/programs", permanent: true },
  { source: "/academy/:path*", destination: "/programs", permanent: true },

  { source: "/grow/templates", destination: "/resources#tools", permanent: true },
  { source: "/grow/guides", destination: "/resources#tools", permanent: true },
  { source: "/grow", destination: "/resources", permanent: true },
  { source: "/grow/:slug", destination: "/resources/:slug", permanent: true },

  { source: "/insights", destination: "/resources", permanent: true },
  { source: "/insights/:slug", destination: "/resources/:slug", permanent: true },

  { source: "/experience", destination: "/programs", permanent: true },
  { source: "/simulations", destination: "/programs", permanent: true },

  { source: "/community", destination: "/resources#subscribe", permanent: true },
  { source: "/community/:path*", destination: "/resources#subscribe", permanent: true },

  { source: "/partner", destination: "/partnerships", permanent: true },
  { source: "/employers", destination: "/partnerships", permanent: true },
  { source: "/employers/:path*", destination: "/partnerships", permanent: true },

  { source: "/stories", destination: "/#learner-experiences", permanent: true },

  { source: "/careers/internships", destination: "/careers/jobs?type=Internship", permanent: true },
  { source: "/mentorship", destination: "/connect/mentors", permanent: true },
  { source: "/mentorship/become-a-mentor", destination: "/connect/mentors#become-a-mentor", permanent: true },
  { source: "/mentorship/:path*", destination: "/connect/mentors", permanent: true },
] as const;

export function redirectPath(destination: string) {
  return destination.split(/[?#]/)[0] || "/";
}
