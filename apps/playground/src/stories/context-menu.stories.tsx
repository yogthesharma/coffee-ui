import type { Meta, StoryObj } from "@storybook/react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@coffee-ui/ui/context-menu";

const meta = {
  title: "Components/Context menu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="flex min-h-[14rem] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-12 text-sm text-muted-foreground">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          type="button"
          className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground shadow-sm"
        >
          Right-click here
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem onSelect={() => undefined}>Back</ContextMenuItem>
          <ContextMenuItem onSelect={() => undefined}>Forward</ContextMenuItem>
          <ContextMenuItem onSelect={() => undefined}>Reload</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onSelect={() => undefined}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
