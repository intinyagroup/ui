import type { Meta, StoryObj } from "@storybook/svelte";
import { DatePicker } from "@intinyagroup/calendar";

const meta = {
  title: "Calendar/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  args: {
    value: { year: 2026, month: 10, day: 7 },
    locale: "id-ID",
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IndonesianDefaultFormat: Story = {};

export const IndonesianLongFormat: Story = {
  args: { format: "d MMMM yyyy" },
};

export const USNumericFormat: Story = {
  args: { locale: "en-US", format: "MM/dd/yyyy" },
};
