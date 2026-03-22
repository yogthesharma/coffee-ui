import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@coffee-ui/ui/label";
import { RadioGroup, RadioGroupItem } from "@coffee-ui/ui/radio-group";

const meta = {
  title: "Widgets/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    defaultValue: "comfortable",
    disabled: false,
    size: "default",
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="rg-default" />
        <Label htmlFor="rg-default" className="cursor-pointer font-normal">
          Default
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="rg-comfortable" />
        <Label htmlFor="rg-comfortable" className="cursor-pointer font-normal">
          Comfortable
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="rg-compact" />
        <Label htmlFor="rg-compact" className="cursor-pointer font-normal">
          Compact
        </Label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  args: { defaultValue: "monthly", className: "flex flex-row flex-wrap gap-4" },
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="monthly" id="rg-m" />
        <Label htmlFor="rg-m" className="cursor-pointer font-normal">
          Monthly
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="yearly" id="rg-y" />
        <Label htmlFor="rg-y" className="cursor-pointer font-normal">
          Yearly
        </Label>
      </div>
    </RadioGroup>
  ),
};

function ControlledDemo() {
  const [value, setValue] = React.useState("b");
  return (
    <div className="space-y-2">
      <RadioGroup value={value} onValueChange={setValue}>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="a" id="rg-a" />
          <Label htmlFor="rg-a" className="cursor-pointer font-normal">
            Option A
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="b" id="rg-b" />
          <Label htmlFor="rg-b" className="cursor-pointer font-normal">
            Option B
          </Label>
        </div>
      </RadioGroup>
      <p className="text-xs text-stone-500">
        Selected: <code className="rounded bg-black/5 px-1">{value}</code>
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "one" },
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="one" id="rg-1" />
        <Label htmlFor="rg-1" className="cursor-pointer font-normal">
          One
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="two" id="rg-2" />
        <Label htmlFor="rg-2" className="cursor-pointer font-normal">
          Two
        </Label>
      </div>
    </RadioGroup>
  ),
};
