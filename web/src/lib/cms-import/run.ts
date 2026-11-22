/**
 * Repeatable import of the code pages and chrome into the CMS.
 * Entry point for scripts/import-pages.mjs (bundled with esbuild). The
 * caller owns every safety guard; this module only reads and writes through
 * the Payload Local API it is given, always with overrideAccess.
 */
import { agencyEnabled } from "@/lib/features";
import { buildFooterGlobal, buildHeaderGlobal } from "./chrome-import";
import {
  FOOTER_FIELDS,
  HEADER_FIELDS,
  footerComparable,
  headerComparable,
  isBlankGlobal,
  pageComparable,
  sameContent,
} from "./compare";
import { buildImportPages } from "./page-import";
import { emptyCounts, outcomeOf, planImport, summaryLine, type ImportAction, type ImportCounts, type ImportFlags } from "./plan";

type Doc = Record<string, unknown>;

/** The slice of the Payload Local API the import uses. */
export type ImportPayload = {
  find(args: Record<string, unknown>): Promise<{ docs: Doc[] }>;
  create(args: Record<string, unknown>): Promise<Doc>;
  update(args: Record<string, unknown>): Promise<Doc>;
  findGlobal(args: Record<string, unknown>): Promise<Doc>;
  updateGlobal(args: Record<string, unknown>): Promise<Doc>;
};

export type RunOptions = { flags: ImportFlags; log?: (line: string) => void; agencyEnabled?: boolean };

function writeData(data: Doc, publish: boolean): Doc {
  return publish ? { ...data, _status: "published" } : data;
}

export async function runImport(payload: ImportPayload, options: RunOptions): Promise<ImportCounts> {
  const { flags } = options;
  const log = options.log ?? (() => {});
  const agency = options.agencyEnabled ?? agencyEnabled;
  const counts = emptyCounts();
  const prefix = flags.dryRun ? "[dry-run] " : "";

  const record = (label: string, action: ImportAction) => {
    counts[outcomeOf[action]] += 1;
    const note = action === "skip" ? " (differs from the CMS; use --overwrite to replace)" : "";
    log(`${prefix}${label}: ${outcomeOf[action]}${note}`);
  };

  for (const page of buildImportPages({ agencyEnabled: agency })) {
    const label = `page "${page.slug}"`;
    const found = await payload.find({
      collection: "pages",
      where: { slug: { equals: page.slug } },
      draft: true,
      depth: 0,
      limit: 1,
      overrideAccess: true,
    });
    const existing = found.docs[0];
    const action = planImport(
      { exists: Boolean(existing), same: existing ? sameContent(pageComparable(existing), pageComparable(page)) : false, status: existing?._status as string | undefined },
      flags,
    );
    if (!flags.dryRun) {
      if (action === "create") {
        await payload.create({ collection: "pages", data: writeData(page, flags.publish), draft: !flags.publish, overrideAccess: true });
      } else if (action === "update" || action === "publish") {
        await payload.update({ collection: "pages", id: existing.id, data: writeData(page, flags.publish), draft: !flags.publish, overrideAccess: true });
      }
    }
    record(label, action);
  }

  const globals = [
    { slug: "header", data: buildHeaderGlobal({ agencyEnabled: agency }) as Doc, comparable: headerComparable, fields: HEADER_FIELDS },
    { slug: "footer", data: buildFooterGlobal({ agencyEnabled: agency }) as Doc, comparable: footerComparable, fields: FOOTER_FIELDS },
  ] as const;

  for (const entry of globals) {
    const stored = await payload.findGlobal({ slug: entry.slug, draft: true, depth: 0, overrideAccess: true }).catch(() => null);
    const blank = !stored || isBlankGlobal(stored, entry.fields);
    const action = planImport(
      { exists: !blank, same: blank ? false : sameContent(entry.comparable(stored), entry.comparable(entry.data)), status: stored?._status as string | undefined },
      flags,
    );
    if (!flags.dryRun && (action === "create" || action === "update" || action === "publish")) {
      await payload.updateGlobal({ slug: entry.slug, data: writeData(entry.data, flags.publish), draft: !flags.publish, overrideAccess: true });
    }
    record(`global "${entry.slug}"`, action);
  }

  log(`${prefix}${summaryLine(counts)}`);
  return counts;
}
