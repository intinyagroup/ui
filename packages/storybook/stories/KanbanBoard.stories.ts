import type { Meta, StoryObj } from '@storybook/svelte';
import KanbanBoard from '@intinyagroup/kanban/KanbanBoard.svelte';
import type { KanbanColumn, KanbanCard } from '@intinyagroup/kanban';

const columns: KanbanColumn[] = [
  { id: 'backlog', title: 'Backlog', color: '#6b7280' },
  { id: 'todo', title: 'To Do', color: '#3b82f6' },
  { id: 'in-progress', title: 'In Progress', color: '#f59e0b', wipLimit: 3 },
  { id: 'review', title: 'Review', color: '#8b5cf6' },
  { id: 'done', title: 'Done', color: '#10b981' }
];

const cards: KanbanCard[] = [
  { id: 'c1', columnId: 'backlog', title: 'Research auth providers', description: 'Evaluate OAuth providers for SSO integration', tags: ['research'], priority: 'low', assignee: 'Alice' },
  { id: 'c2', columnId: 'backlog', title: 'Database schema migration', description: 'Plan v2 schema changes', tags: ['backend', 'db'], priority: 'medium', assignee: 'Bob' },
  { id: 'c3', columnId: 'todo', title: 'Implement dark mode toggle', description: 'Add theme switcher to settings page', tags: ['frontend', 'ui'], priority: 'high', assignee: 'Carol' },
  { id: 'c4', columnId: 'todo', title: 'API rate limiting', description: 'Add rate limiting middleware', tags: ['backend'], priority: 'medium' },
  { id: 'c5', columnId: 'in-progress', title: 'Dashboard redesign', description: 'New layout with sidebar navigation', tags: ['frontend', 'ui'], priority: 'high', assignee: 'Alice', labels: [{ text: 'Sprint 5', color: '#2563eb' }] },
  { id: 'c6', columnId: 'in-progress', title: 'Fix login timeout bug', description: 'Session expires too quickly on mobile', tags: ['bug'], priority: 'high', assignee: 'Bob', labels: [{ text: 'Urgent', color: '#ef4444' }] },
  { id: 'c7', columnId: 'review', title: 'Update README docs', description: 'Add getting started guide', tags: ['docs'], priority: 'low', assignee: 'Carol' },
  { id: 'c8', columnId: 'done', title: 'Setup CI/CD pipeline', description: 'GitHub Actions for auto deploy', tags: ['devops'], priority: 'medium', assignee: 'Dave' }
];

const meta = {
  title: 'Kanban/KanbanBoard',
  component: KanbanBoard,
  tags: ['autodocs'],
  args: {
    columns,
    cards
  }
} satisfies Meta<typeof KanbanBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithWipLimits: Story = {
  args: {
    columns: columns.map(c => ({ ...c, wipLimit: c.id === 'in-progress' ? 2 : undefined }))
  }
};

export const WithSwimlanes: Story = {
  args: {
    swimlaneBy: 'priority'
  }
};

export const WithLabels: Story = {
  args: {
    cards: cards.map(c => ({
      ...c,
      labels: c.labels ?? (c.priority === 'high' ? [{ text: 'P1', color: '#ef4444' }] : c.priority === 'medium' ? [{ text: 'P2', color: '#f59e0b' }] : [{ text: 'P3', color: '#6b7280' }])
    }))
  }
};
