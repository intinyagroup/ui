import type { Meta, StoryObj } from "@storybook/svelte";
import { SidebarNav } from "@intinyagroup/ui";
import {
  Activity,
  Calendar,
  FileText,
  Folder,
  Settings,
  Users,
} from "lucide-svelte";

const items = [
  { id: "overview", label: "Overview", href: "/overview", icon: Activity },
  {
    id: "workspace",
    label: "Workspace",
    icon: Folder,
    badge: 4,
    children: [
      { id: "projects", label: "Projects", href: "/projects", icon: FileText },
      {
        id: "calendar",
        label: "Calendar",
        href: "/calendar",
        icon: Calendar,
        badge: 2,
      },
      {
        id: "team",
        label: "Team",
        icon: Users,
        children: [
          { id: "members", label: "Members", href: "/members" },
          { id: "roles", label: "Roles", href: "/roles" },
        ],
      },
    ],
  },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
];

const meta = {
  title: "Navigation/SidebarNav",
  component: SidebarNav,
  tags: ["autodocs"],
  args: {
    items,
    activeId: "calendar",
    title: "Midory Workspace",
    defaultExpanded: ["workspace", "team"],
  },
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {};
export const Collapsed: Story = { args: { collapsed: true } };
