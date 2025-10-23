import {
  test,
  expect,
  describe,
  afterAll,
  beforeAll,
  beforeEach,
} from "vitest";
import child_process from "child_process";
import path from "path";
import fs from "fs/promises";
import { promisify } from "util";

const execFile = promisify(child_process.execFile);
const exec = promisify(child_process.exec);

const rootDir = process.cwd();

describe("test tsp-temp cli app", async () => {
  beforeAll(async () => {
    // before testing install package locally
    await exec("npm link");
  }, 120_000);

  afterAll(async () => {
    // after testing uninstall the package
    await exec("npm un tsp-temp -g");
  }, 120_000);

  beforeEach(async () => {
    // create an empty "test-result" temp dir
    await fs.rm(path.join(rootDir, "test-result"), {
      recursive: true,
      force: true,
    });

    await fs.mkdir(path.join(rootDir, "test-result"));
  });

  test("creates a new folder", async () => {
    await exec("npx tsp-temp", {
      cwd: path.join(rootDir, "test-result"),
    });
  }, 120_000);
});
