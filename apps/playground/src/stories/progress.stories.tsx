import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "@coffee-ui/ui/progress";
import { Label } from "@coffee-ui/ui/label";

const meta = {
  title: "Widgets/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    max: { control: { type: "number" } },
  },
  args: {
    value: 45,
    max: 100,
    size: "default",
  },
  decorators: [
    (Story) => (
      <div className="w-80 min-w-[12rem] max-w-[min(100vw-2rem,20rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: "sm", value: 60 },
};

export const Large: Story = {
  args: { size: "lg", value: 30 },
};

export const Indeterminate: Story = {
  args: { value: undefined },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="storage-progress">Storage used</Label>
      <Progress id="storage-progress" {...args} />
    </div>
  ),
};
