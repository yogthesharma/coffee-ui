import type { Meta, StoryObj } from "@storybook/react";
import { VisuallyHidden } from "@coffee-ui/ui/visually-hidden";
import { Button } from "@coffee-ui/ui/button";

const meta = {
  title: "Primitives/VisuallyHidden",
  component: VisuallyHidden,
  tags: ["autodocs"],
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Button type="button" variant="outline">
      <VisuallyHidden>Search the site</VisuallyHidden>
      <span aria-hidden>⌕</span>
    </Button>
  ),
};
