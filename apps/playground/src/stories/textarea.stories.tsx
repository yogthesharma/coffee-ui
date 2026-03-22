import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@coffee-ui/ui/textarea";
import { Label } from "@coffee-ui/ui/label";

const meta = {
  title: "Primitives/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  args: {
    placeholder: "Write something…",
    size: "default",
  },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,24rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Disabled" },
};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "This needs fixing.",
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="field-bio">Bio</Label>
      <Textarea id="field-bio" rows={4} {...args} />
    </div>
  ),
};
