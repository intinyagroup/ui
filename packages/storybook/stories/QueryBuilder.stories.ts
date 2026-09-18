import type { Meta, StoryObj } from "@storybook/svelte";
import {
  QueryBuilder,
  createFilterGroup,
  createFilterRule,
} from "@intinyagroup/data-table";

const fields = [
  { id: "name", label: "Customer Name", type: "string" as const },
  { id: "age", label: "Age", type: "number" as const },
  {
    id: "plan",
    label: "Subscription Plan",
    type: "select" as const,
    options: [
      { label: "Free Starter", value: "free" },
      { label: "Professional", value: "pro" },
      { label: "Enterprise", value: "enterprise" },
    ],
  },
  { id: "verified", label: "Is Verified", type: "boolean" as const },
  { id: "created_at", label: "Sign Up Date", type: "date" as const },
  { id: "mrr", label: "Monthly Revenue ($)", type: "number" as const },
];

const meta = {
  title: "Data/QueryBuilder",
  component: QueryBuilder,
  tags: ["autodocs"],
  args: {
    fields,
    showSql: true,
  },
} satisfies Meta<typeof QueryBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PreloadedQuery: Story = {
  args: {
    fields,
    showSql: true,
    value: createFilterGroup("and", [
      createFilterRule("plan", "equals", "enterprise"),
      createFilterGroup("or", [
        createFilterRule("mrr", "greaterThanOrEqual", 5000),
        createFilterRule("verified", "equals", true),
      ]),
    ]),
  },
};
