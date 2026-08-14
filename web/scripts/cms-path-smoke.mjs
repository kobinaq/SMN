import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "./load-env.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnv(root);

const bundleUrl = pathToFileURL(path.join(root, "scripts", ".payload.config.bundle.mjs")).href;
const { default: config } = await import(bundleUrl);
const { getPayload } = await import("payload");
const payload = await getPayload({ config });

const stamp = Date.now().toString(36);
const draftName = `Draft story ${stamp}`;
const liveName = `Live story ${stamp}`;
const futureSlug = `future-post-${stamp}`;
const created = [];

let failed = false;
try {
  const draft = await payload.create({
    collection: "stories",
    overrideAccess: true,
    data: {
      name: draftName,
      role: "Applicant",
      quote: "This draft must not appear on the public REST/Local read path.",
      published: false,
      permissionConfirmed: false,
    },
  });
  created.push(["stories", draft.id]);

  const live = await payload.create({
    collection: "stories",
    overrideAccess: true,
    data: {
      name: liveName,
      role: "Alumna",
      quote: "This published story should be readable without overrideAccess.",
      published: true,
      permissionConfirmed: true,
    },
  });
  created.push(["stories", live.id]);

  const future = await payload.create({
    collection: "posts",
    overrideAccess: true,
    data: {
      title: `Future post ${stamp}`,
      slug: futureSlug,
      category: "Marketing Strategy",
      excerpt: "Excerpt only",
      publishedAt: new Date(Date.now() + 86400000).toISOString(),
      readTime: "3 min",
    },
  });
  created.push(["posts", future.id]);

  const publicStories = await payload.find({
    collection: "stories",
    limit: 100,
    overrideAccess: false,
    where: { name: { in: [draftName, liveName] } },
  });
  const publicNames = publicStories.docs.map((doc) => doc.name);
  if (publicNames.includes(draftName)) {
    throw new Error("Unpublished story leaked through access.read.");
  }
  if (!publicNames.includes(liveName)) {
    throw new Error("Published story was hidden from public read.");
  }

  const publicFuture = await payload.find({
    collection: "posts",
    limit: 5,
    overrideAccess: false,
    where: { slug: { equals: futureSlug } },
  });
  if (publicFuture.docs.length) {
    throw new Error("Future-dated post leaked through access.read.");
  }

  console.log("CMS-path access smoke passed.");
} catch (error) {
  failed = true;
  console.error(error);
} finally {
  const cleanup = Promise.all(
    created
      .reverse()
      .map(([collection, id]) =>
        payload.delete({ collection, id, overrideAccess: true }).catch(() => undefined),
      ),
  );
  await Promise.race([cleanup, new Promise((resolve) => setTimeout(resolve, 8000))]);
}

process.exit(failed ? 1 : 0);
