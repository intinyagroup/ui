import type { Meta, StoryObj } from '@storybook/svelte';
import QRCode from '@intinyagroup/ui/components/qr-code/QRCode.svelte';

const meta = {
  title: 'Display/QRCode',
  component: QRCode,
  tags: ['autodocs'],
  args: {
    value: 'https://intinya.dev',
    size: 160,
    errorCorrectionLevel: 'M'
  }
} satisfies Meta<typeof QRCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    size: 240,
    errorCorrectionLevel: 'H'
  }
};
