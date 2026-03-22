import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { Label } from "@coffee-ui/ui/label";
import { Select, type SelectProps } from "@coffee-ui/ui/select";

const meta = {
  title: "Widgets/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story: StoryFn) => (
      <div className="w-[min(100%,20rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<SelectProps>;

export default meta;
type Story = StoryObj<SelectProps>;

export const Default: Story = {
  render: (args) => (
    <Select {...args} defaultValue="">
      <option value="" disabled>
        Choose a framework
      </option>
      <option value="react">React</option>
      <option value="vue">Vue</option>
      <option value="svelte">Svelte</option>
    </Select>
  ),
};

export const Small: Story = {
  args: { size: "sm" },
  render: (args) => (
    <Select {...args} defaultValue="md">
      <option value="sm">Small</option>
      <option value="md">Medium</option>
      <option value="lg">Large</option>
    </Select>
  ),
};

export const Large: Story = {
  args: { size: "lg" },
  render: (args) => (
    <Select {...args} defaultValue="a">
      <option value="a">Option A</option>
      <option value="b">Option B</option>
    </Select>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Select {...args} defaultValue="one">
      <option value="one">One</option>
      <option value="two">Two</option>
    </Select>
  ),
};

export const Invalid: Story = {
  args: { "aria-invalid": true },
  render: (args) => (
    <Select {...args} defaultValue="">
      <option value="" disabled>
        Required
      </option>
      <option value="ok">OK</option>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="select-role">Role</Label>
      <Select {...args} id="select-role" defaultValue="viewer">
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </Select>
    </div>
  ),
};
