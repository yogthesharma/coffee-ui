import type { Meta, StoryObj } from "@storybook/react";
import {
  Blockquote,
  Heading,
  InlineCode,
  Text,
} from "@coffee-ui/ui/typography";

const meta = {
  title: "Primitives/Typography",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <div className="grid max-w-prose gap-4">
      <Heading as="h1" appearance="plain">
        Heading 1
      </Heading>
      <Heading as="h2">Heading 2 (section rule)</Heading>
      <Heading as="h2" appearance="plain">
        Heading 2 plain
      </Heading>
      <Heading as="h3" appearance="plain">
        Heading 3
      </Heading>
      <Heading as="h4" appearance="plain">
        Heading 4
      </Heading>
      <Text>Body paragraph with leading and spacing for readable prose.</Text>
      <Text variant="lead">Lead text for intros and hero copy.</Text>
      <Text variant="large">Large semibold line.</Text>
      <Text variant="small">Small label line.</Text>
      <Text variant="muted">Muted supporting text.</Text>
      <Text>
        Inline <InlineCode>npm install</InlineCode> example.
      </Text>
      <Blockquote>
        A short quotation styled with a left border and italic body.
      </Blockquote>
    </div>
  ),
};
