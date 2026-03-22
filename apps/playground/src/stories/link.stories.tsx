import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "@coffee-ui/ui/link";

const meta = {
  title: "Primitives/Link",
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "muted", "subtle"],
    },
  },
  args: {
    href: "https://example.com",
    children: "Example link",
    variant: "default",
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Muted: Story = {
  args: { variant: "muted" },
};

export const Subtle: Story = {
  args: { variant: "subtle" },
};

export const External: Story = {
  args: {
    href: "https://example.com",
    target: "_blank",
    rel: "noreferrer",
    children: "Opens in new tab",
  },
};
