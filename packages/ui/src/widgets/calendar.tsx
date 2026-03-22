import * as React from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { buttonVariants } from "../primitives/button";
import { cn } from "../lib/utils";

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function addMonths(d: Date, delta: number): Date {
  const y = d.getFullYear();
  const m = d.getMonth() + delta;
  return new Date(y, m, 1);
}

function addDays(d: Date, delta: number): Date {
  const x = startOfDay(d);
  x.setDate(x.getDate() + delta);
  return x;
}

function mondayFirstIndex(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getCalendarGrid(month: Date, weekStartsOn: 0 | 1): Date[] {
  const y = month.getFullYear();
  const m = month.getMonth();
  const first = new Date(y, m, 1);
  const jsDow = first.getDay();
  const leading = weekStartsOn === 1 ? mondayFirstIndex(jsDow) : jsDow;
  const start = new Date(y, m, 1 - leading);
  const out: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const cell = new Date(start);
    cell.setDate(start.getDate() + i);
    out.push(cell);
  }
  return out;
}

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

function normalizeRangeEndpoints(
  a: Date,
  b: Date
): { from: Date; to: Date } {
  const x = startOfDay(a);
  const y = startOfDay(b);
  return x <= y ? { from: x, to: y } : { from: y, to: x };
}

function inExclusiveRange(day: Date, from?: Date, to?: Date): boolean {
  if (!from || !to) return false;
  const { from: a, to: b } = normalizeRangeEndpoints(from, to);
  const t = startOfDay(day).getTime();
  return t > a.getTime() && t < b.getTime();
}

function isRangeEndpoint(day: Date, from?: Date, to?: Date): boolean {
  if (!from && !to) return false;
  if (from && isSameDay(day, from)) return true;
  if (to && isSameDay(day, to)) return true;
  return false;
}

function addCalendarMonthsClamp(day: Date, delta: number): Date {
  const y = day.getFullYear();
  const m = day.getMonth() + delta;
  const dom = day.getDate();
  const last = new Date(y, m + 1, 0).getDate();
  return startOfDay(new Date(y, m, Math.min(dom, last)));
}

function startOfWeek(d: Date, weekStartsOn: 0 | 1): Date {
  const sod = startOfDay(d);
  const dow = sod.getDay();
  const offset = weekStartsOn === 1 ? mondayFirstIndex(dow) : dow;
  return addDays(sod, -offset);
}

function endOfWeek(d: Date, weekStartsOn: 0 | 1): Date {
  return addDays(startOfWeek(d, weekStartsOn), 6);
}

type CalendarBaseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> & {
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  disabled?: (date: Date) => boolean;
  weekStartsOn?: 0 | 1;
  locale?: string;
};

export type CalendarSingleProps = CalendarBaseProps & {
  mode?: "single";
  selected?: Date | undefined;
  defaultSelected?: Date;
  onSelect?: (date: Date | undefined) => void;
};

export type CalendarRangeProps = CalendarBaseProps & {
  mode: "range";
  selected?: DateRange;
  defaultRange?: DateRange;
  onSelect?: (range: DateRange) => void;
};

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

const WEEKDAYS_SUN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const WEEKDAYS_MON = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (props, ref) => {
    const {
      className,
      month: monthProp,
      defaultMonth,
      onMonthChange,
      disabled,
      weekStartsOn = 0,
      locale,
      mode = "single",
      ...rest
    } = props;

    const isMonthControlled = "month" in props;

    const today = React.useMemo(() => startOfDay(new Date()), []);

    const [internalMonth, setInternalMonth] = React.useState(() => {
      let base = defaultMonth ?? today;
      if (mode === "single") {
        const p = props as CalendarSingleProps;
        base = defaultMonth ?? p.defaultSelected ?? today;
      } else {
        const p = props as CalendarRangeProps;
        base =
          defaultMonth ?? p.defaultRange?.from ?? p.defaultRange?.to ?? today;
      }
      const d = startOfDay(base);
      d.setDate(1);
      return d;
    });

    const viewMonth = React.useMemo(() => {
      if (isMonthControlled) {
        const d = startOfDay(monthProp!);
        d.setDate(1);
        return d;
      }
      const d = startOfDay(internalMonth);
      d.setDate(1);
      return d;
    }, [isMonthControlled, monthProp, internalMonth]);

    const setViewMonth = React.useCallback(
      (next: Date) => {
        const anchor = startOfDay(next);
        anchor.setDate(1);
        if (!isMonthControlled) setInternalMonth(anchor);
        onMonthChange?.(anchor);
      },
      [isMonthControlled, onMonthChange]
    );

    const isSingle = mode === "single";
    const singleProps = props as CalendarSingleProps;
    const rangeProps = props as CalendarRangeProps;

    const isSelectedControlled = isSingle && "selected" in props;
    const isRangeControlled = !isSingle && "selected" in props;

    const [internalSelected, setInternalSelected] = React.useState<
      Date | undefined
    >(() =>
      isSingle && singleProps.defaultSelected
        ? startOfDay(singleProps.defaultSelected)
        : undefined
    );

    const selectedSingle = isSingle
      ? isSelectedControlled
        ? singleProps.selected !== undefined && singleProps.selected !== null
          ? startOfDay(singleProps.selected)
          : undefined
        : internalSelected
      : undefined;

    const setSelectedSingle = React.useCallback(
      (next: Date | undefined) => {
        if (!isSelectedControlled) setInternalSelected(next);
        singleProps.onSelect?.(next);
      },
      [isSelectedControlled, singleProps]
    );

    const [internalRange, setInternalRange] = React.useState<DateRange>(() => {
      if (isSingle) return { from: undefined, to: undefined };
      const dr = rangeProps.defaultRange;
      return {
        from: dr?.from ? startOfDay(dr.from) : undefined,
        to: dr?.to ? startOfDay(dr.to) : undefined,
      };
    });

    const rangeValue: DateRange = !isSingle
      ? isRangeControlled
        ? {
            from:
              rangeProps.selected?.from !== undefined &&
              rangeProps.selected?.from !== null
                ? startOfDay(rangeProps.selected.from)
                : undefined,
            to:
              rangeProps.selected?.to !== undefined &&
              rangeProps.selected?.to !== null
                ? startOfDay(rangeProps.selected.to)
                : undefined,
          }
        : internalRange
      : { from: undefined, to: undefined };

    const setRangeValue = React.useCallback(
      (next: DateRange) => {
        if (!isRangeControlled) setInternalRange(next);
        rangeProps.onSelect?.(next);
      },
      [isRangeControlled, rangeProps]
    );

    const [focusedDate, setFocusedDate] = React.useState<Date | null>(null);

    const seedFocus = React.useCallback(() => {
      if (isSingle) {
        return selectedSingle ?? today;
      }
      return rangeValue.from ?? rangeValue.to ?? today;
    }, [isSingle, selectedSingle, rangeValue.from, rangeValue.to, today]);

    const onGridFocus = React.useCallback(() => {
      setFocusedDate((fd) => fd ?? seedFocus());
    }, [seedFocus]);

    const moveFocus = React.useCallback(
      (next: Date) => {
        const d = startOfDay(next);
        if (disabled?.(d)) return;
        setFocusedDate(d);
        if (!isSameMonth(d, viewMonth)) {
          setViewMonth(startOfDay(new Date(d.getFullYear(), d.getMonth(), 1)));
        }
      },
      [disabled, viewMonth, setViewMonth]
    );

    const handleGridKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const fd = focusedDate ?? seedFocus();
        if (e.key === "Tab") return;

        const navKeys = [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
          "PageUp",
          "PageDown",
          "Enter",
          " ",
        ];
        if (!navKeys.includes(e.key)) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (disabled?.(startOfDay(fd))) return;
          if (isSingle) {
            setSelectedSingle(startOfDay(fd));
          } else {
            const d = startOfDay(fd);
            const { from, to } = rangeValue;
            if (!from || (from && to)) {
              setRangeValue({ from: d, to: undefined });
            } else {
              const { from: a, to: b } = normalizeRangeEndpoints(from, d);
              setRangeValue({ from: a, to: b });
            }
          }
          return;
        }

        e.preventDefault();
        let next = fd;
        switch (e.key) {
          case "ArrowLeft":
            next = addDays(fd, -1);
            break;
          case "ArrowRight":
            next = addDays(fd, 1);
            break;
          case "ArrowUp":
            next = addDays(fd, -7);
            break;
          case "ArrowDown":
            next = addDays(fd, 7);
            break;
          case "Home":
            next = startOfWeek(fd, weekStartsOn);
            break;
          case "End":
            next = endOfWeek(fd, weekStartsOn);
            break;
          case "PageUp":
            next = addCalendarMonthsClamp(fd, -1);
            break;
          case "PageDown":
            next = addCalendarMonthsClamp(fd, 1);
            break;
          default:
            return;
        }
        moveFocus(next);
      },
      [
        focusedDate,
        seedFocus,
        disabled,
        isSingle,
        setSelectedSingle,
        rangeValue,
        setRangeValue,
        weekStartsOn,
        moveFocus,
      ]
    );

    const handleDayClick = React.useCallback(
      (day: Date) => {
        const d = startOfDay(day);
        if (disabled?.(d)) return;
        setFocusedDate(d);
        if (isSingle) {
          setSelectedSingle(d);
          return;
        }
        const { from, to } = rangeValue;
        if (!from || (from && to)) {
          setRangeValue({ from: d, to: undefined });
        } else {
          const { from: a, to: b } = normalizeRangeEndpoints(from, d);
          setRangeValue({ from: a, to: b });
        }
      },
      [disabled, isSingle, setSelectedSingle, rangeValue, setRangeValue]
    );

    const grid = React.useMemo(
      () => getCalendarGrid(viewMonth, weekStartsOn),
      [viewMonth, weekStartsOn]
    );

    const weekdays = weekStartsOn === 1 ? WEEKDAYS_MON : WEEKDAYS_SUN;

    const title = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    }).format(viewMonth);

    const longDayFmt = React.useMemo(
      () =>
        new Intl.DateTimeFormat(locale, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      [locale]
    );

    const monthYearId = React.useId();

    const { ...rootRest } = rest as Record<string, unknown>;
    delete rootRest.defaultSelected;
    delete rootRest.defaultRange;
    delete rootRest.selected;
    delete rootRest.onSelect;

    return (
      <div
        ref={ref}
        role="region"
        aria-label={isSingle ? "Calendar" : "Calendar date range"}
        className={cn(
          "w-fit rounded-md border border-border bg-card p-3 shadow-sm",
          className
        )}
        {...(rootRest as React.HTMLAttributes<HTMLDivElement>)}
      >
        <div className="flex items-center justify-between gap-2 pb-3">
          <button
            type="button"
            aria-label="Previous month"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "size-8"
            )}
            onClick={() => setViewMonth(addMonths(viewMonth, -1))}
          >
            <IconChevronLeft stroke={1.75} className="size-4" />
          </button>
          <div
            id={monthYearId}
            className="text-sm font-medium tabular-nums text-foreground"
            aria-live="polite"
          >
            {title}
          </div>
          <button
            type="button"
            aria-label="Next month"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "size-8"
            )}
            onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          >
            <IconChevronRight stroke={1.75} className="size-4" />
          </button>
        </div>

        <div
          role="grid"
          aria-labelledby={monthYearId}
          aria-multiselectable={!isSingle}
          tabIndex={0}
          className="w-full min-w-[16.5rem] rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onFocus={onGridFocus}
          onKeyDown={handleGridKeyDown}
        >
          <div role="row" className="mb-1 grid grid-cols-7 gap-0.5">
            {weekdays.map((d) => (
              <div
                key={d}
                role="columnheader"
                className="flex h-8 items-center justify-center text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground"
              >
                {d}
              </div>
            ))}
          </div>
          {Array.from({ length: 6 }, (_, row) => (
            <div key={row} role="row" className="grid grid-cols-7 gap-0.5">
              {grid.slice(row * 7, row * 7 + 7).map((day) => {
                const inMonth = isSameMonth(day, viewMonth);
                const isToday = isSameDay(day, today);
                const isDisabled = disabled?.(day) ?? false;

                let isSel = false;
                let inRangeMid = false;
                let rangeEnd = false;

                if (isSingle) {
                  isSel =
                    selectedSingle !== undefined && isSameDay(day, selectedSingle);
                } else {
                  const { from, to } = rangeValue;
                  inRangeMid = inExclusiveRange(day, from, to);
                  rangeEnd = isRangeEndpoint(day, from, to);
                  isSel = rangeEnd;
                }

                const isKbFocus =
                  focusedDate !== null && isSameDay(day, focusedDate);

                return (
                  <div key={dateKey(day)} role="gridcell" className="p-0">
                    <button
                      type="button"
                      tabIndex={-1}
                      disabled={isDisabled}
                      aria-label={longDayFmt.format(day)}
                      aria-selected={isSel}
                      aria-current={isToday ? "date" : undefined}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-md text-sm font-normal motion-safe:transition-colors motion-safe:duration-150 motion-reduce:transition-none",
                        !inMonth && "text-muted-foreground/50",
                        inMonth && "text-foreground",
                        inRangeMid &&
                          "bg-accent/60 text-accent-foreground hover:bg-accent/70",
                        isToday &&
                          !isSel &&
                          !inRangeMid &&
                          "bg-muted font-medium text-foreground",
                        isSel &&
                          "bg-primary font-medium text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                        !isSel &&
                          !inRangeMid &&
                          inMonth &&
                          !isToday &&
                          "hover:bg-muted",
                        !isSel && !inRangeMid && !inMonth && "hover:bg-muted/50",
                        isDisabled && "pointer-events-none opacity-40",
                        isKbFocus &&
                          "z-[1] ring-2 ring-ring ring-offset-2 ring-offset-background"
                      )}
                      onClick={() => handleDayClick(day)}
                    >
                      {day.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
Calendar.displayName = "Calendar";

export { Calendar };
