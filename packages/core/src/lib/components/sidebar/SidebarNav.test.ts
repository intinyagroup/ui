import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, it, expect, vi } from "vitest";
import SidebarNav from "./SidebarNav.svelte";
import type { SidebarNavItemData } from "./SidebarNavItem.svelte";

describe("SidebarNav", () => {
  const sampleItems: SidebarNavItemData[] = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard" },
    {
      id: "settings",
      label: "Settings",
      children: [
        { id: "settings-profile", label: "Profile", href: "/settings/profile" },
        {
          id: "settings-billing",
          label: "Billing",
          href: "/settings/billing",
          hidden: true,
        },
      ],
    },
  ];

  it("renders without throwing ReferenceError when onNavigate is omitted", () => {
    expect(() => {
      render(SidebarNav, { items: sampleItems });
    }).not.toThrow();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("calls onNavigate callback when an item is clicked", async () => {
    const handleNavigate = vi.fn();
    render(SidebarNav, {
      items: sampleItems,
      onNavigate: handleNavigate,
    });

    const dashboardItem = screen.getByText("Dashboard");
    await fireEvent.click(dashboardItem);

    expect(handleNavigate).toHaveBeenCalledTimes(1);
    expect(handleNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ id: "dashboard", label: "Dashboard" }),
    );
  });

  it("filters out items with static hidden or dynamic hidden callback", () => {
    const items: SidebarNavItemData[] = [
      { id: "1", label: "Visible Item" },
      { id: "2", label: "Static Hidden", hidden: true },
      { id: "3", label: "Dynamic Hidden", hidden: () => true },
    ];

    render(SidebarNav, { items });

    expect(screen.getByText("Visible Item")).toBeInTheDocument();
    expect(screen.queryByText("Static Hidden")).not.toBeInTheDocument();
    expect(screen.queryByText("Dynamic Hidden")).not.toBeInTheDocument();
  });

  it("supports app-level filterItem predicate for custom visibility/permission filtering", () => {
    const allowedIds = ["dashboard", "settings", "settings-profile"];

    render(SidebarNav, {
      items: sampleItems,
      defaultExpanded: ["settings"],
      filterItem: (item) => allowedIds.includes(item.id),
    });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.queryByText("Billing")).not.toBeInTheDocument();
  });

  it("supports controlled expansion and reports expanded ids", async () => {
    const onExpandedChange = vi.fn();
    render(SidebarNav, {
      items: sampleItems,
      expanded: [],
      onExpandedChange,
    });

    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    await fireEvent.click(screen.getByText("Settings"));

    expect(onExpandedChange).toHaveBeenCalledWith(["settings"]);
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("keeps filtered parents when a descendant passes filterItem", () => {
    render(SidebarNav, {
      items: [
        {
          id: "parent",
          label: "Parent",
          children: [{ id: "allowed", label: "Allowed" }],
        },
      ],
      defaultExpanded: ["parent"],
      filterItem: (item) => item.id === "allowed",
    });

    expect(screen.getByText("Parent")).toBeInTheDocument();
    expect(screen.getByText("Allowed")).toBeInTheDocument();
  });

  it("auto-expands ancestors of active descendants", () => {
    render(SidebarNav, {
      items: sampleItems,
      activeId: "settings-profile",
    });

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Settings" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("moves focus between visible nav items with ArrowDown", async () => {
    render(SidebarNav, {
      items: [
        { id: "first", label: "First" },
        { id: "second", label: "Second" },
      ],
    });

    const first = screen.getByRole("button", { name: "First" });
    const second = screen.getByRole("button", { name: "Second" });
    first.focus();
    await fireEvent.keyDown(first, { key: "ArrowDown" });

    expect(document.activeElement).toBe(second);
  });

  it("provides accessible labels for collapsed items", () => {
    render(SidebarNav, {
      items: [{ id: "search", label: "Search", shortcut: "⌘K" }],
      collapsed: true,
    });

    const item = screen.getByRole("button", { name: "Search — ⌘K" });
    expect(item).toHaveAttribute("title", "Search — ⌘K");
  });

  it("renders generic sections and item metadata", () => {
    render(SidebarNav, {
      items: [
        {
          id: "reports",
          label: "Reports",
          section: "Workspace",
          badge: 3,
          badgeTone: "info",
          shortcut: "G R",
          external: true,
        },
      ],
    });

    expect(screen.getByText("Workspace")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("G R")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reports/ })).toBeInTheDocument();
  });
});
