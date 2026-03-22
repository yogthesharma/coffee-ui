import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@coffee-ui/ui/card";
import { Button } from "@coffee-ui/ui/button";
import { Input } from "@coffee-ui/ui/input";
import { Label } from "@coffee-ui/ui/label";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      story: { inline: false },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "ghost"],
    },
  },
  args: {
    variant: "default",
  },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,24rem)] rounded-lg bg-stone-100 p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>
          Deploy your new project in a few clicks.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="card-name">Name</Label>
          <Input id="card-name" placeholder="Acme Inc." />
        </div>
      </CardContent>
      <CardFooter className="gap-3">
        <Button variant="secondary" type="button">
          Cancel
        </Button>
        <Button type="button">Continue</Button>
      </CardFooter>
    </Card>
  ),
};

export const Ghost: Story = {
  args: { variant: "ghost" },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Borderless card for nested surfaces.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-stone-600">
          Use the ghost variant when the card sits on an already elevated panel.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>Invite your team.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-stone-600">No invites yet.</p>
      </CardContent>
    </Card>
  ),
};
