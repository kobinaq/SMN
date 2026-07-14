import { spawn, spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";
const npxCmd = isWindows ? "npx.cmd" : "npx";
const e2ePort = process.env.PLAYWRIGHT_PORT || String(3100 + (process.pid % 1000));
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${e2ePort}`;
const localDatabasePath = fileURLToPath(new URL(`../payload.e2e-${process.pid}.db`, import.meta.url));
const e2eEnv = {
  ...process.env,
  CRON_SECRET: process.env.CRON_SECRET || "e2e-cron-secret",
  DATABASE_URL: process.env.PLAYWRIGHT_DATABASE_URL || `file:./payload.e2e-${process.pid}.db`,
  SITE_URL: baseURL,
  NEXT_PUBLIC_SITE_URL: baseURL,
  NEXT_PUBLIC_WHATSAPP_INVITE: process.env.NEXT_PUBLIC_WHATSAPP_INVITE || "https://chat.whatsapp.com/example",
  OPS_EMAIL: process.env.OPS_EMAIL || "ops@example.com",
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || "e2e-payload-secret",
  PAYLOAD_DB_PUSH: "true",
  AI_PROVIDER: "mock",
  AI_TUTOR_ENABLED: "true",
  AI_CONTENT_STUDIO_ENABLED: "true",
  AI_CAREER_COACH_ENABLED: "true",
  PLAYWRIGHT_BASE_URL: baseURL,
  USE_SEED_CONTENT: "true",
};

function run(command, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: "inherit", shell: isWindows, ...options });
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

async function waitForServer(url, server, timeoutMs = 120_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (server.exitCode !== null) {
      throw new Error(`E2E server exited before it was ready (code ${server.exitCode}).`);
    }
    try {
      const response = await fetch(url);
      if (response.ok || response.status < 500) return;
    } catch {
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function assertPortAvailable(url) {
  try {
    await fetch(url);
  } catch {
    return;
  }
  throw new Error(`Refusing to run E2E against occupied address ${url}. Set PLAYWRIGHT_PORT to another port.`);
}

let server;
let exitCode = 1;

try {
  if (!process.env.PLAYWRIGHT_BASE_URL) {
    await assertPortAvailable(baseURL);
    const pushCode = await run(npmCmd, ["run", "db:push"], { env: e2eEnv });
    if (pushCode !== 0) throw new Error("Unable to push schema to the disposable E2E database.");
    const seedCode = await run(npmCmd, ["run", "seed:demo"], { env: e2eEnv });
    if (seedCode !== 0) throw new Error("Unable to seed the disposable E2E database.");
    server = spawn(npmCmd, ["run", "start", "--", "--hostname", "localhost", "--port", e2ePort], {
      env: e2eEnv,
      stdio: "inherit",
      shell: isWindows,
    });
    await waitForServer(baseURL, server);
  }

  exitCode = await run(npxCmd, ["playwright", "test", "--reporter=list"], {
    env: e2eEnv,
  });
} finally {
  if (server && !server.killed) {
    if (isWindows) spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], { stdio: "ignore" });
    else server.kill("SIGTERM");
  }
  if (!process.env.PLAYWRIGHT_DATABASE_URL) for (const suffix of ["", "-shm", "-wal"]) rmSync(`${localDatabasePath}${suffix}`, { force: true });
}

process.exit(exitCode);
