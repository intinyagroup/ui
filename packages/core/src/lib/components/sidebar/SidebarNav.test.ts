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
});
