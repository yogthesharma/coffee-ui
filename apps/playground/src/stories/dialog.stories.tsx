import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@coffee-ui/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@coffee-ui/ui/dialog";
import { Input } from "@coffee-ui/ui/input";
import { Label } from "@coffee-ui/ui/label";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[16rem] items-start justify-center rounded-lg bg-muted/40 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Open dialog
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes here. Save when you’re done — overlay click or Escape closes the dialog.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-2">
            <Label htmlFor="dialog-name">Name</Label>
            <Input id="dialog-name" defaultValue="Ada Lovelace" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Controlled: Story = {
  render: function ControlledDialog() {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button">Controlled open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Controlled</DialogTitle>
              <DialogDescription>
                Open state is lifted — try closing with Escape or the overlay.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <p className="text-xs text-muted-foreground">
          Dialog open: <code className="rounded bg-muted px-1">{String(open)}</code>
        </p>
      </div>
    );
  },
};
