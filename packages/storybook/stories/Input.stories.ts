import type { Meta, StoryObj } from '@storybook/svelte';
import Input from '@intinyagroup/ui/components/input/input.svelte';

const meta = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url']
    },
    disabled: {
      control: 'boolean'
    },
    placeholder: {
      control: 'text'
    }
  }
} satisfies Meta<Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'Default value'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Disabled input'
  }
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Enter your email address...'
  }
};

export const TypePassword: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...'
  }
};
