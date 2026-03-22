import type { Meta, StoryObj } from "@storybook/react";
import { IconFolderOpen } from "@tabler/icons-react";
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@coffee-ui/ui/empty-state";
import { Button } from "@coffee-ui/ui/button";

const meta = {
  title: "Components/Empty state",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,24rem)] rounded-lg bg-muted/40 p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <EmptyState>
      <EmptyStateIcon>
        <IconFolderOpen stroke={1.5} />
      </EmptyStateIcon>
      <EmptyStateTitle>No projects yet</EmptyStateTitle>
      <EmptyStateDescription>
        Create a project to organize your work, or ask a teammate to invite you.
      </EmptyStateDescription>
      <EmptyStateActions>
        <Button type="button">New project</Button>
        <Button type="button" variant="outline">
          Browse templates
        </Button>
      </EmptyStateActions>
    </EmptyState>
  ),
};

export const Minimal: Story = {
  render: () => (
    <EmptyState>
      <EmptyStateTitle>Nothing to show</EmptyStateTitle>
      <EmptyStateDescription>Try adjusting filters or check back later.</EmptyStateDescription>
    </EmptyState>
  ),
};
