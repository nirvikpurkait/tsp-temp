import axios, { AxiosError } from "axios";
import fse from "fs-extra";
import { exec, execSync } from "node:child_process";
import fs from "node:fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { prompt } from "enquirer";
import path from "node:path";
import { CliError } from "./use-utility";
import { promisify } from "node:util";
import { templateNameMetaData } from "./data";

const execAsync = promisify(exec);

type PackageManager = "npm" | "pnpm" | "yarn";

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
        templateNameMetaData
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
      choices: Object.values(templateNameMetaData).map(
        (t) => t.templateUserFacingName
      ),
      result: (value: string): string => {
        return Object.values(templateNameMetaData).reduce<string>(
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
    // TODO: implement clierror, `E_NO_EMPTY_DIR`
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
      // TODO: impelement internal cli error `E_INTERNAL`
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
  let isExpensiveWay: boolean = false;

  try {
    if (!(argv instanceof Promise)) {
      // the last value provided by the user with `--template-source` cli option
      templateSource = argv["template-source"] as string;
      // the last value provided by the user with `--expensive-way` cli option
      isExpensiveWay = argv["expensive-way"] as boolean;
    }

    // if git repo is remote repo and `.git` is not included at the end
    if (
      templateSource &&
      templateSource.startsWith("https://") &&
      !templateSource.endsWith(".git")
    ) {
      // add `.git` at the end
      templateSource = `${templateSource}.git`;
    }

    templateSource =
      templateSource ?? "https://github.com/nirvikpurkait/tsp-temp.git";

    // make the project folder as current working directory
    process.chdir(createdProjectDir);

    // if repoo is a remote repo
    if (templateSource.startsWith("https://")) {
      const repositoryOwner = templateSource.split("/")[3];
      let repositoryName = templateSource.split("/")[4].split(".git")[0];

      // decide what kind of remote repo is
      let remoteRepositoryProvider: "github" | "gitlab" | "local" = (() => {
        switch (templateSource.split("/")[2]) {
          case "github.com":
            return "github";
          case "gitlab.com":
            return "gitlab";
          default:
            return "local";
        }
      })();

      // template is being created by below process, ignore building with expensive way
      isExpensiveWay = false;

      if (remoteRepositoryProvider === "github") {
        const API_BASE = "https://api.github.com";

        // the last value provided by the user with `--template-branch` cli option
        let BRANCH: string | undefined;

        if (!(argv instanceof Promise)) {
          // default branch frome where the template should be fetched
          BRANCH = (argv["template-branch"] as string) ?? "main";
        }

        async function downloadFilesFromGitHub(
          filePathOnGitHub = template,
          localPath = process.cwd()
        ) {
          // github content url
          const url = `${API_BASE}/repos/${repositoryOwner}/${repositoryName}/contents/${filePathOnGitHub}?ref=${BRANCH}`;

          type TGitHubApiResponse = {
            name: string;
            path: string;
            sha: string;
            size: number;
            url: string;
            html_url: string;
            git_url: string;
            download_url: string | null;
            type: "file" | "dir";
            _links: {
              self: string;
              git: string;
              html: string;
            };
          }[];

          // get list of content
          const data: TGitHubApiResponse = await axios
            .get(url, {
              headers: { Accept: "application/vnd.github.v3+json" },
            })
            .then((res) => {
              return res.data;
            })
            .catch((e) => {
              if (e instanceof AxiosError) {
                throw new CliError(
                  "E_NO_TEMP_SOURCE",
                  `The template source you have provided does not exists\n\n"${BRANCH}" is assumed as default branch,\n\nIf this repo has a different branch as default branch pass it with --template-branch=<branch-name>\n\n`
                );
              }
            });

          for (const file of data) {
            // if item is file, download it
            if (file.type === "file") {
              const fileRes = await axios.get(file.download_url!, {
                responseType: "arraybuffer",
              });
              await fse.outputFile(`${localPath}/${file.name}`, fileRes.data);
            } else if (file.type === "dir") {
              // if item is folder, recursively fetch with much more depth
              await downloadFilesFromGitHub(
                file.path,
                `${localPath}/${file.name}`
              );
            }
          }
        }

        try {
          await downloadFilesFromGitHub();
        } catch (error) {
          if (error instanceof CliError) throw error;
          if (error instanceof AxiosError) throw new CliError("E_INTERNAL");
        }
      }

      if (remoteRepositoryProvider === "gitlab") {
        const GITLAB_PROJECT = `${repositoryOwner}/${repositoryName}`;
        const TARGET_FOLDER = `${template}`;
        // default branch frome where the template should be fetched
        // the last value provided by the user with `--template-branch` cli option
        let BRANCH: string | undefined;

        if (!(argv instanceof Promise)) {
          // default branch frome where the template should be fetched
          BRANCH = (argv["template-branch"] as string) ?? "main";
        }

        const API_BASE = "https://gitlab.com/api/v4";
        const RAW_BASE = "https://gitlab.com";

        type TGitLabApiResponse = {
          id: string;
          name: string;
          type: "blob" | "tree";
          path: string;
          mode: string;
        }[];

        async function downloadFilesFromGitLab(
          templateToDownload: string = TARGET_FOLDER,
          localPath = process.cwd()
        ) {
          const url = new URL(
            `${API_BASE}/projects/${encodeURIComponent(
              GITLAB_PROJECT
            )}/repository/tree`
          );
          url.searchParams.set("path", templateToDownload);

          const data: TGitLabApiResponse = await axios
            .get(url.toString())
            .then((res) => res.data)
            .catch((e) => {
              if (e instanceof AxiosError) {
                throw new CliError(
                  "E_NO_TEMP_SOURCE",
                  `The template source you have provided does not exists\n\n"${BRANCH}" is assumed as default branch,\n\nIf this repo has a different branch as default branch pass it with --template-branch=<branch-name>\n\n`
                );
              }
            });

          for (const item of data) {
            // if item is file, download it
            if (item.type === "blob") {
              const fileUrl = `${RAW_BASE}/${GITLAB_PROJECT}/-/raw/${BRANCH}/${item.path}`;

              const fileRes = await axios.get(fileUrl);

              await fse.outputFile(
                `${localPath}/${trimPath(item.path, template)}`,
                fileRes.data
              );
            } else if (item.type === "tree") {
              // if item is folder, recursively fetch with much more depth
              await downloadFilesFromGitLab(item.path, localPath);
            }
          }
        }

        try {
          await downloadFilesFromGitLab();
        } catch (error) {
          throw new CliError("E_INTERNAL");
        }
      }
    }

    // TODO: implement optimized way like github for gitlab and bitbucket

    // if the repo is local repo
    if (isExpensiveWay) {
      let repositoryName = templateSource
        .split("/")
        .reduce<string>((acc, curr) => {
          if (curr.endsWith(".git")) {
            acc = curr.split(".git")[0];
            return acc;
          }
          return acc;
        }, "");
      // clone the repo locally
      await execAsync(`git clone ${templateSource}`, {
        cwd: createdProjectDir,
      }).catch(() => {
        throw new CliError("E_NO_TEMP_SOURCE");
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
          throw new CliError("E_DIR_NOT_EXIST");
        });

      for (const eachFileOrFolder of copiedFilesAndFolders) {
        const srcPath = path.join(dirToCopyFrom, eachFileOrFolder.name);
        const destPath = path.join(dirToPasteInto, eachFileOrFolder.name);

        // move the files into new project
        await fs.rename(srcPath, destPath).catch(() => {
          throw new CliError("E_MOVE_RES");
        });
      }

      // delete force-recursively actual repo
      await fs
        .rm(path.join(createdProjectDir, repositoryName), {
          force: true,
          recursive: true,
        })
        .catch(() => {
          throw new CliError("E_REM_TEMP_SOURCE");
        });
    }

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

    // return to the directory from where the `tsp-temp` was run
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
        case "E_REM_TEMP_SOURCE":
          await fs.rm(path.join(process.cwd(), projectName), {
            force: true,
            recursive: true,
            retryDelay: 10,
          });
          process.stdout.write(`${error.message}\n`);
          process.stdout.write(`Please run the command again.\n`);
          process.exit();

        case "E_INTERNAL":
          await fs.rm(path.join(process.cwd(), projectName), {
            force: true,
            recursive: true,
          });
          process.stdout.write(`${error.message}\n`);
          process.stdout.write(`Please run the command again.\n`);
          process.exit();

        case "E_MOVE_RES":
          await fs.rm(path.join(process.cwd(), projectName), {
            force: true,
            recursive: true,
          });
          process.stdout.write(`${error.message}\n`);
          process.stdout.write(`Please run the command again.\n`);
          process.exit();

        case "E_DIR_NOT_EXIST":
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

        case "E_NO_TEMP_SOURCE":
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

function trimPath(fullPath: string, removingPortion: string) {
  let trimmingLength;
  trimmingLength =
    removingPortion.endsWith("/") && removingPortion.startsWith("/")
      ? removingPortion.length - 1
      : removingPortion.endsWith("/") || removingPortion.startsWith("/")
      ? removingPortion.length
      : removingPortion.length + 1;

  return fullPath.substring(trimmingLength);
}

export {};
