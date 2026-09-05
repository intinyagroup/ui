import type { Meta, StoryObj } from '@storybook/svelte';
import DataTable from '@intinyagroup/data-table/components/data-table/DataTable.svelte';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const mockData: User[] = [
  { id: '1', name: 'Joshua', email: 'joshua@intinya.dev', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Budi Santoso', email: 'budi@intinya.dev', role: 'Developer', status: 'Active' },
  { id: '3', name: 'Siti Rahma', email: 'siti@intinya.dev', role: 'Designer', status: 'Pending' },
  { id: '4', name: 'Alex Wong', email: 'alex@intinya.dev', role: 'Product Manager', status: 'Inactive' },
  { id: '5', name: 'Dewi Lestari', email: 'dewi@intinya.dev', role: 'Developer', status: 'Active' }
];

const mockColumns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Full Name' },
  { accessorKey: 'email', header: 'Email Address' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'status', header: 'Status' }
];

const meta = {
  title: 'Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  args: {
    data: mockData,
    columns: mockColumns,
    title: 'Users Management',
    description: 'Enterprise data table with server-side support, sorting, and export',
    searchable: true,
    exportable: true,
    selectable: true,
    densityToggle: true,
    columnToggle: true,
    pageSize: 10
  }
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithQuickFilters: Story = {
  args: {
    quickFilters: [
      { id: 'status', label: 'Active Only', value: 'Active' },
      { id: 'status', label: 'Pending Only', value: 'Pending' },
      { id: 'role', label: 'Developers', value: 'Developer' }
    ]
  }
};

export const WithPinnedRows: Story = {
  args: {
    pinnedRowIds: ['1'],
    description: 'First row (Joshua - Admin) is frozen at the top'
  }
};
