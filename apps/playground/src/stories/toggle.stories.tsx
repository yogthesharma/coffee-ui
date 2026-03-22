import type { Meta, StoryObj } from "@storybook/react";
import { IconBold, IconItalic } from "@tabler/icons-react";
import { Toggle } from "@coffee-ui/ui/toggle";

const meta = {
  title: "Primitives/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["sm", "default", "lg"] },
  },
  args: {
    variant: "default",
    size: "default",
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Bold">
      <IconBold />
    </Toggle>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="inline-flex gap-1 rounded-md border border-stone-200 p-1">
      <Toggle aria-label="Bold" defaultPressed>
        <IconBold className="size-4" />
      </Toggle>
      <Toggle aria-label="Italic">
        <IconItalic className="size-4" />
      </Toggle>
    </div>
  ),
};
