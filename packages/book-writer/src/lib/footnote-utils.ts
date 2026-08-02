// ============================================
// Footnote utilities — manage footnotes in content
// ============================================

export type Footnote = {
  id: string;
  number: number;
  content: string;
};

/**
 * Extract footnotes from HTML content
 * Footnotes are stored as <sup data-footnote="N">N</sup> markers
 * and <div data-footnote-content="N">...</div> definitions
 */
export function extractFootnotes(html: string): Footnote[] {
  const footnotes: Footnote[] = [];
  const contentRegex = /<div[^>]*data-footnote-content="(\d+)"[^>]*>(.*?)<\/div>/gi;
  let match;

  while ((match = contentRegex.exec(html)) !== null) {
    footnotes.push({
      id: `fn-${match[1]}`,
      number: parseInt(match[1]),
      content: match[2].replace(/<[^>]*>/g, ''),
    });
  }

  return footnotes.sort((a, b) => a.number - b.number);
}

/**
 * Insert a footnote marker at cursor position
 */
export function insertFootnoteMarker(html: string, number: number): string {
  const marker = `<sup data-footnote="${number}" class="footnote-marker cursor-pointer text-[var(--ui-primary)]">[${number}]</sup>`;
  return html + marker;
}

/**
 * Add footnote definition to content
 */
export function addFootnoteDefinition(html: string, number: number, content: string): string {
  const definition = `<div data-footnote-content="${number}" class="footnote-definition text-sm text-[var(--ui-muted-foreground)] border-t border-[var(--ui-border)] pt-2 mt-4">[${number}] ${content}</div>`;
  return html + definition;
}

/**
 * Render footnotes section for export
 */
export function renderFootnotesSection(footnotes: Footnote[]): string {
  if (footnotes.length === 0) return '';

  const items = footnotes
    .map((fn) => `<div class="footnote"><sup>${fn.number}</sup> ${fn.content}</div>`)
    .join('\n');

  return `<div class="footnotes-section" style="margin-top: 2em; padding-top: 1em; border-top: 1px solid #ccc; font-size: 0.9em;">
    <h3>Notes</h3>
    ${items}
  </div>`;
}

/**
 * Get next footnote number
 */
export function getNextFootnoteNumber(html: string): number {
  const markers = html.match(/data-footnote="(\d+)"/g) ?? [];
  if (markers.length === 0) return 1;
  const numbers = markers.map((m) => parseInt(m.match(/\d+/)?.[0] ?? '0'));
  return Math.max(...numbers) + 1;
}
