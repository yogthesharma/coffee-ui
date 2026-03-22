import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@coffee-ui/ui/badge";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "outline",
        "destructive",
        "success",
        "warning",
        "info",
        "muted",
        "accent",
        "success-solid",
        "warning-solid",
        "info-solid",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
  },
  args: {
    children: "Badge",
    variant: "default",
    size: "default",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Error" },
};

export const Success: Story = {
  args: { variant: "success", children: "Published" },
};

export const Warning: Story = {
  args: { variant: "warning", children: "Pending review" },
};

export const Info: Story = {
  args: { variant: "info", children: "Beta" },
};

export const Muted: Story = {
  args: { variant: "muted", children: "Archived" },
};

export const Accent: Story = {
  args: { variant: "accent", children: "Pro" },
};

export const SuccessSolid: Story = {
  args: { variant: "success-solid", children: "Live" },
};

export const WarningSolid: Story = {
  args: { variant: "warning-solid", children: "Action needed" },
};

export const InfoSolid: Story = {
  args: { variant: "info-solid", children: "New" },
};

export const Small: Story = {
  args: { size: "sm", children: "New" },
};

export const Large: Story = {
  args: { size: "lg", children: "Featured" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-full text-xs font-medium text-stone-500">
          Soft
        </span>
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="muted">Muted</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="accent">Accent</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-full text-xs font-medium text-stone-500">
          Solid
        </span>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="success-solid">Success</Badge>
        <Badge variant="warning-solid">Warning</Badge>
        <Badge variant="info-solid">Info</Badge>
      </div>
    </div>
  ),
};
