import type { Meta, StoryObj } from "@storybook/svelte";
import { TreeGrid } from "@intinyagroup/data-table";

interface DepartmentNode {
  id: string;
  name: string;
  head: string;
  budget: string;
  headcount: number;
  parentId?: string | null;
}

const mockOrgTree: DepartmentNode[] = [
  {
    id: "1",
    name: "Corporate HQ",
    head: "Elena Vance",
    budget: "$12,000,000",
    headcount: 340,
    parentId: null,
  },
  {
    id: "2",
    name: "Product & Engineering",
    head: "Gordon Freeman",
    budget: "$6,500,000",
    headcount: 180,
    parentId: "1",
  },
  {
    id: "3",
    name: "Core Platform",
    head: "Alyx Vance",
    budget: "$2,800,000",
    headcount: 75,
    parentId: "2",
  },
  {
    id: "4",
    name: "Frontend Infrastructure",
    head: "Barney Calhoun",
    budget: "$1,200,000",
    headcount: 35,
    parentId: "3",
  },
  {
    id: "5",
    name: "Backend Infrastructure",
    head: "Isaac Kleiner",
    budget: "$1,600,000",
    headcount: 40,
    parentId: "3",
  },
  {
    id: "6",
    name: "Design & UX",
    head: "Judith Mossman",
    budget: "$950,000",
    headcount: 22,
    parentId: "2",
  },
  {
    id: "7",
    name: "Sales & Marketing",
    head: "Wallace Breen",
    budget: "$3,400,000",
    headcount: 110,
    parentId: "1",
  },
  {
    id: "8",
    name: "Enterprise Sales",
    head: "Arne Magnusson",
    budget: "$2,100,000",
    headcount: 65,
    parentId: "7",
  },
  {
    id: "9",
    name: "Growth & Brand",
    head: "Eli Vance",
    budget: "$1,300,000",
    headcount: 45,
    parentId: "7",
  },
  {
    id: "10",
    name: "Operations & Legal",
    head: "G-Man",
    budget: "$2,100,000",
    headcount: 50,
    parentId: "1",
  },
];

const columns = [
  {
    id: "name",
    header: "Department / Team",
    accessorKey: "name" as const,
    treeColumn: true,
  },
  { id: "head", header: "Head of Dept", accessorKey: "head" as const },
  { id: "budget", header: "Annual Budget", accessorKey: "budget" as const },
  {
    id: "headcount",
    header: "Headcount",
    accessorKey: "headcount" as const,
    align: "right" as const,
  },
];

const meta = {
  title: "Data/TreeGrid",
  component: TreeGrid,
  tags: ["autodocs"],
  args: {
    data: mockOrgTree,
    columns,
    title: "Organization Hierarchy",
    searchable: true,
    selectable: true,
    defaultExpanded: ["1", "2"],
  },
} satisfies Meta<typeof TreeGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllExpanded: Story = {
  args: {
    data: mockOrgTree,
    columns,
    title: "Organization Hierarchy (Fully Expanded)",
    defaultExpanded: true,
    selectable: true,
  },
};
