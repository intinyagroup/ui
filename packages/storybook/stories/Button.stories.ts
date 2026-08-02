import type { Meta, StoryObj } from '@storybook/svelte';
import Button from '@intinyagroup/ui/components/button/Button.svelte';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'icon-sm']
    }
  }
} satisfies Meta<Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Button'
  }
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete'
  }
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary'
  }
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost'
  }
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small'
  }
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled'
  }
};
