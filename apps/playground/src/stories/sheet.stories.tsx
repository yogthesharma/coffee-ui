import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@coffee-ui/ui/button";
import { Input } from "@coffee-ui/ui/input";
import { Label } from "@coffee-ui/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@coffee-ui/ui/sheet";

const meta = {
  title: "Components/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="flex min-h-[16rem] items-start justify-center rounded-lg bg-muted/40 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline">
          Open sheet
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Changes apply to your workspace. Escape or the overlay closes the sheet.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-2">
            <Label htmlFor="sheet-name">Display name</Label>
            <Input id="sheet-name" placeholder="Your name" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <Button type="button">Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="secondary">
          From the left
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Example panel anchored on the left edge.</SheetDescription>
        </SheetHeader>
        <SheetFooter className="mt-auto">
          <SheetClose asChild>
            <Button type="button" className="w-full sm:w-auto">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Controlled: Story = {
  render: function ControlledSheet() {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button type="button">Controlled sheet</Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Bottom sheet</SheetTitle>
              <SheetDescription>Good for mobile-style actions.</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <Button type="button" onClick={() => setOpen(false)}>
                Done
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <p className="text-xs text-muted-foreground">
          Open: <code className="rounded bg-muted px-1">{String(open)}</code>
        </p>
      </div>
    );
  },
};
