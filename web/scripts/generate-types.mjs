import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "./load-env.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.env.PAYLOAD_TS_OUTPUT_PATH = path.join(root, "src", "payload-types.ts");
loadEnv(root);
const imported = await import(pathToFileURL(path.join(root, "scripts", ".payload.config.bundle.mjs")).href);
const config = await imported.default;
const { generateTypes } = await import("payload/node");
await generateTypes(config);
