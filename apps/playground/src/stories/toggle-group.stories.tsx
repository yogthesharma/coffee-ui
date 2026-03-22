import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconItalic,
  IconUnderline,
} from "@tabler/icons-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@coffee-ui/ui/toggle-group";

const meta = {
  title: "Widgets/ToggleGroup",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="center" variant="outline" size="sm">
      <ToggleGroupItem value="left" aria-label="Align left">
        <IconAlignLeft className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <IconAlignCenter className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <IconAlignRight className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Segmented: Story = {
  render: () => (
    <ToggleGroup
      type="single"
      defaultValue="b"
      className="inline-flex rounded-md border border-input bg-muted p-1 shadow-sm"
      variant="outline"
      size="sm"
    >
      <ToggleGroupItem
        value="a"
        className="rounded-sm border-0 bg-transparent px-3 shadow-none data-[state=on]:bg-card data-[state=on]:shadow-sm"
      >
        A
      </ToggleGroupItem>
      <ToggleGroupItem
        value="b"
        className="rounded-sm border-0 bg-transparent px-3 shadow-none data-[state=on]:bg-card data-[state=on]:shadow-sm"
      >
        B
      </ToggleGroupItem>
      <ToggleGroupItem
        value="c"
        className="rounded-sm border-0 bg-transparent px-3 shadow-none data-[state=on]:bg-card data-[state=on]:shadow-sm"
      >
        C
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={["bold"]} variant="default">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <IconBold className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <IconItalic className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <IconUnderline className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const ControlledSingle: Story = {
  render: function Controlled() {
    const [value, setValue] = React.useState("b");
    return (
      <div className="flex flex-col gap-4">
        <ToggleGroup
          type="single"
          value={value}
          onValueChange={setValue}
          variant="outline"
        >
          <ToggleGroupItem value="a">Option A</ToggleGroupItem>
          <ToggleGroupItem value="b">Option B</ToggleGroupItem>
          <ToggleGroupItem value="c">Option C</ToggleGroupItem>
        </ToggleGroup>
        <p className="text-sm text-muted-foreground">Selected: {value || "(none)"}</p>
      </div>
    );
  },
};
