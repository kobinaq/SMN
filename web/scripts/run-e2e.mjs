import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";
const npxCmd = isWindows ? "npx.cmd" : "npx";
const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";
const e2eEnv = {
  ...process.env,
  CRON_SECRET: process.env.CRON_SECRET || "e2e-cron-secret",
  DATABASE_URL: process.env.PLAYWRIGHT_DATABASE_URL || "file:./payload.e2e.db",
  NEXT_PUBLIC_SITE_URL: baseURL,
  NEXT_PUBLIC_WHATSAPP_INVITE: process.env.NEXT_PUBLIC_WHATSAPP_INVITE || "https://chat.whatsapp.com/example",
  OPS_EMAIL: process.env.OPS_EMAIL || "ops@example.com",
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || "e2e-payload-secret",
  PLAYWRIGHT_BASE_URL: baseURL,
  USE_SEED_CONTENT: "true",
};

function run(command, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: "inherit", shell: isWindows, ...options });
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

async function waitForServer(url, timeoutMs = 120_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
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
    server = spawn(npmCmd, ["run", "start", "--", "--hostname", "127.0.0.1"], {
      env: e2eEnv,
      stdio: "inherit",
      shell: isWindows,
    });
    await waitForServer(baseURL);
  }

  exitCode = await run(npxCmd, ["playwright", "test", "--reporter=list"], {
    env: e2eEnv,
  });
} finally {
  if (server && !server.killed) server.kill();
}

process.exit(exitCode);
