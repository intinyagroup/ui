import type { Meta, StoryObj } from '@storybook/svelte';
import SearchSelect from '@intinyagroup/ui/components/search-select/SearchSelect.svelte';

const frameworks = [
  { value: 'svelte', label: 'Svelte 5' },
  { value: 'react', label: 'React 19' },
  { value: 'vue', label: 'Vue 3' },
  { value: 'angular', label: 'Angular' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'astro', label: 'Astro' },
  { value: 'solid', label: 'SolidJS' }
];

const meta = {
  title: 'Form/SearchSelect (Select2 / MultiSelect)',
  component: SearchSelect,
  tags: ['autodocs'],
  args: {
    options: frameworks,
    placeholder: 'Select framework...',
    searchPlaceholder: 'Search framework (e.g. Svelte)...'
  }
} satisfies Meta<typeof SearchSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSelect: Story = {
  args: {
    multiple: false,
    value: 'svelte'
  }
};

export const MultiSelect: Story = {
  args: {
    multiple: true,
    value: ['svelte', 'react', 'nextjs'],
    placeholder: 'Pick multiple frameworks...'
  }
};

export const RemoteLoading: Story = {
  args: {
    loading: true,
    options: [],
    placeholder: 'Fetching options from API...'
  }
};
