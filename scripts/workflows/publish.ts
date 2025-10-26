import { execSync, ExecSyncOptionsWithStringEncoding } from "child_process";
import fs from "fs";

async function main() {
  console.log("🔍 Fetching tags...");
  runCommand("git fetch --tags");

  const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
  const version = pkg.version;
  const tagName = `v${version}`;
  console.log(`📦 Package version: ${tagName}`);

  const existingTags = runCommand("git tag -l").split("\n");
  if (existingTags.includes(tagName)) {
    console.log("✅ Version already published, skipping.");
    process.exit(0);
  }

  console.log("🧱 Building project...");
  runCommand("pnpm build:cli");

  console.log("🚀 Publishing to npm...");
  try {
    runCommand("npm publish --access public", {
      env: {
        ...process.env,
        NODE_AUTH_TOKEN: process.env.NPM_TOKEN,
      },
      encoding: "utf-8",
    });
  } catch (err) {
    console.error("❌ npm publish failed:");
    process.exit(1);
  }

  console.log("🏷️ Creating and pushing tag...");
  runCommand('git config user.name "github-actions[bot]"');
  runCommand(
    'git config user.email "github-actions[bot]@users.noreply.github.com"'
  );
  runCommand(`git tag ${tagName}`);
  runCommand(`git push origin ${tagName}`);

  console.log("✅ Published and tagged successfully!");
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});

type RunCommandOptions = ExecSyncOptionsWithStringEncoding;
function runCommand(
  cmd: string,
  options: RunCommandOptions = {} as RunCommandOptions
) {
  return execSync(cmd, { ...options, stdio: "pipe", encoding: "utf-8" }).trim();
}
