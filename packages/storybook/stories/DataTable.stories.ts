import type { Meta, StoryObj } from '@storybook/svelte';
import DataTable from '@intinyagroup/data-table/components/data-table/DataTable.svelte';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  joinedDate: string;
}

const mockData: User[] = [
  { id: '1', name: 'Joshua', email: 'joshua@intinya.dev', role: 'Lead Architect', status: 'Active', department: 'Core Engineering', joinedDate: '12 Jan 2024' },
  { id: '2', name: 'Budi Santoso', email: 'budi@intinya.dev', role: 'Senior Developer', status: 'Active', department: 'Frontend Platform', joinedDate: '01 Mar 2024' },
  { id: '3', name: 'Siti Rahma', email: 'siti@intinya.dev', role: 'UI/UX Designer', status: 'Pending', department: 'Design Systems', joinedDate: '15 Apr 2024' },
  { id: '4', name: 'Alex Wong', email: 'alex@intinya.dev', role: 'Product Manager', status: 'Inactive', department: 'Product Ops', joinedDate: '20 May 2024' },
  { id: '5', name: 'Dewi Lestari', email: 'dewi@intinya.dev', role: 'Frontend Engineer', status: 'Active', department: 'Web Experience', joinedDate: '10 Jun 2024' }
];

const mockColumns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'department', header: 'Department' },
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
      { id: 'department', label: 'Engineering Only', value: 'Core Engineering' }
    ]
  }
};

export const WithPinnedRows: Story = {
  args: {
    pinnedRowIds: ['1'],
    description: 'First row (Joshua - Lead Architect) is frozen at the top'
  }
};

export const MobileCardViewResponsive: Story = {
  args: {
    mobileCardView: true,
    expandable: true,
    description: 'Resize viewport to mobile (< 640px) to see automatic transformation into stacked card layout without horizontal overflow'
  }
};
