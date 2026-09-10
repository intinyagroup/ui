import type { Meta, StoryObj } from "@storybook/svelte";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@intinyagroup/ui/components/tabs";

const meta = {
  title: "Layout/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: {
    value: "account",
  },
} satisfies Meta<Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    Component: Tabs,
    props: args,
    children: [
      {
        Component: TabsList,
        children: [
          {
            Component: TabsTrigger,
            props: { value: "account" },
            children: "Account",
          },
          {
            Component: TabsTrigger,
            props: { value: "password" },
            children: "Password",
          },
          {
            Component: TabsTrigger,
            props: { value: "settings" },
            children: "Settings",
          },
        ],
      },
      {
        Component: TabsContent,
        props: { value: "account" },
        children: "Manage your account settings and personal preferences.",
      },
      {
        Component: TabsContent,
        props: { value: "password" },
        children: "Change your password and secure your login credentials.",
      },
      {
        Component: TabsContent,
        props: { value: "settings" },
        children: "Configure application notifications and display settings.",
      },
    ],
  }),
};
