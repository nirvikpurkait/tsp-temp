import { DecoratorFunction } from "storybook/internal/types";

type TypedMetaOptions = Partial<{
  parameters: Partial<{
    layout: "centered" | "fullscreen" | "padded";
  }>;

  tags: ("autodocs" | "!autodocs")[];
}>;

type TypedGlobalPreview = Partial<{
  parameters: Partial<{
    options: Partial<{
      storySort: Partial<{
        order: unknown[];
      }>;
    }>;

    controls: Partial<{ matchers: Record<string, unknown> }>;

    viewport: Partial<{ options: Viewports }>;

    layout: "fullscreen" | "centered" | "padded";
  }>;

  decorators: DecoratorFunction[];
}>;

type Viewports = Record<
  string,
  {
    name: string;
    styles: { width?: `${number}px`; height?: `${number}px` };
    type?: "desktop" | "mobile" | "tablet" | "other";
  }
>;

export type { TypedMetaOptions, TypedGlobalPreview, Viewports };
