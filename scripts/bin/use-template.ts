import { exec, execSync } from "node:child_process";
import fs from "node:fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { prompt } from "enquirer";
import path from "node:path";
import { CliError } from "./use-utility";
import { promisify } from "node:util";

const execAsync = promisify(exec);

type PackageManager = "npm" | "pnpm" | "yarn";

/**
 * the key is shown to user to select
 * the value is used in program
 */
const templateNameMapping: Record<
  string,
  { templateName: string; templatePath: string; templateUserFacingName: string }
> = {
  nextjs: {
    templateName: "nextjs",
    templatePath: "templates/nextjs",
    templateUserFacingName: "Next.Js",
  },
  "react-router-v7": {
    templateName: "react-router-v7",
    templatePath: "templates/react-router-v7",
    templateUserFacingName: "React Router v7",
  },
  "vanila-ts": {
    templateName: "vanila-ts",
    templatePath: "templates/vanila-ts",
    templateUserFacingName: "Vanila TS",
  },
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
    // the last value provided by the user with `--package-manager` or `-P` cli option
    const latestMentionedPackageManeger = Object.keys(argv).reduce<
      string | undefined
    >((acc, curr) => {
      if (curr === "packageManager" || curr === "P") {
        acc = argv[curr] as string;
      }

      return acc;
    }, undefined);

    switch (latestMentionedPackageManeger) {
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

let selectedTemplatePath: string | undefined = (() => {
  if (!(argv instanceof Promise)) {
    // the last value provided by the user with `--template` or `-t` cli option
    const latestMentionedTemplate = Object.keys(argv).reduce<
      string | undefined
    >((acc, curr) => {
      if (curr === "template" || curr === "t") {
        acc = argv[curr] as string;
      }
      return acc;
    }, undefined);

    if (latestMentionedTemplate) {
      const latestMentionedTemplatePath = Object.values(
        templateNameMapping
      ).reduce<string>((acc, curr) => {
        if (curr.templateName === latestMentionedTemplate) {
          acc = curr.templatePath;
        }
        return acc;
      }, latestMentionedTemplate);

      // if a valid value is provide with `-t` or `--template` option
      // it maps to correct template path
      return latestMentionedTemplatePath;
    }

    // if the user has not provided any value with `-t` or `--template` option
    return undefined;
  }
})();

let projectName: string | undefined = (() => {
  if (!(argv instanceof Promise) && argv._[0]) {
    return argv._[0].toString();
  }

  return undefined;
})();

export async function useTemplate() {
  if (!isGitInstalled) return;

  const questions = [];

  if (!projectName) {
    // push question for asking
    questions.push({
      type: "input",
      message: `What will be name of your project: `,
      name: "projectName",
      required: true,
    });
  }

  if (!selectedTemplatePath) {
    // push question for asking
    questions.push({
      type: "select",
      message: "Which template you want to use?",
      name: "selectedTemplatePath",
      required: true,
      choices: Object.values(templateNameMapping).map(
        (t) => t.templateUserFacingName
      ),
      result: (value: string): string => {
        return Object.values(templateNameMapping).reduce<string>(
          (acc, curr) => {
            if (curr.templateUserFacingName === value) {
              acc = curr.templatePath;
            }
            return acc;
          },
          ""
        );
      },
    });
  }

  if (
    !packageManager ||
    !isValidValue(packageManager, ["npm", "pnpm", "yarn"])
  ) {
    // push question for asking
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
  selectedTemplatePath =
    selectedTemplatePath ?? answers["selectedTemplatePath"];
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
    // TODO: implement clierror, `ENOEMPTYDIR`
    if (!isProjectDirEmpty) {
      console.log(
        `${projectName} exists with some files, please clean the project to start a new one`
      );
      process.exit();
    }

    // if clean dir exists clone templete
    await cloneProject({ projectName, template: selectedTemplatePath });
  } else {
    // if project dir does not exists create a new directory
    await fs
      .mkdir(path.join(cwd, projectName))
      .then(() => {})
      // TODO: impelement internal cli error `EINTERNAL`
      .catch(() => {
        console.log(`Uh-uh, Something went wrong`);
      });

    await cloneProject({ projectName, template: selectedTemplatePath });
  }
}

export function isValidValue<T>(providedValue: T, expectedOutOf: T[]): boolean {
  return expectedOutOf.includes(providedValue);
}

export async function cloneProject({
  projectName,
  template,
  templateSource,
}: {
  projectName: string;
  template: string;
  templateSource?: string;
}) {
  // now work inside the project folder
  let createdProjectDir = path.join(cwd, projectName);

  try {
    if (!(argv instanceof Promise)) {
      // the last value provided by the user with `--template-source` cli option
      templateSource = Object.keys(argv).reduce<string | undefined>(
        (acc, curr) => {
          if (curr === "template-source") {
            acc = argv[curr] as string;
          }
          return acc;
        },
        undefined
      );
    }

    // if git repo is remote repo and `.git` is not included at the end
    if (
      templateSource &&
      templateSource.startsWith("https://") &&
      !templateSource.endsWith(".git")
    ) {
      templateSource = `${templateSource}.git`;
    }

    templateSource =
      templateSource ?? "https://github.com/nirvikpurkait/tsp-temp.git";

    let repositoryName = templateSource
      .split("/")
      .reduce<string>((acc, curr) => {
        if (curr.endsWith(".git")) {
          acc = curr.split(".git")[0];
          return acc;
        }
        return acc;
      }, "");

    // make the project folder as current working directory
    process.chdir(createdProjectDir);

    // clone the repo locally
    await execAsync(`git clone ${templateSource}`, {
      cwd: createdProjectDir,
    }).catch(() => {
      throw new CliError("ENOTEMPSOURC");
    });

    if (repositoryName === "") {
      const dirList = await fs.readdir(createdProjectDir);
      repositoryName = dirList[0];
    }

    const dirToCopyFrom = path.join(
      createdProjectDir,
      repositoryName,
      template
    );
    const dirToPasteInto = path.join(createdProjectDir);

    // get list of files and folders to copy
    let copiedFilesAndFolders;

    copiedFilesAndFolders = await fs
      .readdir(dirToCopyFrom, {
        withFileTypes: true,
      })
      .catch(() => {
        throw new CliError("EDIRNOEXIST");
      });

    for (const eachFileOrFolder of copiedFilesAndFolders) {
      const srcPath = path.join(dirToCopyFrom, eachFileOrFolder.name);
      const destPath = path.join(dirToPasteInto, eachFileOrFolder.name);

      // move the files into new project
      await fs.rename(srcPath, destPath).catch(() => {
        throw new CliError("EMOVERES");
      });
    }

    // delete force-recursively actual repo
    await fs
      .rm(path.join(createdProjectDir, repositoryName), {
        force: true,
        recursive: true,
      })
      .catch(() => {
        throw new CliError("EREMTEMPSOUR");
      });

    let shouldSkipInstallDependencies: boolean | undefined;

    if (!(argv instanceof Promise)) {
      // the last value provided by the user with `--skip-install` cli option
      shouldSkipInstallDependencies = Object.keys(argv).reduce<
        boolean | undefined
      >((acc, curr) => {
        if (curr === "skip-install") {
          if (argv[curr] === "true" || argv[curr] === true) {
            acc = true;
          } else {
            acc = false;
          }
        }
        return acc;
      }, undefined);
    }

    // install packages with provided pacage manager
    if (!shouldSkipInstallDependencies) {
      execSync(`${packageManager} install`, { stdio: "inherit" });
    }

    // if error return to the directory from where the `tsp-temp` was run
    process.chdir(path.join(createdProjectDir, "../"));

    const changeDir = `cd ${projectName}`;
    const devScript = `${
      packageManager === "npm" ? "npm run dev" : `${packageManager} dev`
    }`;

    process.stdout.write(
      `Project created: ${projectName}\nWhat to do now?\n\n`
    );
    process.stdout.write(`${changeDir}\n`);
    process.stdout.write(`${devScript}\n`);
  } catch (error) {
    if (error instanceof CliError) {
      // if error return to the directory from where the `tsp-temp` was run
      process.chdir(path.join(createdProjectDir, "../"));

      switch (error.code) {
        case "EREMTEMPSOUR":
          await fs.rm(path.join(process.cwd(), projectName), {
            force: true,
            recursive: true,
            retryDelay: 10,
          });
          process.stdout.write(`${error.message}\n`);
          process.stdout.write(`Please run the command again.\n`);
          process.exit();

        case "EINTERNAL":
          await fs.rm(path.join(process.cwd(), projectName), {
            force: true,
            recursive: true,
          });
          process.stdout.write(`${error.message}\n`);
          process.stdout.write(`Please run the command again.\n`);
          process.exit();

        case "EMOVERES":
          await fs.rm(path.join(process.cwd(), projectName), {
            force: true,
            recursive: true,
          });
          process.stdout.write(`${error.message}\n`);
          process.stdout.write(`Please run the command again.\n`);
          process.exit();

        case "EDIRNOEXIST":
          await fs.rm(path.join(process.cwd(), projectName), {
            force: true,
            recursive: true,
          });
          process.stdout.write(`${error.message}\n`);
          process.stdout.write(
            `Please run the command again with right template path.\n`
          );
          process.stdout.write(
            `If you are confused you can use provided template with the tool.\n`
          );
          process.exit();

        case "ENOTEMPSOURC":
          await fs.rm(path.join(process.cwd(), projectName), {
            force: true,
            recursive: true,
          });
          process.stdout.write(`${error.message}\n`);
          process.stdout.write(
            `Please run the command again with right template source.\n`
          );
          process.stdout.write(
            `If you are confused you can use provided template with the tool.\n`
          );
          process.exit();
      }
    }
  }
  process.exit();
}

export {};
