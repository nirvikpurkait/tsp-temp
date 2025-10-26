# `tsp-temp`

`tsp-temp` is a cli tool to extract a template/folder from a git repository.

## Usage

#### with npm

```
npx tsp-temp <project-name>
```

#### with pnpm

```
pnpm dlx tsp-temp <project-name>
```

#### with yarn

```
yarn dlx tsp-temp <project-name>
```

## Options

| Options             | Alias | Description                                                                                                    | Type    |
| :------------------ | :---- | :------------------------------------------------------------------------------------------------------------- | ------- |
| `--version`         | `-v`  | Shows version of the tool                                                                                      | boolean |
| `--help`            | `-h`  | Shows help menu                                                                                                | boolean |
| `--package-manager` | `-P`  | Provide package manager to work with (Currently supports npm, pnpm, yarn)                                      | string  |
| `--template`        | `-t`  | Provide a template on basis of which new project should be created                                             | string  |
| `--template-source` |       | Provide a remote repository of template to use. Only use it with custom template other than provided templates | string  |
| `--skip-install`    |       | Skips installation of dependencies                                                                             | boolean |

# Project structure

- **Template -** All templates are at `templates/*` each template name should be on `kebab-case`

- **CLI-Tool -** All cli-tool related source is on `scripts/bin/*`

- **Workflow -** Workflow related scripts on `scripts/workflows/*` (as I am much more comfortable on JS/TS rather than `yaml`'s complex process)

- **Git Hook -** Git hook related scripts on `scripts/hooks/*` (as I am much more comfortable on JS/TS rather than `bash` or `powershell` script's complex process)

# Adding new template

You are free to add any template for yourself and others too.

Before adding any new template test the template locally, to ensure it works or not.

# Case convention

| Case         | Example      | Case         | Example      |
| :----------- | :----------- | :----------- | ------------ |
| `kebab-case` | `kebab-case` | `PascalCase` | `PascalCase` |
| `camelCase`  | `camelCase`  | `snake_case` | `snake_case` |
