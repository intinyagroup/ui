<script lang="ts">
  import { cn } from '../../utils.js';

  let {
    content = '',
    class: className,
  }: {
    content?: string;
    class?: string;
  } = $props();

  function renderMarkdown(md: string): string {
    let html = md;

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold & Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Code
    html = html.replace(/```(\w*)\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>');
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

    // Links & Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full rounded" />');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-[var(--ui-primary)] hover:underline">$1</a>');

    // Blockquote
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-[var(--ui-primary)] pl-4 text-[var(--ui-muted-foreground)]">$1</blockquote>');

    // Lists
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/gim, '<ul class="list-disc pl-6">$1</ul>');

    // Horizontal rule
    html = html.replace(/^---$/gim, '<hr class="my-4 border-[var(--ui-border)]" />');

    // Paragraphs
    html = html.replace(/\n\n/gim, '</p><p>');
    html = `<p>${html}</p>`;
    html = html.replace(/<p><\/p>/gim, '');

    return html;
  }
</script>

<div class={cn('prose prose-sm max-w-none', className)}>
  {@html renderMarkdown(content)}
</div>
