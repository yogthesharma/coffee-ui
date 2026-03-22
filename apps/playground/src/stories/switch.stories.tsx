import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@coffee-ui/ui/label";
import { Switch } from "@coffee-ui/ui/switch";

const meta = {
  title: "Primitives/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    size: "default",
    defaultChecked: false,
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: "sm", defaultChecked: true },
};

export const Large: Story = {
  args: { size: "lg", defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="airplane-mode" {...args} />
      <Label htmlFor="airplane-mode" className="cursor-pointer font-normal">
        Airplane mode
      </Label>
    </div>
  ),
};

function ControlledDemo() {
  const [on, setOn] = React.useState(true);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Switch
          id="controlled-switch"
          checked={on}
          onCheckedChange={setOn}
        />
        <Label htmlFor="controlled-switch" className="cursor-pointer font-normal">
          Notifications {on ? "on" : "off"}
        </Label>
      </div>
      <p className="text-xs text-stone-500">
        Controlled via <code className="rounded bg-black/5 px-1">checked</code> +{" "}
        <code className="rounded bg-black/5 px-1">onCheckedChange</code>.
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
