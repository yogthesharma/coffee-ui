import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Foundation/Theme tokens",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Reference swatches for OKLCH CSS variables wired in tailwind.config.js. Use the **Theme** toolbar (Light / Dark) and the **Preset** toolbar (Default / Ocean / Rose) to compare token overrides defined on `html[data-preset]` in `index.css`.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const swatch = (name: string, className: string) => (
  <div className="flex items-center gap-3">
    <div
      className={`size-10 shrink-0 rounded-md border border-border shadow-sm ${className}`}
      aria-hidden
    />
    <code className="text-xs text-muted-foreground">{name}</code>
  </div>
);

export const SemanticColors: Story = {
  render: () => (
    <div className="grid max-w-md gap-3 text-sm">
      {swatch("background", "bg-background")}
      {swatch("foreground (text)", "bg-foreground")}
      {swatch("card", "bg-card")}
      {swatch("muted", "bg-muted")}
      {swatch("accent", "bg-accent")}
      {swatch("primary", "bg-primary")}
      {swatch("secondary", "bg-secondary")}
      {swatch("destructive", "bg-destructive")}
      {swatch("border", "bg-border")}
      {swatch("ring (same as ring utility)", "bg-ring")}
      {swatch("popover", "bg-popover")}
      {swatch("chart-1", "bg-chart-1")}
      {swatch("chart-2", "bg-chart-2")}
      {swatch("sidebar", "bg-sidebar")}
      {swatch("sidebar-primary", "bg-sidebar-primary")}
    </div>
  ),
};
