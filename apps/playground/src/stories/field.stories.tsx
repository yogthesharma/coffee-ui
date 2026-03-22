import type { Meta, StoryObj } from "@storybook/react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@coffee-ui/ui/field";
import { Input } from "@coffee-ui/ui/input";

const meta = {
  title: "Primitives/Field",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Complete: Story = {
  render: () => (
    <Field className="w-[min(100%,20rem)]">
      <FieldLabel htmlFor="demo-email">Email</FieldLabel>
      <FieldDescription id="demo-email-hint">
        We will never share your address.
      </FieldDescription>
      <Input
        id="demo-email"
        type="email"
        placeholder="you@example.com"
        aria-describedby="demo-email-hint"
        autoComplete="email"
      />
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field className="w-[min(100%,20rem)]">
      <FieldLabel htmlFor="demo-code">Invite code</FieldLabel>
      <Input
        id="demo-code"
        defaultValue="wrong"
        aria-invalid
        aria-describedby="demo-code-err"
      />
      <FieldError id="demo-code-err">Code is invalid or expired.</FieldError>
    </Field>
  ),
};
