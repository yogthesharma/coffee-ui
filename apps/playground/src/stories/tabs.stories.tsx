import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@coffee-ui/ui/tabs";
import { Button } from "@coffee-ui/ui/button";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,28rem)] rounded-lg bg-muted/50 p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Profile and display name settings live here.
      </TabsContent>
      <TabsContent value="security">
        Password, 2FA, and session management.
      </TabsContent>
      <TabsContent value="billing">
        Plans, invoices, and payment methods.
      </TabsContent>
    </Tabs>
  ),
};

export const Controlled: Story = {
  render: function ControlledTabs() {
    const [value, setValue] = useState("drafts");
    return (
      <div className="flex flex-col gap-4">
        <Tabs value={value} onValueChange={setValue}>
          <TabsList>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
          <TabsContent value="drafts">Unpublished posts (controlled).</TabsContent>
          <TabsContent value="published">Live posts (controlled).</TabsContent>
        </Tabs>
        <p className="text-xs text-muted-foreground">
          Active tab: <code className="rounded bg-muted px-1">{value}</code>
        </p>
        <Button type="button" variant="outline" size="sm" onClick={() => setValue("published")}>
          Jump to Published
        </Button>
      </div>
    );
  },
};
