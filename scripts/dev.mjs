import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const viteBin = path.join(rootDir, "node_modules", "vite", "bin", "vite.js");

const children = [
  spawn(process.execPath, [path.join(rootDir, "server", "index.mjs"), "--api-only"], {
    cwd: rootDir,
    env: { ...process.env, API_PORT: process.env.API_PORT || "8787" },
    stdio: "inherit",
  }),
  spawn(process.execPath, [viteBin, "--host", "0.0.0.0"], {
    cwd: rootDir,
    env: process.env,
    stdio: "inherit",
  }),
];

let isShuttingDown = false;

for (const child of children) {
  child.on("exit", (code, signal) => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;
    stopChildren();
    process.exit(code ?? (signal ? 1 : 0));
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  stopChildren();
}

function stopChildren() {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
}
