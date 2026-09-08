import type { Meta, StoryObj } from '@storybook/svelte';
import Spreadsheet from '@intinyagroup/spreadsheet/Spreadsheet.svelte';

const meta = {
  title: 'Data/Spreadsheet',
  component: Spreadsheet,
  tags: ['autodocs'],
  args: {
    rowCount: 50,
    colCount: 10
  }
} satisfies Meta<typeof Spreadsheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithData: Story = {
  args: {
    initialData: [{
      sheetName: 'Q3 Revenue',
      cells: new Map([
        ['A1', { value: 'Product', style: { bold: true } }],
        ['B1', { value: 'Revenue', style: { bold: true } }],
        ['C1', { value: 'Growth', style: { bold: true } }],
        ['A2', { value: 'Enterprise' }],
        ['B2', { value: '125000' }],
        ['C2', { value: '15%' }],
        ['A3', { value: 'SMB' }],
        ['B3', { value: '85000' }],
        ['C3', { value: '22%' }],
        ['A4', { value: 'Startup' }],
        ['B4', { value: '42000' }],
        ['C4', { value: '38%' }],
        ['A5', { value: 'Total', style: { bold: true } }],
        ['B5', { value: '252000', style: { bold: true } }],
        ['C5', { value: '21%', style: { bold: true } }]
      ])
    }]
  }
};
