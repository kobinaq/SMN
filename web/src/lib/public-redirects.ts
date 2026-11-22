/**
 * Public IA redirects for the v2 sitemap.
 * Destinations are final URLs. Do not point one of these at another source.
 * `/contact`, `/events`, `/apply`, `/login`, `/signup`, and `/connect` stay as pages.
 * Careers, jobs, and public mentor URLs redirect to /about.
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

  { source: "/stories", destination: "/about", permanent: true },

  { source: "/careers", destination: "/about", permanent: true },
  { source: "/careers/:path*", destination: "/about", permanent: true },
  { source: "/mentors", destination: "/about", permanent: true },
  { source: "/mentors/:path*", destination: "/about", permanent: true },
  { source: "/connect/mentors", destination: "/about", permanent: true },
  { source: "/connect/mentors/:path*", destination: "/about", permanent: true },
  { source: "/mentorship", destination: "/about", permanent: true },
  { source: "/mentorship/:path*", destination: "/about", permanent: true },
] as const;

export function redirectPath(destination: string) {
  return destination.split(/[?#]/)[0] || "/";
}
