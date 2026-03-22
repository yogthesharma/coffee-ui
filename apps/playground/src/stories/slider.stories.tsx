import * as React from "react";
import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { Slider, type SliderProps } from "@coffee-ui/ui/slider";
import { Label } from "@coffee-ui/ui/label";

const meta = {
  title: "Widgets/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
    disabled: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
  },
  args: {
    defaultValue: 40,
    min: 0,
    max: 100,
    step: 1,
  },
  decorators: [
    (Story: StoryFn) => (
      <div className="w-[min(100%,20rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<SliderProps>;

export default meta;
type Story = StoryObj<SliderProps>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: "sm", defaultValue: 55 },
};

export const Large: Story = {
  args: { size: "lg", defaultValue: 25 },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 50 },
};

export const Stepped: Story = {
  args: { step: 10, defaultValue: 30 },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="volume-slider">Volume</Label>
      <Slider id="volume-slider" {...args} />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [v, setV] = React.useState(35);
    return (
      <div className="grid gap-2">
        <div className="flex items-center justify-between text-sm text-stone-600">
          <span>Brightness</span>
          <span className="tabular-nums">{v}</span>
        </div>
        <Slider
          size={args.size}
          min={args.min}
          max={args.max}
          step={args.step}
          disabled={args.disabled}
          value={v}
          onValueChange={setV}
          aria-valuetext={`${v} percent`}
        />
      </div>
    );
  },
};
