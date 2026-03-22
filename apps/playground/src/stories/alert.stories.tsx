import type { Meta, StoryObj } from "@storybook/react";
import { IconRocket } from "@tabler/icons-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@coffee-ui/ui/alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "success", "warning", "info"],
    },
    showIcon: { control: "boolean" },
  },
  args: {
    variant: "default",
    showIcon: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,28rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        You can use alerts for inline messages that don’t need a modal.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: { variant: "destructive" },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>
        Your card was declined. Try another payment method.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  args: { variant: "success" },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Saved</AlertTitle>
      <AlertDescription>Your changes were published successfully.</AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  args: { variant: "warning" },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Quota almost full</AlertTitle>
      <AlertDescription>
        You’ve used 90% of storage. Upgrade to avoid interruptions.
      </AlertDescription>
    </Alert>
  ),
};

export const Info: Story = {
  args: { variant: "info" },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>New feature</AlertTitle>
      <AlertDescription>
        Keyboard shortcuts are now available in the editor.
      </AlertDescription>
    </Alert>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Short status line without extra description.</AlertTitle>
    </Alert>
  ),
};

export const WithoutIcon: Story = {
  args: { showIcon: false },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>No icon</AlertTitle>
      <AlertDescription>
        Pass <code className="rounded bg-muted px-1">showIcon=&#123;false&#125;</code> when the
        message is redundant with other UI.
      </AlertDescription>
    </Alert>
  ),
};

export const CustomIcon: Story = {
  args: { variant: "info" },
  render: (args) => (
    <Alert
      {...args}
      icon={<IconRocket stroke={1.75} className="size-[1.125rem]" />}
    >
      <AlertTitle>Launch checklist</AlertTitle>
      <AlertDescription>
        Override the default Tabler icon with the <code className="rounded bg-muted px-1">icon</code>{" "}
        prop (any React node).
      </AlertDescription>
    </Alert>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert variant="default">
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>Neutral notice (Tabler IconBell).</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>Error state (IconAlertCircle).</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Positive outcome (IconCircleCheck).</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Caution (IconAlertTriangle).</AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Informational (IconInfoCircle).</AlertDescription>
      </Alert>
    </div>
  ),
};
