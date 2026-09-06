import type { Meta, StoryObj } from '@storybook/svelte';
import DataTable from '@intinyagroup/data-table/components/data-table/DataTable.svelte';

interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  salary: number;
  status: string;
}

const enterpriseData: Employee[] = [
  { id: '1', name: 'Joshua', department: 'Engineering', role: 'Architect', salary: 45000000, status: 'Active' },
  { id: '2', name: 'Budi Santoso', department: 'Engineering', role: 'Frontend Lead', salary: 35000000, status: 'Active' },
  { id: '3', name: 'Siti Rahma', department: 'Design', role: 'UI Lead', salary: 30000000, status: 'Active' },
  { id: '4', name: 'Dewi Lestari', department: 'Design', role: 'Product Designer', salary: 22000000, status: 'Pending' },
  { id: '5', name: 'Alex Wong', department: 'Product', role: 'VP Product', salary: 50000000, status: 'Active' }
];

const enterpriseColumns = [
  { accessorKey: 'name', header: 'Employee Name' },
  { accessorKey: 'department', header: 'Department' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'salary', header: 'Salary (IDR)' },
  { accessorKey: 'status', header: 'Status' }
];

const meta = {
  title: 'Data/DataTable (Enterprise AG-Grid Style)',
  component: DataTable,
  tags: ['autodocs'],
  args: {
    data: enterpriseData,
    columns: enterpriseColumns,
    title: 'Enterprise Personnel Grid',
    description: 'AG-Grid / Syncfusion style grid with floating filter row, inline cell editing, context menu, and row grouping tree',
    searchable: true,
    exportable: true,
    selectable: true,
    densityToggle: true,
    columnToggle: true,
    floatingFilter: true,
    contextMenu: true,
    grouping: true,
    keyboardNav: true,
    clipboard: true,
    editableColumns: ['role', 'salary', 'status']
  }
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FloatingFilterRow: Story = {
  args: {
    floatingFilter: true
  }
};

export const InPlaceEditing: Story = {
  args: {
    editableColumns: ['role', 'salary', 'status'],
    description: 'Click any Role, Salary, or Status cell to edit in-place with Enter/Escape handlers'
  }
};

export const RightClickContextMenu: Story = {
  args: {
    contextMenu: true,
    description: 'Right click on table area to open Enterprise Context Menu (Copy, Export, Clear Selection)'
  }
};

export const RowGroupingTree: Story = {
  args: {
    grouping: true,
    externalGrouping: ['department'],
    description: 'Grouped by Department with aggregation item counter pill and collapsible rows'
  }
};
