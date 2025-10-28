import { execSync, ExecSyncOptionsWithStringEncoding } from "child_process";

async function main() {
  console.log("🔍 Ensuring workflows generated");
  runCommand("pnpm build:workflows");

  console.log("🔍 Ensuring workflows added into version control");
  runCommand("git add scripts/workflows/*");

  console.log("🔍 Ensuring template lockfiles are not included");
  runCommand(
    "git reset templates/*/package-lock.json templates/*/pnpm-lock.yaml templates/*/yarn.lock"
  );
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});

type RunCommandOptions = Omit<ExecSyncOptionsWithStringEncoding, "encoding"> &
  Partial<Pick<ExecSyncOptionsWithStringEncoding, "encoding">>;
function runCommand(
  cmd: string,
  options: RunCommandOptions = {} as RunCommandOptions
) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf-8", ...options }).trim();
}
