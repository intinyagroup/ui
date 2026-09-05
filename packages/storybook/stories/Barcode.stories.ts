import type { Meta, StoryObj } from '@storybook/svelte';
import Barcode from '@intinyagroup/ui/components/barcode/Barcode.svelte';

const meta = {
  title: 'Display/Barcode',
  component: Barcode,
  tags: ['autodocs'],
  args: {
    value: 'INTINYA-2026',
    format: 'code128',
    height: 80,
    width: 2,
    displayValue: true
  }
} satisfies Meta<typeof Barcode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ProductEAN: Story = {
  args: {
    value: '4006381333931',
    format: 'ean13',
    height: 100,
    displayValue: true
  }
};
