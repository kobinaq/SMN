import type { Access, CollectionConfig } from "payload";
import { canStaff, type StaffRole } from "./staff-permissions";

type Domain = { read: StaffRole[]; write: StaffRole[] };
const domains: Record<string, Domain> = {
  members: { read: ["support", "learning", "mentorship", "analyst"], write: ["support"] },
  "member-notes": { read: ["support", "analyst"], write: ["support"] },
  portfolios: { read: ["support", "analyst"], write: ["support"] },
  mentors: { read: ["mentorship", "support", "analyst"], write: ["mentorship"] },
  "mentorship-requests": { read: ["mentorship", "support", "analyst"], write: ["mentorship"] },
  "mentorship-relationships": { read: ["mentorship", "support", "analyst"], write: ["mentorship"] },
  opportunities: { read: ["opportunity", "support", "analyst"], write: ["opportunity"] },
  "opportunity-sources": { read: ["opportunity", "analyst"], write: ["opportunity"] },
  "opportunity-applications": { read: ["opportunity", "support", "analyst"], write: ["opportunity", "support"] },
  enrollments: { read: ["learning", "support", "analyst"], write: ["learning", "support"] },
  "learning-items": { read: ["learning", "analyst"], write: ["learning"] },
  progress: { read: ["learning", "support", "analyst"], write: ["learning", "support"] },
  "lms-courses": { read: ["learning", "analyst"], write: ["learning"] },
  "lms-modules": { read: ["learning", "analyst"], write: ["learning"] },
  "lms-lessons": { read: ["learning", "analyst"], write: ["learning"] },
  "lms-lesson-progress": { read: ["learning", "support", "analyst"], write: ["learning", "support"] },
  certificates: { read: ["learning", "support", "analyst"], write: ["learning"] },
  posts: { read: ["content", "analyst"], write: ["content"] },
  resources: { read: ["content", "analyst"], write: ["content"] },
  media: { read: ["content", "learning", "analyst"], write: ["content", "learning"] },
  courses: { read: ["content", "analyst"], write: ["content"] },
  events: { read: ["content", "analyst"], write: ["content"] },
  stories: { read: ["content", "analyst"], write: ["content"] },
  "audit-events": { read: ["support", "analyst"], write: ["content", "learning", "mentorship", "opportunity", "support"] },
  "ai-usage-records": { read: ["learning", "support", "analyst"], write: [] },
  "ai-feedback": { read: ["learning", "support", "analyst"], write: [] },
  "ai-knowledge-sources": { read: ["learning", "analyst"], write: ["learning"] },
  "ai-drafts": { read: ["learning", "analyst"], write: ["learning"] },
  "ai-career-states": { read: ["support", "analyst"], write: ["support"] },
};

function restrict(rule: Access | undefined, roles: StaffRole[], fallback: boolean): Access {
  return async (args) => {
    if (args.req.user?.collection === "users" && !canStaff(args.req.user, ...roles)) return false;
    if (typeof rule === "function") return rule(args);
    return rule ?? fallback;
  };
}

function restrictAdmin(rule: Access | undefined, roles: StaffRole[], fallback: boolean) {
  return async (args: Parameters<Access>[0]): Promise<boolean> => {
    if (args.req.user?.collection === "users" && !canStaff(args.req.user, ...roles)) return false;
    if (typeof rule === "function") return Boolean(await rule(args));
    return Boolean(rule ?? fallback);
  };
}

export function enforceStaffPermissions(collections: CollectionConfig[]) {
  return collections.map((collection) => {
    const domain = domains[collection.slug];
    if (!domain || collection.slug === "users") return collection;
    return {
      ...collection,
      access: {
        ...collection.access,
        admin: restrictAdmin(collection.access?.admin, domain.read, false),
        read: restrict(collection.access?.read, domain.read, false),
        create: restrict(collection.access?.create, domain.write, false),
        update: restrict(collection.access?.update, domain.write, false),
        delete: restrict(collection.access?.delete, domain.write, false),
      },
    };
  });
}
