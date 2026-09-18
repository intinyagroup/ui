import type { Meta, StoryObj } from "@storybook/svelte";
import { FileManager, type FileItem } from "@intinyagroup/file-manager";

const sampleFiles: FileItem[] = [
  { id: "1", name: "Documents", type: "folder", parentId: null },
  { id: "2", name: "Design Assets", type: "folder", parentId: null },
  { id: "3", name: "Source Code", type: "folder", parentId: null },
  { id: "4", name: "Financials", type: "folder", parentId: "1" },
  {
    id: "5",
    name: "Quarterly Report Q3.pdf",
    type: "file",
    parentId: "4",
    size: 3450000,
    extension: "pdf",
    updatedAt: "2026-08-15",
  },
  {
    id: "6",
    name: "Balance Sheet 2026.xlsx",
    type: "file",
    parentId: "4",
    size: 1250000,
    extension: "xlsx",
    updatedAt: "2026-08-20",
  },
  {
    id: "7",
    name: "Brand Guidelines.pdf",
    type: "file",
    parentId: "2",
    size: 8900000,
    extension: "pdf",
    updatedAt: "2026-07-10",
  },
  {
    id: "8",
    name: "Hero Background.png",
    type: "file",
    parentId: "2",
    size: 4500000,
    extension: "png",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
    updatedAt: "2026-09-01",
  },
  {
    id: "9",
    name: "App Component.svelte",
    type: "file",
    parentId: "3",
    size: 18400,
    extension: "svelte",
    updatedAt: "2026-09-12",
  },
  {
    id: "10",
    name: "Server Router.ts",
    type: "file",
    parentId: "3",
    size: 32100,
    extension: "ts",
    updatedAt: "2026-09-14",
  },
  {
    id: "11",
    name: "Intro Keynote.mp4",
    type: "file",
    parentId: null,
    size: 48000000,
    extension: "mp4",
    updatedAt: "2026-09-05",
  },
  {
    id: "12",
    name: "Archive Backup.zip",
    type: "file",
    parentId: null,
    size: 124000000,
    extension: "zip",
    updatedAt: "2026-09-17",
  },
];

const meta = {
  title: "Application/FileManager",
  component: FileManager,
  tags: ["autodocs"],
  args: {
    items: sampleFiles,
    allowUpload: true,
    allowDelete: true,
    allowCreateFolder: true,
    showSidebar: true,
  },
} satisfies Meta<typeof FileManager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultGrid: Story = {};

export const ListView: Story = {
  args: {
    items: sampleFiles,
    viewMode: "list",
  },
};

export const WithoutSidebar: Story = {
  args: {
    items: sampleFiles,
    showSidebar: false,
  },
};
