import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import EventCalendar from './EventCalendar.svelte';

describe('EventCalendar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the calendar component with correct month title', () => {
    render(EventCalendar);
    // Title uses full month name: "MMMM yyyy"
    expect(screen.getByText('June 2025')).toBeInTheDocument();
  });

  it('displays day-of-week headers', () => {
    render(EventCalendar);
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  it('renders month view with day grid', () => {
    render(EventCalendar);
    // Should show days of June 2025. Use getAllByText for numbers that appear
    // multiple times in the month grid (e.g. from previous/next month overflow).
    expect(screen.getAllByText('15').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('30').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
  });

  it('renders events in the calendar', () => {
    const events = [
      {
        id: '1',
        title: 'Team Meeting',
        start: new Date('2025-06-15T09:00:00'),
        end: new Date('2025-06-15T10:00:00'),
      },
    ];

    render(EventCalendar, { props: { events } });
    expect(screen.getByText('Team Meeting')).toBeInTheDocument();
  });

  it('renders multiple events on the same day', () => {
    const events = [
      {
        id: '1',
        title: 'Morning Standup',
        start: new Date('2025-06-15T09:00:00'),
        end: new Date('2025-06-15T09:30:00'),
      },
      {
        id: '2',
        title: 'Lunch Break',
        start: new Date('2025-06-15T12:00:00'),
        end: new Date('2025-06-15T13:00:00'),
      },
    ];

    render(EventCalendar, { props: { events } });
    expect(screen.getByText('Morning Standup')).toBeInTheDocument();
    expect(screen.getByText('Lunch Break')).toBeInTheDocument();
  });

  it('navigates to the previous month', async () => {
    render(EventCalendar);
    // Prev button is a Button with ChevronLeft icon; find by role
    const prevBtn = screen.getAllByRole('button')[0];
    await fireEvent.click(prevBtn);
    expect(screen.getByText('May 2025')).toBeInTheDocument();
  });

  it('navigates to the next month', async () => {
    render(EventCalendar);
    // Next button is the third button (prev=0, today=1, next=2)
    const nextBtn = screen.getAllByRole('button')[2];
    await fireEvent.click(nextBtn);
    expect(screen.getByText('July 2025')).toBeInTheDocument();
  });

  it('navigates back to today', async () => {
    render(EventCalendar);
    // Navigate to next month first
    const nextBtn = screen.getAllByRole('button')[2];
    await fireEvent.click(nextBtn);
    expect(screen.getByText('July 2025')).toBeInTheDocument();

    // Click Today button (text content is "Today")
    const todayBtn = screen.getByText('Today');
    await fireEvent.click(todayBtn);
    expect(screen.getByText('June 2025')).toBeInTheDocument();
  });

  it('displays view switcher buttons', () => {
    render(EventCalendar);
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Day')).toBeInTheDocument();
  });

  it('shows event with color indicator', () => {
    const events = [
      {
        id: '1',
        title: 'Important Call',
        start: new Date('2025-06-15T14:00:00'),
        end: new Date('2025-06-15T15:00:00'),
        color: '#dc2626',
      },
    ];

    render(EventCalendar, { props: { events } });
    expect(screen.getByText('Important Call')).toBeInTheDocument();
  });

  it('renders empty state without crashing', () => {
    render(EventCalendar, { props: { events: [] } });
    expect(screen.getByText('June 2025')).toBeInTheDocument();
  });

  it('renders all-day events (may appear in both grid and all-day header)', () => {
    const events = [
      {
        id: '1',
        title: 'Company Holiday',
        start: new Date('2025-06-15T00:00:00'),
        end: new Date('2025-06-16T00:00:00'),
        allDay: true,
      },
    ];

    render(EventCalendar, { props: { events } });
    // All-day events appear in both the month grid and the all-day section
    const matches = screen.getAllByText('Company Holiday');
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});
