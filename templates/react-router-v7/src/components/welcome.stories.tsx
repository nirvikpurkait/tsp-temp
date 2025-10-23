import type { Meta, StoryObj } from "@storybook/react-vite";
import type { TypedMetaOptions } from "@/lib/storybook/sb.types";
import Welcome from "@/components/welcome";

const meta: Meta<typeof Welcome> & TypedMetaOptions = {
  component: Welcome,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Welcome>;

export const WelcomeStory: Story = {
  args: {},
};
