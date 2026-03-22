import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, type CheckboxProps } from "@coffee-ui/ui/checkbox";
import { Label } from "@coffee-ui/ui/label";

const meta = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    disabled: { control: "boolean" },
  },
} satisfies Meta<CheckboxProps>;

export default meta;
type Story = StoryObj<CheckboxProps>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const Disabled: Story = {
  args: { disabled: true, checked: true },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-start gap-2">
      <Checkbox id="terms" {...args} />
      <Label htmlFor="terms" className="cursor-pointer font-normal">
        I agree to the terms and privacy policy.
      </Label>
    </div>
  ),
};

export const Invalid: Story = {
  args: { "aria-invalid": true },
  render: (args) => (
    <div className="flex items-start gap-2">
      <Checkbox id="invalid-cb" {...args} />
      <Label htmlFor="invalid-cb" className="cursor-pointer font-normal">
        Required field
      </Label>
    </div>
  ),
};
