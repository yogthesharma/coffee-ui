import type { Meta, StoryObj } from "@storybook/react";
import { IconRocket } from "@tabler/icons-react";
import { Button } from "@coffee-ui/ui/button";
import {
  useToast,
  type ToastPosition,
  type ToastSize,
} from "@coffee-ui/ui/toast";

const meta = {
  title: "Components/Toast",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function ToastDemo() {
    const { toast } = useToast();
    return (
      <div className="relative overflow-hidden rounded-lg border border-dashed border-border bg-muted/30 p-6">
        <p className="mb-4 max-w-xl text-sm text-muted-foreground">
          Toasts use a frosted panel so the page behind stays visible. Semantic
          variants include a default icon (except neutral default).
        </p>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--border) 0, var(--border) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(0deg, var(--border) 0, var(--border) 1px, transparent 1px, transparent 24px)",
          }}
          aria-hidden
        />
        <div className="relative flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              toast({
                title: "Saved",
                description: "Your changes were stored successfully.",
              })
            }
          >
            Default
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              toast({
                variant: "success",
                title: "Published",
                description: "The page is live.",
                duration: 4000,
              })
            }
          >
            Success
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              toast({
                variant: "destructive",
                title: "Something failed",
                description: "Try again in a moment.",
              })
            }
          >
            Destructive
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              toast({
                variant: "warning",
                title: "Heads up",
                description: "Your trial ends in 3 days.",
              })
            }
          >
            Warning
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              toast({
                variant: "info",
                title: "Tip",
                description: "You can press ⌘K to open the command palette.",
              })
            }
          >
            Info
          </Button>
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: function ToastSizesDemo() {
    const { toast } = useToast();
    return (
      <div className="flex flex-wrap gap-2">
        {(["sm", "md", "lg"] as const satisfies ToastSize[]).map((size) => (
          <Button
            key={size}
            type="button"
            variant="outline"
            onClick={() =>
              toast({
                size,
                variant: "success",
                title: `${size.toUpperCase()} toast`,
                description: "Padding, type, and icons scale with size.",
                duration: 5000,
              })
            }
          >
            Size {size}
          </Button>
        ))}
      </div>
    );
  },
};

const POSITIONS: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export const Positions: Story = {
  render: function ToastPositionsDemo() {
    const { toast } = useToast();
    return (
      <div className="space-y-3">
        <p className="max-w-lg text-sm text-muted-foreground">
          Each toast can set <code className="text-foreground">position</code>.
          Open several to see stacks per corner.
        </p>
        <div className="flex max-w-2xl flex-wrap gap-2">
          {POSITIONS.map((position) => (
            <Button
              key={position}
              type="button"
              size="sm"
              variant="secondary"
              onClick={() =>
                toast({
                  position,
                  variant: "info",
                  title: position.replace(/-/g, " "),
                  description: "Anchored to this edge of the viewport.",
                  duration: 6000,
                })
              }
            >
              {position}
            </Button>
          ))}
        </div>
      </div>
    );
  },
};

export const CustomIcon: Story = {
  render: function ToastCustomIconDemo() {
    const { toast } = useToast();
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            toast({
              title: "Deployment started",
              description: "We will notify you when it finishes.",
              icon: (
                <IconRocket className="size-5 shrink-0 text-primary" aria-hidden />
              ),
            })
          }
        >
          Custom icon
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            toast({
              variant: "success",
              title: "No icon",
              description: "Pass icon: null to hide even semantic defaults.",
              icon: null,
            })
          }
        >
          Hide icon (success)
        </Button>
      </div>
    );
  },
};

export const WithAction: Story = {
  render: function ToastActionDemo() {
    const { toast } = useToast();
    return (
      <Button
        type="button"
        onClick={() =>
          toast({
            title: "Undo available",
            description: "The item was removed from the list.",
            duration: 8000,
            action: {
              label: "Undo",
              onClick: () => undefined,
            },
          })
        }
      >
        Toast with action
      </Button>
    );
  },
};

export const Persistent: Story = {
  render: function ToastPersistentDemo() {
    const { toast } = useToast();
    return (
      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          toast({
            title: "Stays until dismissed",
            description: "duration is 0 — close with the X.",
            duration: 0,
          })
        }
      >
        Non-auto-dismiss
      </Button>
    );
  },
};
