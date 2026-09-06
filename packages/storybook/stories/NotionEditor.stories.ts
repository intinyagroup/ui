import type { Meta, StoryObj } from '@storybook/svelte';
import RichTextEditor from '@intinyagroup/rich-text/components/RichTextEditor.svelte';

const notionContent = `
  <h1>Product Strategy Document</h1>
  <p>Halaman ini mendokumentasikan spesifikasi fitur utama. Ketik '/' untuk memasukkan blok baru.</p>

  <div data-type="callout" class="callout-box callout-tip">
    <p>💡 Tip: Klik sub-page card di bawah ini untuk melihat dokumen anak!</p>
  </div>

  <div data-type="subpage" data-page-id="sub-101" data-page-title="Arsitektur Backend & Database" class="subpage-block">
    <span>📄</span>
    <span>Arsitektur Backend & Database</span>
  </div>

  <div data-type="subpage" data-page-id="sub-102" data-page-title="Design Tokens & Brand Specs" class="subpage-block">
    <span>🎨</span>
    <span>Design Tokens & Brand Specs</span>
  </div>

  <ul data-type="taskList">
    <li data-checked="true"><label><input type="checkbox" checked /></label><div>Migrasi Ark UI core</div></li>
    <li data-checked="false"><label><input type="checkbox" /></label><div>Notion-style Database View integration</div></li>
  </ul>
`;

const meta = {
  title: 'Notion/NotionEditor (SubPages & Checklists)',
  component: RichTextEditor,
  tags: ['autodocs'],
  args: {
    mode: 'bubble',
    placeholder: "Ketik '/' untuk memasukkan sub-page, heading, atau checklist...",
    content: notionContent
  }
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultNotionPage: Story = {};

export const ClassicModeWithToolbar: Story = {
  args: {
    mode: 'classic'
  }
};
