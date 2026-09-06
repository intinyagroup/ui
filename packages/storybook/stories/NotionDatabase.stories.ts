import type { Meta, StoryObj } from '@storybook/svelte';
import NotionDatabase, { type DatabaseProperty } from '@intinyagroup/notion-database/NotionDatabase.svelte';

interface RoadmapItem {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  date: string;
  owner: string;
  icon?: string;
}

const properties: DatabaseProperty[] = [
  { key: 'title', label: 'Feature / Task', type: 'title' },
  {
    key: 'status',
    label: 'Status',
    type: 'status',
    options: [
      { value: 'To Do', label: 'To Do', color: '#64748b' },
      { value: 'In Progress', label: 'In Progress', color: '#2563eb' },
      { value: 'Done', label: 'Done', color: '#059669' }
    ]
  },
  { key: 'priority', label: 'Priority', type: 'select' },
  { key: 'date', label: 'Target Date', type: 'date' },
  { key: 'owner', label: 'Owner', type: 'text' }
];

const mockItems: RoadmapItem[] = [
  { id: '1', title: 'Q3 Mobile App Launch', status: 'In Progress', priority: 'High', date: '2026-09-15', owner: 'Joshua', icon: '📱' },
  { id: '2', title: 'Design System Migration to Ark UI', status: 'Done', priority: 'Medium', date: '2026-09-02', owner: 'Budi Santoso', icon: '🎨' },
  { id: '3', title: 'Postgres Vector Tuning', status: 'To Do', priority: 'High', date: '2026-09-28', owner: 'Alex Wong', icon: '⚡' },
  { id: '4', title: 'Auth0 to Supabase Cutover', status: 'In Progress', priority: 'High', date: '2026-09-12', owner: 'Dewi Lestari', icon: '🔐' },
  { id: '5', title: 'Dark Theme Color Calibration', status: 'Done', priority: 'Low', date: '2026-09-01', owner: 'Siti Rahma', icon: '🌙' }
];

const meta = {
  title: 'Notion/NotionDatabase (Multi-View)',
  component: NotionDatabase,
  tags: ['autodocs'],
  args: {
    title: 'Product Engineering Roadmap',
    icon: '🚀',
    items: mockItems,
    properties,
    activeView: 'table'
  }
} satisfies Meta<typeof NotionDatabase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TableView: Story = {
  args: {
    activeView: 'table'
  }
};

export const BoardKanbanView: Story = {
  args: {
    activeView: 'board'
  }
};

export const CalendarTimelineView: Story = {
  args: {
    activeView: 'calendar'
  }
};

export const GalleryCardsView: Story = {
  args: {
    activeView: 'gallery'
  }
};
