// ============================================
// Pagination Engine — measure + split into pages
// ============================================

import { pageSizes, getEffectivePageSize, type BookLayout } from './book-model.js';

export type PaginatedPage = {
  pageNumber: number;
  contentHtml: string;
  isEmpty: boolean;
};

export type PaginationResult = {
  pages: PaginatedPage[];
  totalPages: number;
};

/**
 * Paginate HTML content into fixed-size pages
 * by rendering to a hidden container and measuring heights.
 * Handles images by waiting for them to load before measurement.
 */
export async function paginateContent(
  html: string,
  layout: BookLayout,
  containerWidth: number
): Promise<PaginationResult> {
  if (!html || !html.trim()) {
    return { pages: [{ pageNumber: 1, contentHtml: '', isEmpty: true }], totalPages: 1 };
  }

  const size = getEffectivePageSize(layout.pageSize, layout.orientation ?? 'portrait');
  const margin = {
    top: layout.marginTop * (96 / 25.4),
    bottom: layout.marginBottom * (96 / 25.4),
    left: layout.marginLeft * (96 / 25.4),
    right: layout.marginRight * (96 / 25.4),
  };

  const pageHeightPx = (size.height * 96) / 25.4 - margin.top - margin.bottom;
  const pageWidthPx = containerWidth - margin.left - margin.right;

  // Create hidden measurement container
  const measurer = document.createElement('div');
  measurer.style.cssText = `
    position: absolute;
    top: -9999px;
    left: -9999px;
    width: ${pageWidthPx}px;
    font-family: ${layout.fontFamily};
    font-size: ${layout.fontSize}pt;
    line-height: ${layout.lineHeight};
    color: transparent;
    pointer-events: none;
    overflow: visible;
  `;
  measurer.innerHTML = html;
  document.body.appendChild(measurer);

  // Wait for images to load
  await waitForImages(measurer);

  try {
    return splitIntoPages(measurer, pageHeightPx, pageWidthPx, layout);
  } finally {
    document.body.removeChild(measurer);
  }
}

/** Wait for all images in container to load */
function waitForImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll('img'));
  if (images.length === 0) return Promise.resolve();

  const promises = images.map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Continue even if image fails
      // Timeout after 3 seconds
      setTimeout(() => resolve(), 3000);
    });
  });

  return Promise.all(promises).then(() => {});
}

function splitIntoPages(
  container: HTMLElement,
  pageHeightPx: number,
  pageWidthPx: number,
  layout: BookLayout
): PaginationResult {
  const pages: PaginatedPage[] = [];
  const children = Array.from(container.childNodes);
  let currentPageContent: string[] = [];
  let currentPageHeight = 0;
  let pageNumber = 1;

  // Reserve space for chapter title
  const titleHeight = layout.chapterTitleSize * 1.5 * (96 / 72); // pt to px

  for (const child of children) {
    const childHeight = measureNodeHeight(child as HTMLElement);

    if (currentPageHeight + childHeight > pageHeightPx && currentPageContent.length > 0) {
      // Current page is full, start new page
      pages.push({
        pageNumber,
        contentHtml: currentPageContent.join(''),
        isEmpty: false,
      });
      pageNumber++;
      currentPageContent = [];
      currentPageHeight = 0;
    }

    currentPageContent.push(serializeNode(child));
    currentPageHeight += childHeight;
  }

  // Add remaining content
  if (currentPageContent.length > 0 || pages.length === 0) {
    pages.push({
      pageNumber,
      contentHtml: currentPageContent.join(''),
      isEmpty: currentPageContent.length === 0,
    });
  }

  return { pages, totalPages: pages.length };
}

function measureNodeHeight(node: Node): number {
  if (node.nodeType === Node.TEXT_NODE) {
    return 0;
  }

  const el = node as HTMLElement;
  if (!el || !el.getBoundingClientRect) return 0;

  const rect = el.getBoundingClientRect();
  return rect.height || 0;
}

function serializeNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? '';
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    return (node as HTMLElement).outerHTML;
  }
  return '';
}

/**
 * Simple pagination for server-side / SSR
 * Uses estimated line heights instead of DOM measurement
 */
export function paginateContentEstimate(
  html: string,
  layout: BookLayout,
  pageWidthMm: number = 170 // typical content width for A4
): PaginationResult {
  if (!html || !html.trim()) {
    return { pages: [{ pageNumber: 1, contentHtml: '', isEmpty: true }], totalPages: 1 };
  }

  const size = getEffectivePageSize(layout.pageSize, layout.orientation ?? 'portrait');
  const contentHeightMm = size.height - layout.marginTop - layout.marginBottom;
  const lineHeightMm = (layout.fontSize * layout.lineHeight * 25.4) / 72; // pt to mm
  const linesPerPage = Math.floor(contentHeightMm / lineHeightMm);

  // Split HTML into paragraphs
  const paragraphs = html.split(/<\/p>|<\/h[1-6]>|<\/li>|<br\s*\/?>|<\/div>/i).filter(Boolean);
  const linesPerPageWithPadding = Math.max(1, linesPerPage - 2); // padding for headings

  const pages: PaginatedPage[] = [];
  let currentLines = 0;
  let currentContent: string[] = [];
  let pageNumber = 1;

  for (const para of paragraphs) {
    const cleanText = para.replace(/<[^>]*>/g, '').trim();
    if (!cleanText) continue;

    // Estimate lines for this paragraph
    const charsPerLine = Math.floor((pageWidthMm / 25.4) * (72 / layout.fontSize) * 1.5);
    const paraLines = Math.max(1, Math.ceil(cleanText.length / charsPerLine));

    // Headings take more space
    const isHeading = /^<(h[1-6]|strong|b)/i.test(para);
    const estimatedLines = isHeading ? paraLines * 2 : paraLines;

    if (currentLines + estimatedLines > linesPerPageWithPadding && currentContent.length > 0) {
      pages.push({
        pageNumber,
        contentHtml: currentContent.join(''),
        isEmpty: false,
      });
      pageNumber++;
      currentContent = [];
      currentLines = 0;
    }

    currentContent.push(para);
    currentLines += estimatedLines;
  }

  if (currentContent.length > 0 || pages.length === 0) {
    pages.push({
      pageNumber,
      contentHtml: currentContent.join(''),
      isEmpty: currentContent.length === 0,
    });
  }

  return { pages, totalPages: pages.length };
}
