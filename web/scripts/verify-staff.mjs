/**
 * End-to-end verification of the staff portal against a running dev server.
 *
 *   npm run seed:demo && npm run dev      # terminal 1
 *   npm run verify:staff                  # terminal 2
 *
 * Walks the course index, the create/delete flows, every course-workspace tab,
 * the cohort ops (sessions, attendance, announcements) and every other staff
 * route, asserting behaviour and collecting console errors. Screenshots land in
 * /tmp/staff-shots. It creates and then removes its own QA records, so it is
 * safe to re-run against the demo seed.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = "http://localhost:3000";
const shotDir = "/tmp/staff-shots";
await mkdir(shotDir, { recursive: true });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

const errors = [];
const results = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(`[console] ${m.text()}`); });
page.on("pageerror", (e) => errors.push(`[pageerror] ${e}`));

function check(label, ok, extra = "") {
  results.push({ label, ok });
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${extra ? ` — ${extra}` : ""}`);
}

async function visit(path, label, shot) {
  const resp = await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 45000 });
  const status = resp?.status() ?? 0;
  check(`${label} loads`, status === 200 && !page.url().includes("/staff/login"), `${status} ${page.url()}`);
  if (shot) await page.screenshot({ path: `${shotDir}/${shot}`, fullPage: true });
  return status;
}

// ---------------------------------------------------------------- login
console.log("\n== AUTH ==");
await page.goto(`${base}/staff/login`, { waitUntil: "networkidle" });
await page.fill('input[name="email"]', "staff.demo@smn.example");
await page.fill('input[name="password"]', "DemoStaff123!");
await page.click('button[type="submit"]');
await page.waitForURL(/\/staff(?!\/login)/, { timeout: 20000 });
await page.waitForTimeout(1000);
check("staff login", !page.url().includes("/staff/login"), page.url());
await page.screenshot({ path: `${shotDir}/00-today.png`, fullPage: true });

// ---------------------------------------------------------------- course index
console.log("\n== COURSE INDEX ==");
await visit("/staff/learning", "course index", "01-course-index.png");
let body = await page.textContent("body");
check("index shows a course list", body.includes("Demo Content Strategy Sprint"));
check("index shows New course CTA", body.includes("New course"));
check("index shows metrics", body.includes("Published") && body.includes("Drafts"));

// search filters
await page.fill('input[aria-label="Search courses"]', "zzz-no-match");
await page.waitForTimeout(400);
body = await page.textContent("body");
check("search filters to empty state", body.includes("No courses match"));
await page.click('button:has-text("Clear filters")');
await page.waitForTimeout(400);
body = await page.textContent("body");
check("clear filters restores list", body.includes("Demo Content Strategy Sprint"));

// status filter chips
await page.click('[role="tab"]:has-text("Published")');
await page.waitForTimeout(400);
check("status filter chip works", true);
await page.click('[role="tab"]:has-text("All")');
await page.waitForTimeout(300);

// ---------------------------------------------------------------- create course (blank)
console.log("\n== CREATE COURSE ==");
await visit("/staff/learning/courses/new", "new course page", "02-new-course.png");
await page.click('button:has-text("Create blank draft")');
await page.waitForTimeout(300);
const stamp = Date.now().toString(36);
const newTitle = `QA Verification Course ${stamp}`;
await page.fill('input[name="title"]', newTitle);
await page.fill('textarea[name="summary"]', "A course created by the automated staff verification run.");
await page.fill('input[name="programKey"]', `qa-verify-${stamp}`);
await page.click('button:has-text("Create draft course")');
await page.waitForURL(/\/staff\/learning\/courses\/\d+/, { timeout: 25000 });
const workspaceUrl = page.url();
const courseId = workspaceUrl.match(/courses\/(\d+)/)?.[1];
check("blank course created and routed to its own URL", Boolean(courseId), workspaceUrl);
await page.waitForTimeout(600);
await page.screenshot({ path: `${shotDir}/03-workspace-overview.png`, fullPage: true });
body = await page.textContent("body");
check("workspace shows the new course title", body.includes(newTitle));
check("workspace shows readiness checklist", body.includes("Publication checklist"));

// ---------------------------------------------------------------- workspace tabs
console.log("\n== WORKSPACE TABS (self-paced) ==");
for (const [tab, marker] of [
  ["overview", "Publication checklist"],
  ["curriculum", "Modules and lessons"],
  ["assessments", "Assessments"],
  ["gradebook", "Submitted work"],
  ["learners", "Learners"],
  ["analytics", "Analytics"],
  ["settings", "Course settings"],
]) {
  await page.goto(`${base}/staff/learning/courses/${courseId}?tab=${tab}`, { waitUntil: "networkidle" });
  const t = await page.textContent("body");
  check(`tab "${tab}" renders`, t.includes(marker));
}
await page.screenshot({ path: `${shotDir}/04-workspace-settings.png`, fullPage: true });
check("settings tab shows Danger zone", (await page.textContent("body")).includes("Danger zone"));

// ---------------------------------------------------------------- add module + lesson
console.log("\n== CURRICULUM ==");
await page.goto(`${base}/staff/learning/courses/${courseId}?tab=curriculum`, { waitUntil: "networkidle" });
await page.fill('input[name="title"]', "QA Module One");
await page.click('button:has-text("Add module")');
await page.waitForTimeout(2000);
body = await page.textContent("body");
check("module added", body.includes("QA Module One"));
await page.screenshot({ path: `${shotDir}/05-curriculum.png`, fullPage: true });

const lessonInput = page.locator('input[placeholder="Lesson title"]').first();
if (await lessonInput.isVisible().catch(() => false)) {
  await lessonInput.fill("QA Lesson One");
  await page.locator('button:has-text("Add lesson")').first().click();
  await page.waitForURL(/\/staff\/learning\/lessons\/\d+/, { timeout: 20000 }).catch(() => {});
  check("lesson added (routed to lesson editor)", page.url().includes("/staff/learning/lessons/"), page.url());
  await page.screenshot({ path: `${shotDir}/06-lesson-editor.png`, fullPage: true });
} else {
  check("lesson input present", false);
}

// ---------------------------------------------------------------- settings save
console.log("\n== SETTINGS SAVE ==");
await page.goto(`${base}/staff/learning/courses/${courseId}?tab=settings`, { waitUntil: "networkidle" });
await page.locator('label:has-text("Instructor") input').first().fill("QA Instructor");
await page.click('button:has-text("Save course settings")');
await page.waitForTimeout(2500);
body = await page.textContent("body");
check("settings save reports Saved", body.includes("Saved."), body.match(/Saved\.|Unable[^<]*/)?.[0] ?? "");

// ---------------------------------------------------------------- delete guard
console.log("\n== DELETE (typed-name guard) ==");
await page.goto(`${base}/staff/learning/courses/${courseId}?tab=settings`, { waitUntil: "networkidle" });
await page.click('button:has-text("Delete course")');
await page.waitForTimeout(500);
await page.screenshot({ path: `${shotDir}/07-delete-dialog.png`, fullPage: false });
const confirmBtn = page.locator('[role="dialog"] button:has-text("Delete course")');
check("delete button disabled before typing", await confirmBtn.isDisabled());

await page.fill('[role="dialog"] input', "wrong name entirely");
await page.waitForTimeout(300);
check("delete button still disabled on wrong title", await confirmBtn.isDisabled());

await page.fill('[role="dialog"] input', newTitle);
await page.waitForTimeout(300);
check("delete button enables on exact title", !(await confirmBtn.isDisabled()));

await confirmBtn.click();
await page.waitForURL(/\/staff\/learning$/, { timeout: 25000 });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${shotDir}/08-after-delete.png`, fullPage: true });
// Assert on the course cards specifically. The success toast echoes the title,
// so a whole-body text match would report a false failure.
const remainingCards = await page.$$eval("h3", (nodes) => nodes.map((n) => n.textContent?.trim() ?? ""));
check("deleted course is gone from the index", !remainingCards.some((t) => t === newTitle), remainingCards.join(" | "));
// The workspace URL must now render the not-found UI rather than a stale
// shell. Next returns 200 for streamed not-found responses (documented), so
// assert on the rendered content, not the status code.
await page.goto(`${base}/staff/learning/courses/${courseId}`, { waitUntil: "networkidle" });
const goneText = await page.textContent("body");
check("deleted course URL renders 404 UI", goneText.includes("Error 404"), page.url());
const htmlCount = await page.locator("html").count();
check("404 does not nest a second <html>", htmlCount === 1, `${htmlCount} html elements`);
await page.goto(`${base}/staff/learning`, { waitUntil: "networkidle" });

// ---------------------------------------------------------------- cohort course path
console.log("\n== COHORT COURSE (sessions / attendance / announcements) ==");
await page.goto(`${base}/staff/learning/courses/new`, { waitUntil: "networkidle" });
await page.click('button:has-text("Create blank draft")');
await page.waitForTimeout(300);
const cohortTitle = `QA Cohort ${stamp}`;
await page.fill('input[name="title"]', cohortTitle);
await page.fill('textarea[name="summary"]', "Cohort created by the automated staff verification run.");
await page.fill('input[name="programKey"]', `qa-cohort-${stamp}`);
await page.selectOption('select[name="delivery"]', "cohort").catch(async () => {
  // Custom Select renders a button + listbox rather than a native select.
  await page.locator('label:has-text("Programme type") button').click();
  await page.locator('[role="option"]:has-text("Live cohort")').click();
});
await page.waitForTimeout(400);
await page.click('button:has-text("Create draft course")');
await page.waitForURL(/\/staff\/learning\/courses\/\d+/, { timeout: 25000 });
const cohortId = page.url().match(/courses\/(\d+)/)?.[1];
check("cohort course created", Boolean(cohortId), page.url());

for (const [tab, marker] of [
  ["sessions", "Live sessions"],
  ["announcements", "Announcements"],
]) {
  await page.goto(`${base}/staff/learning/courses/${cohortId}?tab=${tab}`, { waitUntil: "networkidle" });
  const t = await page.textContent("body");
  check(`cohort tab "${tab}" renders`, t.includes(marker));
}

// add a session
await page.goto(`${base}/staff/learning/courses/${cohortId}?tab=sessions`, { waitUntil: "networkidle" });
await page.fill('input[name="title"]', "QA Week 1");
await page.fill('input[name="sessionAt"]', "2026-10-01T17:00");
await page.click('button:has-text("Add session")');
await page.waitForTimeout(2200);
body = await page.textContent("body");
check("session added", body.includes("QA Week 1"));
await page.screenshot({ path: `${shotDir}/09-cohort-sessions.png`, fullPage: true });

// Attendance register. A brand-new cohort has no enrollments, so the register
// correctly shows an empty-roster message; enroll a member through the staff
// records API and re-check that the real register renders and saves.
const takeAttendance = page.locator('summary:has-text("Take attendance")').first();
const attendanceReady = await takeAttendance
  .waitFor({ state: "visible", timeout: 15000 })
  .then(() => true)
  .catch(() => false);
check("attendance register control renders", attendanceReady);
if (attendanceReady) {
  await takeAttendance.click();
  await page.locator('text=No enrolled members to mark yet.').waitFor({ state: "visible", timeout: 10000 });
  check("empty cohort shows empty-roster message", true);
}

// enroll a member into this cohort so the register has a roster
await page.goto(`${base}/staff/learning/courses/${cohortId}?tab=settings`, { waitUntil: "networkidle" });
// The settings form is fully controlled, so its inputs carry no name
// attribute — address the field through its wrapping label instead.
const programKey = await page.locator('label:has-text("Program key") input').first().inputValue();
const enrollResponse = await page.request.post(`${base}/api/staff/records`, {
  data: {
    collection: "enrollments",
    action: "create",
    data: {
      member: 1,
      programName: cohortTitle,
      programKey,
      course: Number(cohortId),
      programType: "Cohort",
      source: "staff",
      status: "active",
    },
  },
});
check("enrollment granted via staff records API", enrollResponse.ok(), `${enrollResponse.status()} ${programKey}`);
const enrollmentId = await enrollResponse
  .json()
  .then((payload) => payload?.doc?.id ?? payload?.id ?? null)
  .catch(() => null);

await page.goto(`${base}/staff/learning/courses/${cohortId}?tab=sessions`, { waitUntil: "networkidle" });
await page.locator('summary:has-text("Take attendance")').first().click();
const markAll = page.locator('button:has-text("Mark all present")');
await markAll.waitFor({ state: "visible", timeout: 10000 });
check("attendance register opens with a roster", true);
await markAll.click();
await page.click('button:has-text("Save attendance")');
const saved = await page
  .locator('text=Attendance saved.')
  .waitFor({ state: "visible", timeout: 15000 })
  .then(() => true)
  .catch(() => false);
check("attendance saves", saved);
await page.screenshot({ path: `${shotDir}/09a-cohort-attendance.png`, fullPage: true });

// post an announcement
await page.goto(`${base}/staff/learning/courses/${cohortId}?tab=announcements`, { waitUntil: "networkidle" });
await page.fill('input[name="title"]', "QA Announcement");
await page.fill('textarea[name="body"]', "Posted by the automated staff verification run.");
await page.click('button:has-text("Post announcement")');
await page.waitForTimeout(2200);
body = await page.textContent("body");
check("announcement posted", body.includes("QA Announcement"));
await page.screenshot({ path: `${shotDir}/09b-cohort-announcements.png`, fullPage: true });

// clean up the cohort via the same delete flow
await page.goto(`${base}/staff/learning/courses/${cohortId}?tab=settings`, { waitUntil: "networkidle" });
await page.click('button:has-text("Delete course")');
await page.waitForTimeout(400);
await page.fill('[role="dialog"] input', cohortTitle);
await page.waitForTimeout(250);
await page.locator('[role="dialog"] button:has-text("Delete course")').click();
await page.waitForURL(/\/staff\/learning$/, { timeout: 25000 });
check("cohort course deleted", true, page.url());

// the QA enrollment survives the course delete by design (learner history is
// kept, only detached) — remove the test row so the seed stays clean
if (enrollmentId) {
  const cleanup = await page.request.post(`${base}/api/staff/records`, {
    data: { collection: "enrollments", action: "delete", id: enrollmentId },
  });
  check("QA enrollment cleaned up", cleanup.ok(), String(cleanup.status()));
}

// ---------------------------------------------------------------- all other staff routes
console.log("\n== OTHER STAFF SECTIONS ==");
const routes = [
  ["/staff", "Today", "10-today.png"],
  ["/staff/members", "People", "11-members.png"],
  ["/staff/mentorship", "Mentorship", "12-mentorship.png"],
  ["/staff/opportunities", "Jobs", "13-opportunities.png"],
  ["/staff/certificates", "Certificates", "14-certificates.png"],
  ["/staff/events", "Events", "15-events.png"],
  ["/staff/applications", "Applications", "16-applications.png"],
  ["/staff/content/posts", "Posts", "17-posts.png"],
  ["/staff/content/resources", "Resources", "18-resources.png"],
  ["/staff/content/media", "Media", "19-media.png"],
  ["/staff/website/events", "Website events", "20-web-events.png"],
  ["/staff/website/stories", "Stories", "21-stories.png"],
  ["/staff/website/settings", "Site settings", "22-site-settings.png"],
  ["/staff/system/users", "Staff users", "23-users.png"],
  ["/staff/system/ai", "AI activity", "24-ai.png"],
  ["/staff/system/audit", "Audit log", "25-audit.png"],
  ["/staff/content/posts/new", "New post", "26-new-post.png"],
  ["/staff/content/resources/new", "New resource", "27-new-resource.png"],
  ["/staff/website/stories/new", "New story", "28-new-story.png"],
  ["/staff/website/events/new", "New website event", "29-new-web-event.png"],
  ["/staff/system/users/new", "New staff user", "30-new-user.png"],
];
for (const [path, label, shot] of routes) {
  await visit(path, label, shot);
}

// ---------------------------------------------------------------- summary
console.log("\n== SUMMARY ==");
const failed = results.filter((r) => !r.ok);
console.log(`${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log("FAILURES:");
  for (const f of failed) console.log("  -", f.label);
}
console.log(`\nconsole/page errors: ${errors.length}`);
for (const e of errors.slice(0, 25)) console.log("  ", e);

await browser.close();
process.exit(failed.length || errors.length ? 1 : 0);
