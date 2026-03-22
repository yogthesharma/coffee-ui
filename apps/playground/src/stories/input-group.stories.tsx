import type { Meta, StoryObj } from "@storybook/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@coffee-ui/ui/input-group";

const meta = {
  title: "Primitives/InputGroup",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLeadingAddon: Story = {
  render: () => (
    <div className="w-[min(100%,20rem)]">
      <InputGroup>
        <InputGroupAddon>https://</InputGroupAddon>
        <InputGroupInput placeholder="example.com" />
      </InputGroup>
    </div>
  ),
};

export const WithTrailingAddon: Story = {
  render: () => (
    <div className="w-[min(100%,20rem)]">
      <InputGroup>
        <InputGroupInput placeholder="0.00" type="text" inputMode="decimal" />
        <InputGroupAddon align="inline-end">USD</InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const BothSides: Story = {
  render: () => (
    <div className="w-[min(100%,20rem)]">
      <InputGroup>
        <InputGroupAddon>$</InputGroupAddon>
        <InputGroupInput placeholder="Amount" type="text" inputMode="decimal" />
        <InputGroupAddon align="inline-end">.00</InputGroupAddon>
      </InputGroup>
    </div>
  ),
};
