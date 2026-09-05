import type { Meta, StoryObj } from '@storybook/svelte';
import DateRangePicker from '@intinyagroup/calendar/DateRangePicker.svelte';

const meta = {
  title: 'Calendar/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  args: {
    placeholder: 'Pick range (e.g. Vacation)...'
  }
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PreselectedRange: Story = {
  args: {
    value: {
      start: { year: 2026, month: 8, day: 5 },
      end: { year: 2026, month: 8, day: 18 }
    }
  }
};
