import type { Meta, StoryObj } from '@storybook/svelte';
import DateRangePicker from '@intinyagroup/calendar/DateRangePicker.svelte';

const meta = {
  title: 'Calendar/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  args: {
    placeholder: 'Pick range (e.g. Vacation)...',
    locale: 'en-US',
    firstDayOfWeek: 0
  }
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IndonesianLocaleWithMondayStart: Story = {
  args: {
    locale: 'id-ID',
    firstDayOfWeek: 1,
    placeholder: 'Pilih rentang tanggal...'
  }
};

export const CustomPresets: Story = {
  args: {
    presets: [
      {
        label: 'Q1 (Jan - Mar)',
        range: {
          start: { year: 2026, month: 0, day: 1 },
          end: { year: 2026, month: 2, day: 31 }
        }
      },
      {
        label: 'Q2 (Apr - Jun)',
        range: {
          start: { year: 2026, month: 3, day: 1 },
          end: { year: 2026, month: 5, day: 30 }
        }
      },
      {
        label: 'Year 2026',
        range: {
          start: { year: 2026, month: 0, day: 1 },
          end: { year: 2026, month: 11, day: 31 }
        }
      }
    ]
  }
};
