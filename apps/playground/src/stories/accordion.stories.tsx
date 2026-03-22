import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@coffee-ui/ui/accordion";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[min(100%,28rem)] rounded-lg border border-border bg-card p-2 px-4 shadow-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. The trigger is a native button with <code className="rounded bg-muted px-1">aria-expanded</code>{" "}
          and the panel uses <code className="rounded bg-muted px-1">role=&quot;region&quot;</code>.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled with tokens?</AccordionTrigger>
        <AccordionContent>
          Borders and text use semantic Tailwind tokens (<code className="rounded bg-muted px-1">border-border</code>,{" "}
          <code className="rounded bg-muted px-1">text-muted-foreground</code>).
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I close all panels?</AccordionTrigger>
        <AccordionContent>
          With <code className="rounded bg-muted px-1">collapsible</code> on single mode, the open item can be toggled
          closed.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["a", "b"]}>
      <AccordionItem value="a">
        <AccordionTrigger>First section</AccordionTrigger>
        <AccordionContent>Multiple sections can be open at once.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Second section</AccordionTrigger>
        <AccordionContent>Toggle independently.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Third section</AccordionTrigger>
        <AccordionContent>Uses the same item API as single mode.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Controlled: Story = {
  render: function ControlledAccordion() {
    const [value, setValue] = useState("item-1");
    return (
      <div className="flex flex-col gap-4">
        <Accordion type="single" value={value} onValueChange={(v) => setValue(v as string)}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Panel one</AccordionTrigger>
            <AccordionContent>Controlled value: item-1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Panel two</AccordionTrigger>
            <AccordionContent>Controlled value: item-2</AccordionContent>
          </AccordionItem>
        </Accordion>
        <p className="text-xs text-muted-foreground">
          Value: <code className="rounded bg-muted px-1">{value || "(none)"}</code>
        </p>
      </div>
    );
  },
};
