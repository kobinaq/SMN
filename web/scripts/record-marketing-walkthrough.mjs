/**
 * Portfolio screen recording of the SMN marketing site.
 *
 * Usage:
 *   node scripts/record-marketing-walkthrough.mjs
 *   SITE_URL=https://www.socialmarketersnetwork.com node scripts/record-marketing-walkthrough.mjs
 *
 * Output:
 *   recordings/smn-marketing-walkthrough.webm
 *   recordings/frames/*.png (key frames for stills)
 */
import { chromium } from "@playwright/test";
import { mkdir, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "recordings");
const rawDir = path.join(outDir, ".raw");
const framesDir = path.join(outDir, "frames");

const SITE_URL = (
  process.env.SITE_URL ?? "https://www.socialmarketersnetwork.com"
).replace(/\/$/, "");

const VIEWPORT = { width: 1440, height: 900 };

/** @type {{ name: string; path: string; dwellMs?: number; scrollPasses?: number }[]} */
const TOUR = [
  { name: "01-home", path: "/", dwellMs: 1800, scrollPasses: 3 },
  { name: "02-programs", path: "/programs", dwellMs: 1200, scrollPasses: 2 },
  { name: "03-cohort", path: "/programs/cohort", dwellMs: 1200, scrollPasses: 2 },
  { name: "04-courses", path: "/programs/courses", dwellMs: 1000, scrollPasses: 2 },
  { name: "05-resources", path: "/resources", dwellMs: 1000, scrollPasses: 1 },
  { name: "06-insights", path: "/insights", dwellMs: 1000, scrollPasses: 1 },
  { name: "07-mentorship", path: "/mentorship", dwellMs: 1000, scrollPasses: 2 },
  { name: "08-community", path: "/community", dwellMs: 1000, scrollPasses: 1 },
  { name: "09-events", path: "/events", dwellMs: 1000, scrollPasses: 1 },
  { name: "10-stories", path: "/stories", dwellMs: 1000, scrollPasses: 1 },
  { name: "11-employers", path: "/employers", dwellMs: 1000, scrollPasses: 2 },
  { name: "12-about", path: "/about", dwellMs: 1000, scrollPasses: 2 },
  { name: "13-apply", path: "/apply", dwellMs: 1200, scrollPasses: 1 },
  { name: "14-contact", path: "/contact", dwellMs: 1000, scrollPasses: 1 },
];

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function smoothScroll(page, passes = 2) {
  for (let pass = 0; pass < passes; pass += 1) {
    await page.evaluate(async () => {
      const distance = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0,
      );
      if (distance < 40) return;

      const steps = Math.min(48, Math.max(18, Math.floor(distance / 90)));
      const step = distance / steps;
      for (let i = 0; i < steps; i += 1) {
        window.scrollTo({ top: step * (i + 1), behavior: "instant" });
        await new Promise((r) => setTimeout(r, 55));
      }
    });
    await sleep(400);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await sleep(350);
  }
}

async function captureFrame(page, name) {
  await page.screenshot({
    path: path.join(framesDir, `${name}.png`),
    type: "png",
  });
}

async function main() {
  await rm(rawDir, { recursive: true, force: true });
  await mkdir(rawDir, { recursive: true });
  await mkdir(framesDir, { recursive: true });

  // Prefer system Chrome so sandboxed environments don't need a Playwright browser download.
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--autoplay-policy=no-user-gesture-required"],
  });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
    recordVideo: {
      dir: rawDir,
      size: VIEWPORT,
    },
  });

  const page = await context.newPage();
  const chapters = [];

  console.log(`Recording walkthrough of ${SITE_URL}`);
  console.log(`Viewport ${VIEWPORT.width}x${VIEWPORT.height}`);

  for (const stop of TOUR) {
    const url = `${SITE_URL}${stop.path}`;
    console.log(`→ ${stop.name} ${url}`);
    const started = Date.now();

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
    await sleep(stop.dwellMs ?? 1000);
    await captureFrame(page, stop.name);
    await smoothScroll(page, stop.scrollPasses ?? 1);
    await sleep(500);

    chapters.push({
      name: stop.name,
      path: stop.path,
      url,
      seconds: Number(((Date.now() - started) / 1000).toFixed(1)),
    });
  }

  // End on home hero for a clean close
  await page.goto(`${SITE_URL}/`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await sleep(1600);
  await captureFrame(page, "15-home-close");

  const videoPath = await page.video()?.path();
  await context.close();
  await browser.close();

  if (!videoPath) {
    throw new Error("Playwright did not produce a video file.");
  }

  const finalVideo = path.join(outDir, "smn-marketing-walkthrough.webm");
  await rename(videoPath, finalVideo);

  // Clean leftover raw dir files if any
  const leftover = await readdir(rawDir).catch(() => []);
  if (!leftover.length) {
    await rm(rawDir, { recursive: true, force: true });
  }

  const manifest = {
    title: "SMN Marketing Site — Portfolio Walkthrough",
    siteUrl: SITE_URL,
    recordedAt: new Date().toISOString(),
    viewport: VIEWPORT,
    video: "smn-marketing-walkthrough.webm",
    frames: "frames/",
    chapters,
  };

  await writeFile(path.join(outDir, "walkthrough-manifest.json"), JSON.stringify(manifest, null, 2));

  const narration = `# SMN Marketing Site — Portfolio Walkthrough

**Product:** Social Marketers Network (SMN)  
**Live site:** ${SITE_URL}  
**Recording:** \`smn-marketing-walkthrough.webm\`  
**Stills:** \`frames/\`

## One-liner for your case study

Built a premium marketing-community website for Social Marketers Network — Next.js, Payload CMS, GSAP scroll storytelling, and a member platform — with a public marketing surface that sells programmes, community, and career outcomes.

## Spoken / on-screen narration (≈ 90–120s)

1. **Home** — Open on the cinematic hero. Call out the brand-led first viewport, photo gallery, and scroll-driven story sections (credibility → programmes → ecosystem → CTA).
2. **Programmes** — Show the programme hub, then drill into the flagship cohort and self-paced courses.
3. **Learning** — Pass through free resources, insights, and mentorship — the content/learning funnel.
4. **Community** — WhatsApp community, events, and member stories as social proof.
5. **Employers & About** — B2B employers page and mission/about positioning.
6. **Apply / Contact** — Close on conversion paths: cohort application and contact.

## Chapter timings (approx.)

${chapters.map((c) => `- **${c.name}** — \`${c.path}\` (~${c.seconds}s)`).join("\n")}

## Suggested portfolio caption

> End-to-end marketing site for a professional learning network: motion-led homepage, programme pages, content hubs, community proof, and conversion flows — powered by Next.js + Payload CMS.

## Tech to mention

Next.js App Router · TypeScript · Tailwind · GSAP + Lenis · Payload CMS · Vercel
`;

  await writeFile(path.join(outDir, "WALKTHROUGH.md"), narration);

  console.log("\nDone.");
  console.log(`Video: ${finalVideo}`);
  console.log(`Frames: ${framesDir}`);
  console.log(`Notes: ${path.join(outDir, "WALKTHROUGH.md")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
