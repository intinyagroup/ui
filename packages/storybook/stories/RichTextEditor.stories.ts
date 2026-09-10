import type { Meta, StoryObj } from "@storybook/svelte";
import { RichTextEditor } from "@intinyagroup/rich-text";

const sampleContent = `
  <h1>Project brief</h1>
  <p>Write with a calm, focused surface built for long-form work.</p>
  <h2>Objectives</h2>
  <ul data-type="taskList">
    <li data-checked="true"><label><input type="checkbox" checked="checked"><span>Define the content structure</span></label></li>
    <li data-checked="false"><label><input type="checkbox"><span>Review with the team</span></label></li>
  </ul>
  <blockquote><p>Good writing needs room to breathe.</p></blockquote>
  <div class="callout-box callout-info"><strong>Note</strong><span>Use slash commands to insert blocks quickly.</span></div>
`;

const meta = {
  title: "Editors/RichTextEditor",
  component: RichTextEditor,
  tags: ["autodocs"],
  args: {
    content: sampleContent,
    placeholder: "Start writing...",
    editable: true,
    mode: "classic",
    height: 520,
  },
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Classic: Story = {};

export const Bubble: Story = {
  args: {
    mode: "bubble",
  },
};

export const ReadOnly: Story = {
  args: {
    editable: false,
    mode: "none",
  },
};
