import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  IconBolt,
  IconBox,
  IconComponents,
  IconRocket,
} from "@tabler/icons-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@coffee-ui/ui/combobox";

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "vite", label: "Vite" },
];

const frameworksWithIcons = [
  { value: "next", label: "Next.js", Icon: IconBolt },
  { value: "remix", label: "Remix", Icon: IconRocket },
  { value: "astro", label: "Astro", Icon: IconBox },
  { value: "vite", label: "Vite", Icon: IconComponents },
] as const;

const meta = {
  title: "Widgets/Combobox",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function ComboboxDemo() {
    const [value, setValue] = React.useState("");
    const selected = frameworks.find((f) => f.value === value);
    return (
      <Combobox value={value} onValueChange={setValue}>
        <ComboboxTrigger className="w-[240px]">
          {selected?.label ?? "Pick a framework…"}
        </ComboboxTrigger>
        <ComboboxContent className="w-[240px]">
          <Command>
            <CommandInput placeholder="Search…" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((f) => (
                  <ComboboxItem key={f.value} value={f.value}>
                    {f.label}
                  </ComboboxItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </ComboboxContent>
      </Combobox>
    );
  },
};

/** Text-only rows; no leading or trailing icons in the list. */
export const TextOnlyList: Story = {
  name: "Text only (list)",
  render: function TextOnly() {
    const [value, setValue] = React.useState("");
    const selected = frameworks.find((f) => f.value === value);
    return (
      <Combobox value={value} onValueChange={setValue}>
        <ComboboxTrigger className="w-[240px]">
          {selected?.label ?? "Choose one…"}
        </ComboboxTrigger>
        <ComboboxContent className="w-[240px]">
          <Command>
            <CommandInput placeholder="Filter…" />
            <CommandList>
              <CommandEmpty>Nothing matches.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((f) => (
                  <ComboboxItem key={f.value} value={f.value}>
                    {f.label}
                  </ComboboxItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </ComboboxContent>
      </Combobox>
    );
  },
};

/** Leading icon in the trigger and in each row. */
export const WithTriggerAndRowIcons: Story = {
  name: "Trigger + row icons",
  render: function IconsEverywhere() {
    const [value, setValue] = React.useState("");
    const selected = frameworksWithIcons.find((f) => f.value === value);
    const SelectedIcon = selected?.Icon;
    return (
      <Combobox value={value} onValueChange={setValue}>
        <ComboboxTrigger className="w-[260px]">
          {SelectedIcon ? (
            <SelectedIcon
              stroke={1.75}
              className="size-4 shrink-0 opacity-80"
              aria-hidden
            />
          ) : null}
          <span className="truncate">
            {selected?.label ?? "Select stack…"}
          </span>
        </ComboboxTrigger>
        <ComboboxContent className="w-[260px]">
          <Command>
            <CommandInput placeholder="Search stacks…" />
            <CommandList>
              <CommandEmpty>No match.</CommandEmpty>
              <CommandGroup>
                {frameworksWithIcons.map(({ value: v, label, Icon }) => (
                  <ComboboxItem key={v} value={v}>
                    <Icon
                      stroke={1.75}
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    {label}
                  </ComboboxItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </ComboboxContent>
      </Combobox>
    );
  },
};

/** Compact control and denser list (utility classes on `Command` / items). */
export const Small: Story = {
  render: function SmallSize() {
    const [value, setValue] = React.useState("");
    const selected = frameworks.find((f) => f.value === value);
    return (
      <Combobox value={value} onValueChange={setValue}>
        <ComboboxTrigger size="sm" className="w-[200px]">
          {selected?.label ?? "Framework…"}
        </ComboboxTrigger>
        <ComboboxContent className="w-[200px]">
          <Command className="text-xs [&_input]:h-9 [&_input]:py-2 [&_input]:text-xs">
            <CommandInput placeholder="Search…" />
            <CommandList>
              <CommandEmpty className="py-4 text-xs">No results.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((f) => (
                  <ComboboxItem
                    key={f.value}
                    value={f.value}
                    className="gap-1.5 py-1.5 text-xs"
                  >
                    {f.label}
                  </ComboboxItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </ComboboxContent>
      </Combobox>
    );
  },
};

/** Larger trigger and list typography. */
export const Large: Story = {
  render: function LargeSize() {
    const [value, setValue] = React.useState("");
    const selected = frameworks.find((f) => f.value === value);
    return (
      <Combobox value={value} onValueChange={setValue}>
        <ComboboxTrigger size="lg" className="min-w-[16rem] w-[280px]">
          {selected?.label ?? "Pick a framework…"}
        </ComboboxTrigger>
        <ComboboxContent className="w-[280px]">
          <Command className="text-base [&_input]:h-12 [&_input]:py-3 [&_input]:text-base">
            <CommandInput placeholder="Search frameworks…" />
            <CommandList>
              <CommandEmpty className="py-8 text-base">No results.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((f) => (
                  <ComboboxItem
                    key={f.value}
                    value={f.value}
                    className="gap-3 py-2.5 text-base"
                  >
                    {f.label}
                  </ComboboxItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </ComboboxContent>
      </Combobox>
    );
  },
};

/** Outline trigger without the chevron (custom layout or paired control). */
export const HideChevron: Story = {
  name: "Hide chevron",
  render: function NoChevron() {
    const [value, setValue] = React.useState("");
    const selected = frameworks.find((f) => f.value === value);
    return (
      <Combobox value={value} onValueChange={setValue}>
        <ComboboxTrigger hideChevron className="w-[240px]">
          {selected?.label ?? "Open to choose…"}
        </ComboboxTrigger>
        <ComboboxContent className="w-[240px]">
          <Command>
            <CommandInput placeholder="Search…" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((f) => (
                  <ComboboxItem key={f.value} value={f.value}>
                    {f.label}
                  </ComboboxItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </ComboboxContent>
      </Combobox>
    );
  },
};
