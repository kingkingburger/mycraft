import { execFileSync } from "node:child_process";

const port = readPort(process.env.PORT);
const pids = findPidsByPort(port);

if (pids.length === 0) {
  console.log(`No process is listening on ${port}.`);
  process.exit(0);
}

for (const pid of pids) {
  if (pid === process.pid) continue;
  killTree(pid);
  console.log(`Stopped process tree ${pid} on port ${port}.`);
}

function readPort(value) {
  const parsed = Number(value ?? 8048);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`Invalid PORT: ${value}`);
  }

  return parsed;
}

function findPidsByPort(port) {
  if (process.platform === "win32") {
    const output = execFileSync("netstat", ["-ano", "-p", "tcp"], { encoding: "utf8" });
    return [...new Set(
      output
        .split(/\r?\n/)
        .filter((line) => line.includes(`:${port} `) && line.includes("LISTENING"))
        .map((line) => Number(line.trim().split(/\s+/).at(-1)))
        .filter(Number.isInteger),
    )];
  }

  try {
    const output = execFileSync("lsof", ["-ti", `tcp:${port}`], { encoding: "utf8" });
    return output
      .split(/\r?\n/)
      .map((line) => Number(line.trim()))
      .filter(Number.isInteger);
  } catch {
    return [];
  }
}

function killTree(pid) {
  if (process.platform === "win32") {
    execFileSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
    return;
  }

  process.kill(pid, "SIGTERM");
}
