import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@coffee-ui/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@coffee-ui/ui/tooltip";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="flex min-h-[12rem] items-center justify-center rounded-lg bg-muted/40 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <Button type="button" variant="outline">
          Hover or focus
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const Side: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side} delayDuration={150}>
          <TooltipTrigger asChild>
            <Button type="button" size="sm" variant="secondary">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>
            Tooltip on the {side}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tooltip disabled delayDuration={0}>
      <TooltipTrigger asChild>
        <Button type="button" variant="ghost">
          No tooltip (disabled)
        </Button>
      </TooltipTrigger>
      <TooltipContent>Should not show</TooltipContent>
    </Tooltip>
  ),
};
