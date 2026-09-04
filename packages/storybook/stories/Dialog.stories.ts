import type { Meta, StoryObj } from '@storybook/svelte';
import Dialog from '@intinyagroup/ui/components/dialog/dialog.svelte';
import DialogTrigger from '@intinyagroup/ui/components/dialog/dialog-trigger.svelte';
import DialogContent from '@intinyagroup/ui/components/dialog/dialog-content.svelte';
import DialogHeader from '@intinyagroup/ui/components/dialog/dialog-header.svelte';
import DialogTitle from '@intinyagroup/ui/components/dialog/dialog-title.svelte';
import DialogDescription from '@intinyagroup/ui/components/dialog/dialog-description.svelte';
import DialogFooter from '@intinyagroup/ui/components/dialog/dialog-footer.svelte';
import DialogClose from '@intinyagroup/ui/components/dialog/dialog-close.svelte';
import Button from '@intinyagroup/ui/components/button/Button.svelte';

const meta = {
  title: 'Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs']
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
            props: { variant: 'outline', children: 'Open Dialog' }
          }
        ]
      },
      {
        Component: DialogContent,
        children: [
          {
            Component: DialogHeader,
            children: [
              { Component: DialogTitle, children: 'Edit Profile' },
              {
                Component: DialogDescription,
                children: 'Make changes to your profile here. Click save when done.'
              }
            ]
          },
          {
            Component: DialogFooter,
            children: [
              {
                Component: DialogClose,
                children: [
                  {
                    Component: Button,
                    props: { variant: 'default', children: 'Save changes' }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  })
};
