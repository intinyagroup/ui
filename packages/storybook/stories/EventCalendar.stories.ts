import type { Meta, StoryObj } from '@storybook/svelte';
import EventCalendar, { type CalendarEvent } from '@intinyagroup/calendar/EventCalendar.svelte';

const now = new Date();
const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Sprint Planning',
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30),
    end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0),
    color: '#2563eb',
    description: 'Quarterly roadmap grooming'
  },
  {
    id: '2',
    title: 'Design Critique',
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
    end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 30),
    color: '#7c3aed',
    description: 'UI components review'
  },
  {
    id: '3',
    title: 'Team Sync & Demo',
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 16, 0),
    end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 17, 0),
    color: '#059669',
    description: 'Weekly demo session'
  }
];

const meta = {
  title: 'Calendar/EventCalendar (FullCalendar)',
  component: EventCalendar,
  tags: ['autodocs'],
  args: {
    events: sampleEvents,
    view: 'month',
    locale: 'en-US',
    firstDayOfWeek: 0,
    enableEventModal: true
  }
} satisfies Meta<typeof EventCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MonthView: Story = {
  args: {
    view: 'month'
  }
};

export const WeekView: Story = {
  args: {
    view: 'week'
  }
};

export const DayView: Story = {
  args: {
    view: 'day'
  }
};

export const IndonesianLocaleWithMondayStart: Story = {
  args: {
    locale: 'id-ID',
    firstDayOfWeek: 1,
    view: 'month'
  }
};
