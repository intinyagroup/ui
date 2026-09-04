import type { Meta, StoryObj } from '@storybook/svelte';
import Card from '@intinyagroup/ui/components/card/Card.svelte';
import CardHeader from '@intinyagroup/ui/components/card/CardHeader.svelte';
import CardTitle from '@intinyagroup/ui/components/card/CardTitle.svelte';
import CardDescription from '@intinyagroup/ui/components/card/CardDescription.svelte';
import CardContent from '@intinyagroup/ui/components/card/CardContent.svelte';
import CardFooter from '@intinyagroup/ui/components/card/CardFooter.svelte';

const meta = {
  title: 'Layout/Card',
  component: Card,
  tags: ['autodocs']
} satisfies Meta<Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    Component: Card,
    props: args,
    children: 'Card content'
  })
};

export const WithHeader: Story = {
  render: () => ({
    Component: Card,
    children: [
      {
        Component: CardHeader,
        children: [
          { Component: CardTitle, children: 'Card Title' },
          { Component: CardDescription, children: 'Card description goes here.' }
        ]
      },
      {
        Component: CardContent,
        children: 'This is the card body.'
      }
    ]
  })
};

export const Content: Story = {
  render: () => ({
    Component: Card,
    children: [
      {
        Component: CardContent,
        children: 'Only content inside this card.'
      }
    ]
  })
};

export const Footer: Story = {
  render: () => ({
    Component: Card,
    children: [
      {
        Component: CardHeader,
        children: [
          { Component: CardTitle, children: 'Notifications' },
          { Component: CardDescription, children: 'You have 3 unread messages.' }
        ]
      },
      {
        Component: CardContent,
        children: 'Manage your notification preferences.'
      },
      {
        Component: CardFooter,
        children: 'Footer actions'
      }
    ]
  })
};
