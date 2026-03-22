import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "@coffee-ui/ui/separator";

const meta = {
  title: "Primitives/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    decorative: { control: "boolean" },
  },
  args: {
    orientation: "horizontal",
    decorative: true,
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-64 space-y-3">
      <p className="text-sm text-stone-600">Section one</p>
      <Separator {...args} />
      <p className="text-sm text-stone-600">Section two</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-10 items-stretch gap-3">
      <span className="flex items-center text-sm">Left</span>
      <Separator {...args} />
      <span className="flex items-center text-sm">Right</span>
    </div>
  ),
};

export const Semantic: Story = {
  args: { decorative: false, orientation: "horizontal" },
  render: (args) => (
    <div className="w-64 space-y-3">
      <p className="text-sm">Content before</p>
      <Separator {...args} />
      <p className="text-sm">Content after</p>
    </div>
  ),
};
