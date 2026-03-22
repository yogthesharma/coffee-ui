import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Calendar, type DateRange } from "@coffee-ui/ui/calendar";

const meta = {
  title: "Widgets/Calendar",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function CalendarUncontrolled() {
    const [selected, setSelected] = React.useState<Date | undefined>();
    return (
      <div className="flex flex-col gap-3">
        <Calendar onSelect={setSelected} />
        <p className="text-sm text-muted-foreground">
          {selected
            ? selected.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Pick a date."}
        </p>
      </div>
    );
  },
};

export const Controlled: Story = {
  render: function CalendarControlled() {
    const [selected, setSelected] = React.useState<Date | undefined>(
      () => new Date(2026, 2, 15)
    );
    return (
      <div className="flex flex-col gap-3">
        <Calendar
          defaultMonth={new Date(2026, 2, 1)}
          selected={selected}
          onSelect={setSelected}
        />
        <p className="text-sm text-muted-foreground">
          Controlled: {selected?.toDateString() ?? "none"}
        </p>
      </div>
    );
  },
};

export const WeekStartsOnMonday: Story = {
  name: "Week starts Monday",
  render: () => (
    <Calendar
      defaultMonth={new Date(2026, 2, 1)}
      weekStartsOn={1}
      defaultSelected={new Date(2026, 2, 9)}
    />
  ),
};

export const DisabledWeekends: Story = {
  name: "Disabled weekends",
  render: function WeekendsDisabled() {
    const [selected, setSelected] = React.useState<Date | undefined>();
    return (
      <Calendar
        defaultMonth={new Date()}
        disabled={(d) => {
          const day = d.getDay();
          return day === 0 || day === 6;
        }}
        selected={selected}
        onSelect={setSelected}
      />
    );
  },
};

export const Range: Story = {
  render: function CalendarRange() {
    const [range, setRange] = React.useState<DateRange>({
      from: undefined,
      to: undefined,
    });
    return (
      <div className="flex flex-col gap-3">
        <Calendar
          mode="range"
          defaultMonth={new Date(2026, 2, 1)}
          selected={range}
          onSelect={setRange}
        />
        <p className="max-w-xs text-sm text-muted-foreground">
          {range.from && range.to
            ? `${range.from.toDateString()} → ${range.to.toDateString()}`
            : range.from
              ? `${range.from.toDateString()} — pick end date`
              : "Click a start date, then an end date."}
        </p>
      </div>
    );
  },
};

export const Keyboard: Story = {
  name: "Keyboard (focus the grid)",
  parameters: {
    docs: {
      description: {
        story:
          "Tab to the date grid, then use arrows, Home/End, Page Up/Down, and Enter or Space to select.",
      },
    },
  },
  render: () => (
    <Calendar defaultMonth={new Date(2026, 2, 1)} defaultSelected={new Date(2026, 2, 10)} />
  ),
};
