// ============================================
// Cross-reference utilities — link chapters, pages, figures
// ============================================

import type { Chapter } from './book-model.js';

export type CrossRefType = 'chapter' | 'page' | 'figure' | 'table' | 'footnote';

export type CrossRef = {
  id: string;
  type: CrossRefType;
  targetId: string;
  label: string;
  pageNumber?: number;
};

/**
 * Generate cross-reference label
 * e.g., {ref:ch:3} → "Chapter 3"
 * e.g., {ref:pg:42} → "page 42"
 */
export function resolveCrossRef(
  ref: string,
  chapters: Chapter[],
  pageNumbers?: Map<string, number>
): string {
  const match = ref.match(/\{ref:(\w+):(.+?)\}/);
  if (!match) return ref;

  const [, type, targetId] = match;

  switch (type) {
    case 'ch': {
      const index = chapters.findIndex((ch) => ch.id === targetId || ch.title === targetId);
      if (index >= 0) return `Chapter ${index + 1}`;
      // Try by number
      const num = parseInt(targetId);
      if (!isNaN(num) && chapters[num - 1]) return `Chapter ${num}`;
      return `[Chapter ${targetId}]`;
    }
    case 'pg': {
      const num = parseInt(targetId);
      return `page ${num}`;
    }
    case 'fig': {
      return `Figure ${targetId}`;
    }
    case 'tbl': {
      return `Table ${targetId}`;
    }
    case 'fn': {
      return `[${targetId}]`;
    }
    default:
      return ref;
  }
}

/**
 * Insert cross-reference marker into content
 */
export function insertCrossRef(
  content: string,
  type: CrossRefType,
  targetId: string,
  label?: string
): string {
  const ref = `{ref:${type}:${targetId}}`;
  const displayLabel = label ?? resolveCrossRef(ref, []);
  const marker = `<span class="cross-ref" data-ref-type="${type}" data-ref-target="${targetId}" style="color: var(--ui-primary); cursor: pointer;">${displayLabel}</span>`;
  return content + marker;
}

/**
 * Extract all cross-references from HTML content
 */
export function extractCrossRefs(html: string): CrossRef[] {
  const refs: CrossRef[] = [];
  const regex = /<span[^>]*class="cross-ref"[^>]*data-ref-type="(\w+)"[^>]*data-ref-target="([^"]*)"[^>]*>(.*?)<\/span>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    refs.push({
      id: `xref-${refs.length + 1}`,
      type: match[1] as CrossRefType,
      targetId: match[2],
      label: match[3],
    });
  }

  return refs;
}

/**
 * Render cross-references for export
 * Replaces markers with plain text labels
 */
export function renderCrossRefs(html: string, chapters: Chapter[]): string {
  return html.replace(
    /<span[^>]*class="cross-ref"[^>]*data-ref-type="(\w+)"[^>]*data-ref-target="([^"]*)"[^>]*>(.*?)<\/span>/gi,
    (_, type, targetId, label) => {
      return label || resolveCrossRef(`{ref:${type}:${targetId}}`, chapters);
    }
  );
}

/**
 * Generate chapter anchor for cross-referencing
 */
export function generateChapterAnchor(chapter: Chapter, index: number): string {
  return `ch-${index + 1}-${chapter.id}`;
}

/**
 * Build a cross-reference dialog options list
 */
export function getCrossRefOptions(chapters: Chapter[]): { value: string; label: string; type: CrossRefType }[] {
  const options: { value: string; label: string; type: CrossRefType }[] = [];

  chapters.forEach((ch, i) => {
    options.push({
      value: `chapter:${ch.id}`,
      label: `Chapter ${i + 1}: ${ch.title}`,
      type: 'chapter',
    });
  });

  // Add common page numbers
  for (const pg of [1, 5, 10, 20, 50, 100]) {
    options.push({ value: `page:${pg}`, label: `Page ${pg}`, type: 'page' });
  }

  return options;
}
