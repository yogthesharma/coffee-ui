import type { Meta, StoryObj } from "@storybook/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@coffee-ui/ui/avatar";

const meta = {
  title: "Widgets/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
  },
  args: {
    size: "default",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage
        src="https://picsum.photos/seed/coffee/128/128"
        alt="Random portrait"
      />
      <AvatarFallback>CU</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackOnly: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

export const ImageError: Story = {
  name: "Broken image → fallback",
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://example.invalid/broken.jpg" alt="" />
      <AvatarFallback>!</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar size="sm">
        <AvatarImage
          src="https://picsum.photos/seed/s/64/64"
          alt=""
        />
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarImage
          src="https://picsum.photos/seed/m/96/96"
          alt=""
        />
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage
          src="https://picsum.photos/seed/l/128/128"
          alt=""
        />
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
    </div>
  ),
};
