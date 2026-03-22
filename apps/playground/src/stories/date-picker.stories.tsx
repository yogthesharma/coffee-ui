import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { DatePicker } from "@coffee-ui/ui/date-picker";

const meta = {
  title: "Widgets/DatePicker",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DatePickerDemo() {
    const [value, setValue] = React.useState<Date | undefined>();
    return (
      <div className="flex max-w-sm flex-col gap-3">
        <DatePicker
          value={value}
          onChange={setValue}
          placeholder="Select a date"
        />
        <p className="text-sm text-muted-foreground">
          {value
            ? `Value: ${value.toDateString()}`
            : "No date selected."}
        </p>
      </div>
    );
  },
};

export const Uncontrolled: Story = {
  render: () => (
    <DatePicker
      defaultValue={new Date(2026, 5, 15)}
      calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <DatePicker disabled placeholder="Unavailable" defaultValue={new Date()} />
  ),
};
