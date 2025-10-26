import { execSync, ExecSyncOptionsWithStringEncoding } from "child_process";

type RunCommandOptions = ExecSyncOptionsWithStringEncoding;
function runCommand(
  cmd: string,
  options: RunCommandOptions = {} as RunCommandOptions
) {
  return execSync(cmd, { ...options, stdio: "pipe", encoding: "utf-8" }).trim();
}

async function main() {
  console.log("🔍 Ensuring workflows generated");
  runCommand("pnpm build:workflows");

  console.log("🔍 Ensuring workflows added into version control");
  runCommand("git add scripts/workflows/*");
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
