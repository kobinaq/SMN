import { spawn } from "node:child_process";

/**
 * Runs a command with retries and a per-attempt timeout.
 *
 * Several project scripts import the esbuild-bundled Payload config, whose
 * external native module graph (payload / @payloadcms/db-sqlite / sharp)
 * occasionally fails to settle when loaded as ESM. Node then either exits with
 * code 13 ("unsettled top-level await") or the import deadlocks. Because a
 * deadlocked module stays pending in that process, the only reliable recovery
 * is to retry in a fresh process — which is what this wrapper does.
 *
 * Usage: node scripts/with-retry.mjs <command> [args...]
 * Env:   RETRY_ATTEMPTS (default 3), RETRY_TIMEOUT_MS (default 120000)
 */
const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error("[with-retry] No command provided.");
  process.exit(1);
}

const attempts = Math.max(1, Number(process.env.RETRY_ATTEMPTS || 3));
const timeoutMs = Math.max(1000, Number(process.env.RETRY_TIMEOUT_MS || 120_000));

function runOnce() {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: "inherit" });
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);
    child.on("exit", (code, signal) => {
      clearTimeout(timer);
      if (timedOut) resolve(124);
      else resolve(code == null ? (signal ? 1 : 0) : code);
    });
    child.on("error", () => {
      clearTimeout(timer);
      resolve(1);
    });
  });
}

let code = 1;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  code = await runOnce();
  if (code === 0) process.exit(0);
  if (attempt < attempts) {
    console.warn(
      `[with-retry] "${command} ${args.join(" ")}" exited ${code}; retry ${attempt}/${attempts - 1}…`,
    );
  }
}
process.exit(code);
