import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "@coffee-ui/ui/skeleton";

const meta = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "text", "circular"],
    },
  },
  args: {
    variant: "default",
  },
  decorators: [
    (Story) => (
      <div className="w-64 space-y-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "h-12 w-full",
  },
};

export const Text: Story = {
  args: { variant: "text" },
};

export const Circular: Story = {
  args: { variant: "circular", className: "h-12 w-12" },
};

export const CardPlaceholder: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-md border border-stone-200 p-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="h-10 w-10" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton variant="text" className="w-2/3" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </div>
    </div>
  ),
};
