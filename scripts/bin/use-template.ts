import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { prompt } from "enquirer";
import path from "node:path";

type PackageManager = "npm" | "pnpm" | "yarn";

/**
 * the key is shown to user to select
 * the value is used in program
 */
const projectNameMapping: Record<string, string> = {
  "Next.Js": "nextjs",
  "React Router v7": "react-router-v7",
  "Vanila TS": "vanila-ts",
};

const argv = yargs(hideBin(process.argv)).parse();
const cwd = process.cwd();

const isGitInstalled: boolean = (() => {
  try {
    execSync(`git -v`);
    return true;
  } catch (error) {
    console.log("Uh uh git is not installed");
    return false;
  }
})();

let packageManager: PackageManager | undefined = (() => {
  if (!(argv instanceof Promise)) {
    const args = Object.keys(argv).filter(
      (a) => a === "packageManager" || a === "P"
    );

    const latestPackageManegerArg = args[args.length - 1];

    switch (argv[latestPackageManegerArg]) {
      case "npm":
        return "npm";
      case "pnpm":
        return "pnpm";
      case "yarn":
        return "yarn";
      default:
        return undefined;
    }
  }
  return undefined;
})();

let selectedTemplate: string | undefined = (() => {
  if (!(argv instanceof Promise)) {
    const args = Object.keys(argv).filter((a) => a === "template" || a === "t");

    const latestTemplateArg = args[args.length - 1];
    return argv[latestTemplateArg] as string;
  }
  return undefined;
})();

let projectName: string | undefined = (() => {
  if (!(argv instanceof Promise) && argv._[0]) {
    return argv._[0].toString();
  }

  return;
})();

export async function useTemplate() {
  if (!isGitInstalled) return;

  const questions = [];

  if (!projectName) {
    questions.push({
      type: "input",
      message: `What will be name of your project: `,
      name: "projectName",
      required: true,
      result: (value: string) => {
        return projectNameMapping[value];
      },
    });
  }

  if (
    !selectedTemplate ||
    !isValidValue(selectedTemplate, Object.values(projectNameMapping))
  ) {
    questions.push({
      type: "select",
      message: "Which template you want to use?",
      name: "selectedTemplate",
      choices: Object.keys(projectNameMapping),
      required: true,
      result: (value: string) => {
        return projectNameMapping[value];
      },
    });
  }

  if (
    !packageManager ||
    !isValidValue(packageManager, ["npm", "pnpm", "yarn"])
  ) {
    questions.push({
      type: "select",
      message: "Which package manager you want to use?",
      name: "packageManager",
      choices: ["npm", "pnpm", "yarn"],
      required: true,
    });
  }

  const answers: Record<string, string> = await prompt(questions);

  projectName = projectName ?? answers["projectName"];
  selectedTemplate = selectedTemplate ?? answers["selectedTemplate"];
  packageManager =
    packageManager ?? (answers["packageManager"] as PackageManager);

  // check if project dir exists or not
  const isProjectDirExists = await fs
    .stat(path.join(cwd, projectName))
    .then((projectDirStatus) => {
      return projectDirStatus.isDirectory();
    })
    .catch(() => {
      return false;
    });

  // if project dir exists
  if (isProjectDirExists) {
    // check if the project dir clean or not before adding files
    const isProjectDirEmpty = await fs
      .readdir(path.join(cwd, projectName))
      .then((values) => {
        return values.length === 0;
      })
      .catch(() => {
        console.log(`Uh-uh, Something went wrong`);
        process.exit();
      });

    // if project dir is not empty exit the process
    if (!isProjectDirEmpty) {
      console.log(
        `${projectName} exists with some files, please clean the project to start a new one`
      );
      process.exit();
    }

    // if clean dir exists clone templete
    await cloneProject({ projectName, templatePath: "assets" });
  } else {
    // if project dir does not exists create a new directory
    await fs
      .mkdir(path.join(cwd, projectName))
      .then(() => {})
      .catch(() => {
        console.log(`Uh-uh, Something went wrong`);
      });

    await cloneProject({ projectName, templatePath: "assets" });
  }
}

export function isValidValue<T>(providedValue: T, expectedOutOf: T[]): boolean {
  return expectedOutOf.includes(providedValue);
}

export async function cloneProject({
  projectName,
  templatePath,
  repositoryName,
  repositoryOwnerProfile,
}: {
  projectName: string;
  templatePath: string;
  repositoryName?: string;
  repositoryOwnerProfile?: string;
}) {
  // now work inside the project folder
  let newWorkingDir = path.join(cwd, projectName);

  repositoryName = repositoryName ?? "visualize-workflow";
  repositoryOwnerProfile =
    repositoryOwnerProfile ?? "https://github.com/nirvikpurkait";

  // make the project folder as current working directory
  process.chdir(newWorkingDir);

  // clone the repo locally
  execSync(`git clone ${repositoryOwnerProfile}/${repositoryName}.git`, {
    stdio: "ignore",
  });

  const dirToCopyFrom = path.join(newWorkingDir, repositoryName, templatePath);
  const dirToPasteInto = path.join(newWorkingDir);

  // get list of files and folders to copy
  const copiedFilesAndFolders = await fs.readdir(dirToCopyFrom, {
    withFileTypes: true,
  });

  for (const eachFileOrFolder of copiedFilesAndFolders) {
    const srcPath = path.join(dirToCopyFrom, eachFileOrFolder.name);
    const destPath = path.join(dirToPasteInto, eachFileOrFolder.name);

    // move the files into new project
    await fs.rename(srcPath, destPath);
  }

  // delete force-recursively actual repo
  await fs.rm(path.join(newWorkingDir, repositoryName), {
    force: true,
    recursive: true,
  });

  process.exit();
}

export {};
