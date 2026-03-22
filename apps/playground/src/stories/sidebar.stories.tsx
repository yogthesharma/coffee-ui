import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  IconHelp,
  IconLayoutDashboard,
  IconSettings,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarCollapseTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMobile,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@coffee-ui/ui/sidebar";

const meta = {
  title: "Components/Sidebar",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SidebarBrand() {
  const { collapsed } = useSidebar();
  return (
    <div className="flex items-center gap-2 px-1">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
        C
      </div>
      <span
        className={
          collapsed
            ? "sr-only"
            : "truncate text-sm font-semibold text-sidebar-foreground"
        }
      >
        Coffee UI
      </span>
    </div>
  );
}

function SidebarNavLinks() {
  const { setOpenMobile, collapsed } = useSidebar();
  const afterNav = () => setOpenMobile(false);

  return (
    <>
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive onClick={afterNav}>
                <IconLayoutDashboard stroke={1.75} aria-hidden />
                <span className="truncate">Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={afterNav}>
                <IconSettings stroke={1.75} aria-hidden />
                <span className="truncate">Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="https://example.com" onClick={afterNav}>
                  <IconHelp stroke={1.75} aria-hidden />
                  <span className="truncate">Help</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p
          className={
            collapsed
              ? "sr-only"
              : "px-2 text-xs text-sidebar-foreground/70"
          }
        >
          Signed in as{" "}
          <span className="text-sidebar-foreground">you@acme.dev</span>
        </p>
      </SidebarFooter>
    </>
  );
}

export const AppShell: Story = {
  render: function SidebarAppShellDemo() {
    return (
      <div className="space-y-4">
        <p className="max-w-xl text-sm text-muted-foreground">
          <strong className="text-foreground">md and up</strong>: fixed rail +{" "}
          <strong className="text-foreground">collapse</strong> (narrow icons).{" "}
          <strong className="text-foreground">Small screens</strong>:{" "}
          <strong className="text-foreground">menu</strong> opens the same nav in a{" "}
          <strong className="text-foreground">sheet</strong>. Resize the viewport or use
          Storybook&apos;s responsive toolbar to try both.
        </p>
        <SidebarProvider defaultCollapsed={false}>
          <div className="flex h-[min(28rem,70vh)] w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-background shadow-sm">
            <Sidebar className="hidden md:flex">
              <SidebarNavLinks />
            </Sidebar>
            <SidebarMobile>
              <SidebarNavLinks />
            </SidebarMobile>
            <SidebarInset>
              <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
                <SidebarTrigger />
                <SidebarCollapseTrigger />
                <span className="text-sm font-medium">Page title</span>
              </header>
              <div className="flex flex-1 flex-col gap-2 p-4 text-sm text-muted-foreground">
                <p>
                  Main content uses <code className="text-foreground">SidebarInset</code>{" "}
                  (<code className="text-foreground">main</code>) with{" "}
                  <code className="text-foreground">bg-background</code>.
                </p>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    );
  },
};
