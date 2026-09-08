import type { Meta, StoryObj } from '@storybook/svelte';
import Chart from '@intinyagroup/charts/Chart.svelte';

const meta = {
  title: 'Charts/Chart',
  component: Chart,
  tags: ['autodocs'],
  args: {
    type: 'bar',
    height: 300,
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue',
        data: [12000, 19000, 15000, 22000, 18000, 25000],
        backgroundColor: '#3b82f6',
        borderRadius: 6
      }]
    }
  }
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bar: Story = {};

export const Line: Story = {
  args: {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Users',
        data: [100, 250, 180, 400, 320, 550],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    }
  }
};

export const Doughnut: Story = {
  args: {
    type: 'doughnut',
    data: {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [{
        data: [55, 35, 10],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981']
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  }
};

export const Radar: Story = {
  args: {
    type: 'radar',
    data: {
      labels: ['Speed', 'Reliability', 'UX', 'Features', 'Security', 'Cost'],
      datasets: [{
        label: 'Product A',
        data: [85, 90, 75, 80, 95, 70],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)'
      }, {
        label: 'Product B',
        data: [70, 85, 90, 75, 80, 85],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.2)'
      }]
    }
  }
};
