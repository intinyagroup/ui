import type { Meta, StoryObj } from "@storybook/svelte";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Button,
} from "@intinyagroup/ui/components/dialog";

const meta = {
  title: "Overlay/Dialog",
  component: Dialog,
  tags: ["autodocs"],
} satisfies Meta<Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    Component: Dialog,
    children: [
      {
        Component: DialogTrigger,
        children: [
          {
            Component: Button,
            props: { variant: "outline", children: "Open Dialog" },
          },
        ],
      },
      {
        Component: DialogContent,
        children: [
          {
            Component: DialogHeader,
            children: [
              { Component: DialogTitle, children: "Edit Profile" },
              {
                Component: DialogDescription,
                children:
                  "Make changes to your profile here. Click save when done.",
              },
            ],
          },
          {
            Component: DialogFooter,
            children: [
              {
                Component: DialogClose,
                children: [
                  {
                    Component: Button,
                    props: { variant: "default", children: "Save changes" },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }),
};
