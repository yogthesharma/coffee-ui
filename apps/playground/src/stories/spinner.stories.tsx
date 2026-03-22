import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "@coffee-ui/ui/spinner";
import { Button } from "@coffee-ui/ui/button";

const meta = {
  title: "Primitives/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "default", "lg"] },
    tone: {
      control: "select",
      options: ["default", "onPrimary", "inherit"],
    },
  },
  args: {
    size: "default",
    tone: "default",
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = { args: { size: "sm" } };

export const Large: Story = { args: { size: "lg" } };

export const InButton: Story = {
  render: () => (
    <Button disabled className="gap-2">
      <Spinner size="sm" tone="onPrimary" label="Saving" />
      Saving…
    </Button>
  ),
};
