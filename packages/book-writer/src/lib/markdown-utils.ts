// ============================================
// Markdown utilities — export & import
// ============================================

import type { Chapter, BookMetadata, BookSettings } from './book-model.js';

/** Convert HTML to Markdown */
export function htmlToMarkdown(html: string): string {
  let md = html;

  // Headings
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

  // Bold & Italic
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  md = md.replace(/<u[^>]*>(.*?)<\/u>/gi, '<u>$1</u>');
  md = md.replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~');
  md = md.replace(/<del[^>]*>(.*?)<\/del>/gi, '~~$1~~');

  // Links & Images
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

  // Code
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  md = md.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, '```\n$1\n```\n');
  md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n');

  // Blockquote
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, (_, content) => {
    const lines = content.replace(/<[^>]*>/g, '').split('\n').filter(Boolean);
    return lines.map((line: string) => `> ${line.trim()}`).join('\n') + '\n\n';
  });

  // Lists
  md = md.replace(/<ul[^>]*>(.*?)<\/ul>/gi, (_, content) => {
    const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) ?? [];
    return items.map((item: string) => `- ${item.replace(/<[^>]*>/g, '').trim()}`).join('\n') + '\n\n';
  });
  md = md.replace(/<ol[^>]*>(.*?)<\/ol>/gi, (_, content) => {
    const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) ?? [];
    return items.map((item: string, i: number) => `${i + 1}. ${item.replace(/<[^>]*>/g, '').trim()}`).join('\n') + '\n\n';
  });

  // Horizontal rule
  md = md.replace(/<hr[^>]*\/?>/gi, '---\n\n');

  // Line breaks
  md = md.replace(/<br[^>]*\/?>/gi, '\n');
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

  // Remove remaining HTML tags
  md = md.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  md = md.replace(/&amp;/g, '&');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/&nbsp;/g, ' ');

  // Clean up whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.trim();

  return md;
}

/** Convert Markdown to HTML */
export function markdownToHtml(md: string): string {
  let html = md;

  // Headings
  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(/~~(.*?)~~/gim, '<del>$1</del>');

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>');
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

  // Links & Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

  // Blockquote
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Lists
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/gim, (match) => {
    if (match.includes('<li>')) return `<ul>${match}</ul>`;
    return match;
  });

  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr />');

  // Paragraphs
  html = html.replace(/\n\n/gim, '</p><p>');
  html = `<p>${html}</p>`;
  html = html.replace(/<p><\/p>/gim, '');

  return html;
}

/** Export chapters as Markdown file */
export function exportToMarkdown(metadata: BookMetadata, chapters: Chapter[]): string {
  let md = '';

  // Frontmatter
  md += '---\n';
  md += `title: "${metadata.title}"\n`;
  if (metadata.subtitle) md += `subtitle: "${metadata.subtitle}"\n`;
  md += `author: "${metadata.author}"\n`;
  if (metadata.isbn) md += `isbn: "${metadata.isbn}"\n`;
  if (metadata.publisher) md += `publisher: "${metadata.publisher}"\n`;
  md += '---\n\n';

  // Title page
  md += `# ${metadata.title}\n\n`;
  if (metadata.subtitle) md += `### ${metadata.subtitle}\n\n`;
  md += `**${metadata.author}**\n\n`;
  md += '---\n\n';

  // Chapters
  for (const chapter of chapters) {
    md += `# ${chapter.title}\n\n`;
    if (chapter.content) {
      md += htmlToMarkdown(chapter.content) + '\n\n';
    }
  }

  return md;
}

/** Download string as file */
export function downloadAsFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Download blob as file */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
