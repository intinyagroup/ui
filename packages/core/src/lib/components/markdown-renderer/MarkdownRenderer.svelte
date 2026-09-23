<script lang="ts">
  import { cn } from "../../utils.js";

  let { content = "", class: className }: { content?: string; class?: string } =
    $props();

  function escapeHtml(value: string): string {
    return value.replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character] ?? character,
    );
  }

  function safeUrl(value: string, image = false): string {
    const url = value.trim();
    if (url.startsWith("/") && !url.startsWith("//")) return url;
    try {
      const parsed = new URL(url, "https://intinyagroup.local");
      const allowed = image ? ["https:"] : ["https:", "http:", "mailto:"];
      return allowed.includes(parsed.protocol) ? url : "#";
    } catch {
      return "#";
    }
  }

  function renderMarkdown(md: string): string {
    let html = escapeHtml(md);
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
    html = html.replace(/\*\*\*(.*?)\*\*\*/gim, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");
    html = html.replace(
      /```(\w*)\n([\s\S]*?)```/gim,
      '<pre><code class="language-$1">$2</code></pre>',
    );
    html = html.replace(/`([^`]+)`/gim, "<code>$1</code>");
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/gim,
      (_, alt: string, url: string) =>
        `<img src="${escapeHtml(safeUrl(url, true))}" alt="${alt}" class="max-w-full rounded" />`,
    );
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/gim,
      (_, label: string, url: string) =>
        `<a href="${escapeHtml(safeUrl(url))}" rel="noopener noreferrer" class="text-[var(--ui-primary)] hover:underline">${label}</a>`,
    );
    html = html.replace(
      /^> (.*$)/gim,
      '<blockquote class="border-l-4 border-[var(--ui-primary)] pl-4 text-[var(--ui-muted-foreground)]">$1</blockquote>',
    );
    html = html.replace(/^- (.*$)/gim, "<li>$1</li>");
    html = html.replace(
      /(<li>.*<\/li>\n?)+/gim,
      '<ul class="list-disc pl-6">$1</ul>',
    );
    html = html.replace(
      /^---$/gim,
      '<hr class="my-4 border-[var(--ui-border)]" />',
    );
    html = html.replace(/\n\n/gim, "</p><p>");
    return `<p>${html}</p>`.replace(/<p><\/p>/gim, "");
  }
</script>

<div class={cn("prose prose-sm max-w-none", className)}>
  {@html renderMarkdown(content)}
</div>
