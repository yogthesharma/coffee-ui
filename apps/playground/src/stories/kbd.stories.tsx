import type { Meta, StoryObj } from "@storybook/react";
import { Kbd } from "@coffee-ui/ui/kbd";

const meta = {
  title: "Primitives/Kbd",
  component: Kbd,
  tags: ["autodocs"],
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <p className="text-sm text-stone-600">
      Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to search
    </p>
  ),
};

export const Sequence: Story = {
  render: () => (
    <span className="inline-flex items-center gap-1">
      <Kbd>Ctrl</Kbd>
      <span className="text-stone-400">+</span>
      <Kbd>Shift</Kbd>
      <span className="text-stone-400">+</span>
      <Kbd>P</Kbd>
    </span>
  ),
};
