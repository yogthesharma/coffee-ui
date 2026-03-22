import type { Preview } from "@storybook/react";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { ToastProvider } from "@coffee-ui/ui/toast";
import "../src/index.css";

function ThemeSync({
  theme,
  preset,
  children,
}: {
  theme: string;
  preset: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    if (preset === "default" || !preset) {
      delete root.dataset.preset;
    } else {
      root.dataset.preset = preset;
    }
  }, [theme, preset]);
  return children;
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Light or dark semantic tokens",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
    preset: {
      description: "Primary/accent token preset (see index.css data-preset)",
      defaultValue: "default",
      toolbar: {
        title: "Preset",
        icon: "paintbrush",
        items: [
          { value: "default", title: "Default" },
          { value: "ocean", title: "Ocean" },
          { value: "rose", title: "Rose" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <ThemeSync
        theme={String(context.globals.theme ?? "light")}
        preset={String(context.globals.preset ?? "default")}
      >
        <ToastProvider>
          <Story />
        </ToastProvider>
      </ThemeSync>
    ),
  ],
  parameters: {
    layout: "padded",
    /** @storybook/addon-a11y: use the “Accessibility” panel to audit portaled overlays. */
    a11y: {
      manual: false,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date/i,
      },
    },
    backgrounds: {
      default: "canvas",
      values: [
        { name: "canvas", value: "transparent" },
        { name: "stone light", value: "#fafaf9" },
        { name: "stone dark", value: "#0c0a0a" },
      ],
    },
  },
};

export default preview;
