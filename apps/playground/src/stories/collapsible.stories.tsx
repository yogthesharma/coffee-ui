import type { Meta, StoryObj } from "@storybook/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@coffee-ui/ui/collapsible";

const meta = {
  title: "Primitives/Collapsible",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-[min(100%,24rem)] rounded-md border border-stone-200 bg-white p-3">
      <CollapsibleTrigger className="w-full text-left">
        Shipping details
      </CollapsibleTrigger>
      <CollapsibleContent>
        Free standard shipping on orders over $50. Expedited options at checkout.
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const Open: Story = {
  render: () => (
    <Collapsible
      open
      className="w-[min(100%,24rem)] rounded-md border border-stone-200 bg-white p-3"
    >
      <CollapsibleTrigger className="w-full text-left">
        Returns policy
      </CollapsibleTrigger>
      <CollapsibleContent>
        30-day returns in original condition with receipt or order number.
      </CollapsibleContent>
    </Collapsible>
  ),
};
