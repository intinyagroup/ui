import type { Meta, StoryObj } from '@storybook/svelte';
import EventCalendar, { type CalendarEvent } from '@intinyagroup/calendar/EventCalendar.svelte';

const now = new Date();
const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Global Engineering Sync',
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0),
    end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 30),
    color: '#2563eb',
    description: 'Quarterly roadmap grooming'
  },
  {
    id: '2',
    title: 'Tokyo Design Review',
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
    end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 30),
    color: '#7c3aed',
    description: 'Design system tokens check'
  }
];

const meta = {
  title: 'Calendar/EventCalendar (FullCalendar)',
  component: EventCalendar,
  tags: ['autodocs'],
  args: {
    events: sampleEvents,
    view: 'week',
    locale: 'en-US',
    firstDayOfWeek: 0,
    enableEventModal: true
  }
} satisfies Meta<typeof EventCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultBrowserTimezone: Story = {};

export const JakartaTimezoneWIB: Story = {
  args: {
    timeZone: 'Asia/Jakarta',
    locale: 'id-ID',
    firstDayOfWeek: 1,
    view: 'week'
  }
};

export const TokyoTimezoneJST: Story = {
  args: {
    timeZone: 'Asia/Tokyo',
    view: 'week'
  }
};

export const LondonTimezoneUTC: Story = {
  args: {
    timeZone: 'Europe/London',
    view: 'day'
  }
};
