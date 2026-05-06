import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";

const mode = process.argv[2] === "start" ? "start" : "dev";
const port = readPort(process.env.PORT);
const host = process.env.HOST || "127.0.0.1";
const nextBin = resolveNextBin();

const child = spawn(nextBin, [mode, "-H", host, "-p", String(port)], {
  stdio: "inherit",
  env: {
    ...process.env,
    HOST: host,
    PORT: String(port),
  },
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    child.kill(signal);
  });
}

child.on("exit", (code, signal) => {
  if (signal) {
    process.exit(0);
    return;
  }

  process.exit(code ?? 0);
});

function readPort(value) {
  const parsed = Number(value ?? 8048);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`Invalid PORT: ${value}`);
  }

  return parsed;
}

function resolveNextBin() {
  const binDir = join(process.cwd(), "node_modules", ".bin");
  const candidates =
    process.platform === "win32"
      ? ["next.cmd", "next.exe", "next.bunx"]
      : ["next"];

  for (const candidate of candidates) {
    const resolved = join(binDir, candidate);
    if (existsSync(resolved)) {
      return resolved;
    }
  }

  throw new Error("Next.js binary not found. Run `bun install` first.");
}
