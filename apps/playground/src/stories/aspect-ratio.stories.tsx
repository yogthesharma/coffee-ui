import type { Meta, StoryObj } from "@storybook/react";
import { AspectRatio } from "@coffee-ui/ui/aspect-ratio";

const meta = {
  title: "Primitives/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  args: {
    ratio: 16 / 9,
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80 max-w-full">
      <AspectRatio {...args}>
        <div className="flex h-full w-full items-center justify-center bg-stone-200 text-sm text-stone-600">
          16:9
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  args: { ratio: 1 },
  render: (args) => (
    <div className="w-48">
      <AspectRatio {...args}>
        <div className="h-full w-full rounded-sm bg-stone-300" />
      </AspectRatio>
    </div>
  ),
};
