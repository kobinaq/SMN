import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";
const npxCmd = isWindows ? "npx.cmd" : "npx";
const e2ePort = process.env.PLAYWRIGHT_PORT || "3100";
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${e2ePort}`;
const e2eEnv = {
  ...process.env,
  CRON_SECRET: process.env.CRON_SECRET || "e2e-cron-secret",
  DATABASE_URL: process.env.PLAYWRIGHT_DATABASE_URL || "file:./payload.e2e.db",
  NEXT_PUBLIC_SITE_URL: baseURL,
  NEXT_PUBLIC_WHATSAPP_INVITE: process.env.NEXT_PUBLIC_WHATSAPP_INVITE || "https://chat.whatsapp.com/example",
  OPS_EMAIL: process.env.OPS_EMAIL || "ops@example.com",
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || "e2e-payload-secret",
  PAYLOAD_DB_PUSH: "true",
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

let server;
let exitCode = 1;

try {
  if (!process.env.PLAYWRIGHT_BASE_URL) {
    const seedCode = await run(npmCmd, ["run", "seed:demo"], { env: e2eEnv });
    if (seedCode !== 0) throw new Error("Unable to seed the disposable E2E database.");
    server = spawn(npmCmd, ["run", "start", "--", "--hostname", "127.0.0.1", "--port", e2ePort], {
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
  if (server && !server.killed) server.kill();
}

process.exit(exitCode);
