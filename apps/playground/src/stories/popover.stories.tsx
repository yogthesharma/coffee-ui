import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@coffee-ui/ui/button";
import { Input } from "@coffee-ui/ui/input";
import { Label } from "@coffee-ui/ui/label";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@coffee-ui/ui/popover";

const meta = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[14rem] items-start justify-center rounded-lg bg-muted/40 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline">
          Open popover
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-2">
          <h4 className="font-medium leading-none">Dimensions</h4>
          <p className="text-sm text-muted-foreground">
            Set width and height for the layer. Click outside or press Escape to dismiss.
          </p>
          <div className="grid gap-2 pt-1">
            <div className="grid grid-cols-3 items-center gap-2">
              <Label htmlFor="w">Width</Label>
              <Input className="col-span-2 h-8" id="w" defaultValue="100%" />
            </div>
            <div className="grid grid-cols-3 items-center gap-2">
              <Label htmlFor="h">Height</Label>
              <Input className="col-span-2 h-8" id="h" defaultValue="25px" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const CustomAnchor: Story = {
  render: () => (
    <Popover>
      <div className="flex flex-wrap items-center gap-2">
        <PopoverAnchor asChild>
          <span className="rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
            Anchor box
          </span>
        </PopoverAnchor>
        <PopoverTrigger asChild>
          <Button type="button" size="sm" variant="secondary">
            Toggle
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent side="bottom" align="start">
        <p className="text-sm">
          Content is positioned against the <strong>anchor</strong>, not the button.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

export const Controlled: Story = {
  render: function ControlledPopover() {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button type="button">Controlled</Button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-sm text-muted-foreground">Popover is controlled from React state.</p>
            <Button className="mt-3" size="sm" type="button" onClick={() => setOpen(false)}>
              Close
            </Button>
          </PopoverContent>
        </Popover>
        <p className="text-xs text-muted-foreground">
          Open: <code className="rounded bg-muted px-1">{String(open)}</code>
        </p>
      </div>
    );
  },
};
