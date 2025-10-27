import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import packageJson from "../../package.json";

export function showOptions() {
  yargs(hideBin(process.argv))
    .scriptName("tsp-temp")
    .usage("Usage:")
    // --- Commands ---
    .command("<foo>", "Start <foo> project")
    // --- Help and version ---
    .help("help")
    .alias("h", "help")
    .version(packageJson.version)
    .alias("v", "version")
    // --- Options ---
    .option("package-manager", {
      alias: "P",
      describe:
        "Provide package manager to work with\n(Currently supports npm, pnpm, yarn)",
      type: "string",
    })
    .option("template", {
      alias: "t",
      describe:
        "Provide a template on basis of which new project should be created",
      type: "string",
    })
    .option("template-source", {
      describe:
        "Provide a remote repository of template to use. Only use it with custom template other than provided templates",
      type: "string",
    })
    .option("template-branch", {
      describe:
        "Provide repository branch to generate from. Only use it with custom template other than provided templates",
      type: "string",
    })
    .option("skip-install", {
      describe: "Skips installation of dependencies",
      type: "boolean",
    })
    .option("expensive-way", {
      describe:
        "Creates template in an expensive way, if the provided remote source is not supported by cli.\nIt might fail as well.\nProviding support for other remote source is under way",
      type: "boolean",
    })
    // .option("assets", {
    //   alias: "a",
    //   describe:
    //     "Provides assets for templates.\n(You should call it from where you want the assets only)\n(Only '.vscode' is available right now)",
    //   type: "string",
    // })
    // .option("asset-type", {
    //   alias: "A",
    //   describe: "Only 'snippet' is available right now",
    //   type: "string",
    // })
    .epilog("For more info, visit https://example.com/docs")
    .parse();
}

export type CliErrorCode =
  | "E_INTERNAL"
  | "E_NO_EMPTY_DIR"
  | "E_MOVE_RES"
  | "E_REM_TEMP_SOURCE"
  | "E_DIR_NOT_EXIST"
  | "E_NO_TEMP_SOURCE";

export class CliError extends Error {
  code: CliErrorCode;
  message: string;

  constructor(code: CliErrorCode, message?: string) {
    super();

    this.code = code;
    this.message = message ?? this.__generatedMessage();
  }

  private __generatedMessage() {
    switch (this.code) {
      case "E_DIR_NOT_EXIST":
        return "The template path you have provided does not exists";
      case "E_INTERNAL":
        return "Uh-uh, Something went wrong internally";
      case "E_MOVE_RES":
        return "Uh-uh, Something went wrong while moving resources to right location";
      case "E_NO_EMPTY_DIR":
        return "Projct exists with some files, please clean the project to start a new one";
      case "E_REM_TEMP_SOURCE":
        return "Uh-uh, Something went wrong while templating your project";
      case "E_NO_TEMP_SOURCE":
        return "The template source you have provided does not exists";
    }
  }
}

// type TryCatchResult<T> = [T, null] | [null, Error];

// export function tryCatch<TFn extends () => any>(
//   fn: TFn
// ): ReturnType<TFn> extends Promise<infer U>
//   ? Promise<TryCatchResult<U>>
//   : TryCatchResult<ReturnType<TFn>> {
//   try {
//     const result = fn();

//     if (result instanceof Promise) {
//       return result
//         .then((data) => [data, null] as TryCatchResult<any>)
//         .catch((err) => [null, err] as TryCatchResult<any>) as any;
//     }

//     return [result, null] as any;
//   } catch (err) {
//     return [null, err as Error] as any;
//   }
// }
