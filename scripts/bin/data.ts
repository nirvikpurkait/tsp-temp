/**
 * the key is shown to user to select
 * the value is used in program
 */
export const templateNameMetaData: Record<
  string,
  {
    templateName: string;
    templatePath: string;
    templateUserFacingName: string;
  }
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
