"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
async function main() {
    console.log("git fetch --tags");
    console.log("🔍 Fetching tags...");
    runCommand("git fetch --tags");
    const pkg = JSON.parse(fs_1.default.readFileSync("./package.json", "utf8"));
    const version = pkg.version;
    const tagName = `v${version}`;
    console.log(`📦 Package version: ${tagName}`);
    console.log("git tag -l");
    const existingTags = runCommand("git tag -l").split("\n");
    if (existingTags.includes(tagName)) {
        console.log("✅ Version already published, skipping.");
        process.exit(0);
    }
    console.log("pnpm build:cli");
    console.log("🧱 Building project...");
    runCommand("pnpm build:cli");
    console.log("npm publish --access public");
    console.log("🚀 Publishing to npm...");
    try {
        runCommand("npm publish --access public", {
            env: {
                ...process.env,
                NODE_AUTH_TOKEN: process.env.NPM_TOKEN,
            },
            encoding: "utf-8",
        });
    }
    catch (err) {
        console.error("❌ npm publish failed:");
        process.exit(1);
    }
    console.log("🏷️ Creating and pushing tag...");
    runCommand('git config user.name "github-actions[bot]"');
    runCommand('git config user.email "github-actions[bot]@users.noreply.github.com"');
    runCommand(`git tag ${tagName}`);
    runCommand(`git push origin ${tagName}`);
    console.log("✅ Published and tagged successfully!");
}
main().catch((err) => {
    console.error("❌ Failed:", err);
    process.exit(1);
});
function runCommand(cmd, options = {}) {
    return (0, child_process_1.execSync)(cmd, { ...options, stdio: "pipe", encoding: "utf-8" }).trim();
}
