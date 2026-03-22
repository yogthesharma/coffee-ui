import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { Input, type InputProps } from "@coffee-ui/ui/input";
import { Label } from "@coffee-ui/ui/label";

const meta = {
  title: "Primitives/Input",
  component: Input,
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
    placeholder: "Placeholder",
  },
  decorators: [
    (Story: StoryFn) => (
      <div className="w-[min(100%,20rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<InputProps>;

export default meta;
type Story = StoryObj<InputProps>;

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
    defaultValue: "bad@",
    placeholder: "Invalid email",
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="field-email">Email</Label>
      <Input id="field-email" type="email" autoComplete="email" {...args} />
    </div>
  ),
};

export const WithLabelDisabled: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="field-locked">Username</Label>
      <Input id="field-locked" disabled placeholder="Cannot edit" {...args} />
    </div>
  ),
};
