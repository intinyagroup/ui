// ============================================
// Recursive ContentBlock Book data model
// ============================================

export type ContentBlockType =
  | 'page'
  | 'section'
  | 'chapter'
  | 'subchapter'
  | 'prologue'
  | 'epilogue'
  | 'appendix'
  | 'preface';

export interface ContentBlock {
  id: string;
  parentId: string | null;
  title: string;
  content: string;
  order: number;
  type: ContentBlockType;
  icon?: string;
  collapsed?: boolean;
  children?: ContentBlock[];
  createdAt: string;
  updatedAt: string;
}

// Backward compatibility alias: Chapter is a ContentBlock
export type Chapter = ContentBlock;

export type BookMetadata = {
  title: string;
  subtitle?: string;
  author: string;
  authorBio?: string;
  language: string;
  isbn?: string;
  publisher?: string;
  publicationDate?: string;
  coverImage?: string;
  description?: string;
  keywords?: string[];
};

export type PageOrientation = 'portrait' | 'landscape';

export type BookLayout = {
  // Page settings
  pageSize: string;
  orientation: PageOrientation;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  // Typography
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  // Chapter/Block settings
  chapterStartOnNewPage: boolean;
  chapterTitleSize: number;
  chapterTitleWeight: 'normal' | 'bold';
  chapterTitleAlign: 'left' | 'center';
  // Headers & Footers
  showPageNumbers: boolean;
  showHeaders: boolean;
  headerContent: string; // {title}, {author}, {chapter}
  footerContent: string;
  // Table of contents
  generateTOC: boolean;
  tocTitle: string;
  tocDepth: number;
  // Cover
  showCoverPage: boolean;
  coverTitle: string;
  coverSubtitle: string;
};

export type BookSettings = {
  metadata: BookMetadata;
  layout: BookLayout;
  chapters: ContentBlock[];
  blocks?: ContentBlock[];
};

export function createContentBlock(
  title: string,
  type: ContentBlockType = 'page',
  parentId: string | null = null,
  order: number = 0
): ContentBlock {
  return {
    id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    parentId,
    title,
    content: '',
    order,
    type,
    icon: type === 'section' ? '📁' : '📄',
    collapsed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Backward-compatible constructor
export function createChapter(title: string, type: any = 'chapter'): ContentBlock {
  return createContentBlock(title, type as ContentBlockType, null);
}

export function createDefaultSettings(): BookSettings {
  const rootBlock = createContentBlock('Chapter 1', 'chapter', null, 0);
  return {
    metadata: {
      title: 'Untitled Document',
      author: 'Author Name',
      language: 'en',
    },
    layout: {
      pageSize: 'a4',
      orientation: 'portrait',
      marginTop: 20,
      marginBottom: 20,
      marginLeft: 20,
      marginRight: 20,
      fontFamily: 'system-ui, sans-serif',
      fontSize: 12,
      lineHeight: 1.6,
      chapterStartOnNewPage: true,
      chapterTitleSize: 24,
      chapterTitleWeight: 'bold',
      chapterTitleAlign: 'left',
      showPageNumbers: true,
      showHeaders: true,
      headerContent: '{title}',
      footerContent: '',
      generateTOC: true,
      tocTitle: 'Table of Contents',
      tocDepth: 3,
      showCoverPage: true,
      coverTitle: '',
      coverSubtitle: '',
    },
    chapters: [rootBlock],
    blocks: [rootBlock],
  };
}

// ---------------------------------------------------------------------------
// Recursive Tree Hierarchy Utilities
// ---------------------------------------------------------------------------

/** Convert flat array of blocks (with parentId) into a nested recursive tree */
export function buildBlockTree(blocks: ContentBlock[]): ContentBlock[] {
  const map = new Map<string, ContentBlock>();
  const roots: ContentBlock[] = [];

  for (const b of blocks) {
    map.set(b.id, { ...b, children: [] });
  }

  for (const b of blocks) {
    const node = map.get(b.id)!;
    if (b.parentId && map.has(b.parentId)) {
      const parent = map.get(b.parentId)!;
      parent.children = parent.children || [];
      parent.children.push(node);
      parent.children.sort((x, y) => x.order - y.order);
    } else {
      roots.push(node);
    }
  }

  return roots.sort((x, y) => x.order - y.order);
}

/** Flatten a nested recursive tree back into a linear sequence via DFS */
export function flattenBlockTree(tree: ContentBlock[]): ContentBlock[] {
  const result: ContentBlock[] = [];

  function traverse(nodes: ContentBlock[]) {
    for (const node of nodes) {
      const { children, ...rest } = node;
      result.push(rest as ContentBlock);
      if (children && children.length > 0) {
        traverse(children);
      }
    }
  }

  traverse(tree);
  return result;
}

export function reorderChapters(chapters: ContentBlock[]): ContentBlock[] {
  return chapters.map((ch, i) => ({ ...ch, order: i })).sort((a, b) => a.order - b.order);
}

export function getChapterWordCount(chapter: ContentBlock): number {
  const text = (chapter.content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text ? text.split(' ').length : 0;
}

export function getTotalWordCount(chapters: ContentBlock[]): number {
  return chapters.reduce((sum, ch) => sum + getChapterWordCount(ch), 0);
}

export function getEstimatedPages(chapters: ContentBlock[], wordsPerPage = 250): number {
  return Math.ceil(getTotalWordCount(chapters) / wordsPerPage);
}

// Page size dimensions in mm (width × height in portrait mode)
export const pageSizes: Record<string, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  a5: { width: 148, height: 210 },
  a6: { width: 105, height: 148 },
  b5: { width: 176, height: 250 },
  b4: { width: 250, height: 353 },
  f4: { width: 210, height: 330 },
  letter: { width: 216, height: 279 },
  legal: { width: 216, height: 356 },
  tabloid: { width: 279, height: 432 },
};

export function getEffectivePageSize(size: string, orientation: PageOrientation = 'portrait'): { width: number; height: number } {
  const base = pageSizes[size] ?? pageSizes.a4;
  if (orientation === 'landscape') {
    return { width: base.height, height: base.width };
  }
  return { width: base.width, height: base.height };
}

export const pageSizeOptions = [
  { value: 'a4', label: 'A4', description: '210 × 297 mm (Standard)' },
  { value: 'a5', label: 'A5', description: '148 × 210 mm (Novel)' },
  { value: 'a6', label: 'A6', description: '105 × 148 mm (Pocket)' },
  { value: 'b5', label: 'B5', description: '176 × 250 mm (Japanese)' },
  { value: 'b4', label: 'B4', description: '250 × 353 mm (Large)' },
  { value: 'f4', label: 'F4', description: '210 × 330 mm (Foolscap)' },
  { value: 'letter', label: 'US Letter', description: '216 × 279 mm (8.5 × 11")' },
  { value: 'legal', label: 'US Legal', description: '216 × 356 mm (8.5 × 14")' },
  { value: 'tabloid', label: 'Tabloid', description: '279 × 432 mm (11 × 17")' },
];

export const fontOptions = [
  { value: 'Georgia, serif', label: 'Georgia (Serif)' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Garamond, serif', label: 'Garamond' },
  { value: 'Palatino, serif', label: 'Palatino' },
  { value: '"Courier New", monospace', label: 'Courier New' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'system-ui, sans-serif', label: 'System UI' },
];
