import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@coffee-ui/ui/label";
import {
  SelectMenu,
  SelectMenuContent,
  SelectMenuItem,
  SelectMenuTrigger,
} from "@coffee-ui/ui/select-menu";

const meta = {
  title: "Widgets/SelectMenu",
  component: SelectMenu,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    defaultValue: "react",
    disabled: false,
    size: "default",
  },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,20rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SelectMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <SelectMenu {...args}>
      <SelectMenuTrigger placeholder="Pick a framework" />
      <SelectMenuContent>
        <SelectMenuItem value="react">React</SelectMenuItem>
        <SelectMenuItem value="vue">Vue</SelectMenuItem>
        <SelectMenuItem value="svelte">Svelte</SelectMenuItem>
      </SelectMenuContent>
    </SelectMenu>
  ),
};

function ControlledMenu() {
  const [value, setValue] = React.useState("editor");
  return (
    <div className="space-y-2">
      <SelectMenu value={value} onValueChange={setValue}>
        <SelectMenuTrigger placeholder="Role" />
        <SelectMenuContent>
          <SelectMenuItem value="viewer">Viewer</SelectMenuItem>
          <SelectMenuItem value="editor">Editor</SelectMenuItem>
          <SelectMenuItem value="admin">Admin</SelectMenuItem>
        </SelectMenuContent>
      </SelectMenu>
      <p className="text-xs text-stone-500">
        Value: <code className="rounded bg-black/5 px-1">{value}</code>
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledMenu />,
};

export const WithDisabledItem: Story = {
  render: (args) => (
    <SelectMenu {...args} defaultValue="b">
      <SelectMenuTrigger />
      <SelectMenuContent>
        <SelectMenuItem value="a">Option A</SelectMenuItem>
        <SelectMenuItem value="b">Option B</SelectMenuItem>
        <SelectMenuItem value="c" disabled>
          Coming soon
        </SelectMenuItem>
      </SelectMenuContent>
    </SelectMenu>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Label id="sm-label">Workspace</Label>
      <SelectMenu {...args} defaultValue="personal">
        <SelectMenuTrigger placeholder="Select workspace" aria-labelledby="sm-label" />
        <SelectMenuContent aria-labelledby="sm-label">
          <SelectMenuItem value="personal">Personal</SelectMenuItem>
          <SelectMenuItem value="team">Team</SelectMenuItem>
        </SelectMenuContent>
      </SelectMenu>
    </div>
  ),
};
