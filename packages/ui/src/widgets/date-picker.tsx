import * as React from "react";
import { IconCalendar } from "@tabler/icons-react";
import { buttonVariants } from "../primitives/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/popover";
import { Calendar } from "./calendar";
import { cn } from "../lib/utils";

export type DatePickerProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> & {
  /** Controlled value (pass `undefined` to clear when using controlled mode). */
  value?: Date | undefined;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  /** `Calendar` props forwarded to the popover panel. */
  calendarProps?: Omit<
    React.ComponentProps<typeof Calendar>,
    "mode" | "selected" | "defaultSelected" | "onSelect"
  >;
  align?: React.ComponentProps<typeof PopoverContent>["align"];
};

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (props, ref) => {
    const {
      className,
      value: valueProp,
      defaultValue,
      onChange,
      placeholder = "Pick a date",
      disabled,
      calendarProps,
      align = "start",
      ...rest
    } = props;
    const isControlled = "value" in props;
    const [open, setOpen] = React.useState(false);
    const [internal, setInternal] = React.useState<Date | undefined>(() =>
      defaultValue ? new Date(defaultValue) : undefined
    );

    const value = isControlled ? valueProp : internal;
    const selected = value !== undefined && value !== null ? value : undefined;

    const setValue = React.useCallback(
      (next: Date | undefined) => {
        if (!isControlled) setInternal(next);
        onChange?.(next);
      },
      [isControlled, onChange]
    );

    const fmt = React.useMemo(
      () =>
        new Intl.DateTimeFormat(undefined, {
          dateStyle: "medium",
        }),
      []
    );

    const label =
      selected !== undefined ? fmt.format(selected) : placeholder;

    return (
      <div ref={ref} className={cn("inline-block", className)} {...rest}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "min-w-[12rem] justify-start gap-2 px-3 text-left font-normal",
                !selected && "text-muted-foreground"
              )}
            >
              <IconCalendar
                stroke={1.75}
                className="size-4 shrink-0 opacity-60"
                aria-hidden
              />
              <span className="truncate">{label}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align={align}>
            <Calendar
              {...calendarProps}
              mode="single"
              selected={selected}
              onSelect={(d) => {
                setValue(d);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";

export { DatePicker };
