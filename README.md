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

---

# Options

- ### version

  **Option:** `--version`
  **Alias:** `-v`
  **Type:** `boolean`
  Shows version of the tool

- ### help

  **Option:** `--help`
  **Alias:** `-h`
  **Type:** `boolean`
  Shows help menu

- ### package-manager

  **Option:** `--package-manager`
  **Alias:** `-P`
  **Type:** `string`
  Provide package manager to work with
  (Currently supports `npm`, `pnpm`, `yarn`)

- ### template

  **Option:** `--template`
  **Alias:** `-t`
  **Type:** `string`
  Provide a template path on basis of which new project should be created
  **Available templates:**
  |Template options|Template Description|
  |-|-|
  |`nextjs`|Next.Js|
  |`react-router-v7`|React Router V7 (framework mode)|
  |`vanila-ts`|Vanila TS|

- ### template-source

  **Option:** `--template-source`
  **Type:** `string`
  **Default:** `https://github.com/nirvikpurkait/tsp-temp`
  Provide a local or remote repository of template to use.

- ### template-branch

  **Option:** `--template-branch`
  **Type:** `string`
  **Default:** `main`
  Provide repository branch to generate from.
  (Only use it with remote repository on **GitHub** and **GitLab** template)

- ### skip-install

  **Option:** `--skip-install`
  **Type:** `boolean`
  **Default:** `false`
  Skips installation of dependencies

- ### expensive-way

  **Option:** `--expensive-way`
  **Type:** `boolean`
  **Default:** `false`
  Creates template in an expensive way, if the provided remote source is not supported by cli.
  (It might fail as well. Providing support for other remote source is under way)

---

# Project structure

- **Template -** All templates are at `templates/*` each template name should be on `kebab-case`

- **CLI-Tool -** All cli-tool related source is on `scripts/bin/*`

- **Workflow -** Workflow related scripts on `scripts/workflows/*` (as I am much more comfortable on JS/TS rather than `yaml`'s complex process)

- **Git Hook -** Git hook related scripts on `scripts/hooks/*` (as I am much more comfortable on JS/TS rather than `bash` or `powershell` script's complex process)

---

# Adding new template

You are free to add any template for yourself and others too.

Before adding any new template test the template locally, to ensure it works or not.

---

# Case convention

| Case         | Example           | Case             | Example           |
| :----------- | :---------------- | :--------------- | ----------------- |
| `kebab-case` | `case-convention` | `CaseConvention` | `PascalCase`      |
| `camelCase`  | `caseConvention`  | `snake_case`     | `case_convention` |
