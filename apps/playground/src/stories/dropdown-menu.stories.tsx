import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@coffee-ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@coffee-ui/ui/dropdown-menu";

const meta = {
  title: "Components/Dropdown menu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="flex min-h-[14rem] items-start justify-center rounded-lg bg-muted/40 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline">
          Open menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => undefined}>Profile</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => undefined}>Billing</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => undefined}>Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => undefined}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const StayOpenOnSelect: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="secondary" size="sm">
          With non-closing item
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          Stays open (preventDefault)
        </DropdownMenuItem>
        <DropdownMenuItem>Closes as usual</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Controlled: Story = {
  render: function ControlledMenu() {
    const [open, setOpen] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button type="button">Controlled</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setOpen(false)}>Close via select</DropdownMenuItem>
            <DropdownMenuItem>Another action</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <p className="text-xs text-muted-foreground">
          Open: <code className="rounded bg-muted px-1">{String(open)}</code>
        </p>
      </div>
    );
  },
};
