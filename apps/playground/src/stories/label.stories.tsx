import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@coffee-ui/ui/label";
import { Input } from "@coffee-ui/ui/input";

const meta = {
  title: "Primitives/Label",
  component: Label,
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Label text",
    htmlFor: "label-demo",
  },
  render: (args) => (
    <div className="grid w-[min(100%,20rem)] gap-2">
      <Label {...args} />
      <Input id={args.htmlFor} placeholder="Associated field" />
    </div>
  ),
};

export const RequiredField: Story = {
  render: () => (
    <div className="grid w-[min(100%,20rem)] gap-2">
      <Label htmlFor="label-req">
        Password{" "}
        <span className="text-destructive" aria-hidden>
          *
        </span>
      </Label>
      <Input id="label-req" type="password" autoComplete="new-password" required />
    </div>
  ),
};
