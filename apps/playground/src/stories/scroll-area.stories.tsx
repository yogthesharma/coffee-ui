import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "@coffee-ui/ui/scroll-area";

const meta = {
  title: "Primitives/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "default", "lg", "none"] },
  },
  args: {
    size: "default",
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const lipsum = Array.from({ length: 12 }, (_, i) => (
  <p key={i} className="mb-3 text-sm text-stone-700 last:mb-0">
    Paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </p>
));

export const Default: Story = {
  render: (args) => (
    <div className="w-80 max-w-full">
      <ScrollArea {...args} className="p-4">
        {lipsum}
      </ScrollArea>
    </div>
  ),
};

export const NoMaxHeight: Story = {
  args: { size: "none", className: "max-h-40" },
  render: (args) => (
    <div className="w-80 max-w-full">
      <ScrollArea {...args} className="p-4">
        {lipsum}
      </ScrollArea>
    </div>
  ),
};
