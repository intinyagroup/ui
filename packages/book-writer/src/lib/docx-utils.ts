// ============================================
// DOCX export — convert book to Word document
// ============================================

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  Table as DocxTable,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ImageRun,
  ExternalHyperlink,
  Tab,
  TabStopPosition,
  TabStopType,
} from 'docx';
import type { Chapter, BookMetadata, BookLayout } from '@intinyagroup/book-writer';

/** Export book as DOCX */
export async function exportToDocx(
  metadata: BookMetadata,
  layout: BookLayout,
  chapters: Chapter[]
): Promise<Blob> {
  const children: Paragraph[] = [];

  // Title page
  children.push(
    new Paragraph({
      text: metadata.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  if (metadata.subtitle) {
    children.push(
      new Paragraph({
        text: metadata.subtitle,
        heading: HeadingLevel.SUBTITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  }

  children.push(
    new Paragraph({
      text: metadata.author,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  children.push(new Paragraph({ children: [new PageBreak()] }));

  // Table of Contents
  if (layout.generateTOC) {
    children.push(
      new Paragraph({
        text: layout.tocTitle,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      })
    );

    chapters.forEach((chapter, i) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${i + 1}. ${chapter.title}` }),
          ],
          spacing: { after: 100 },
        })
      );
    });

    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // Chapters
  for (const chapter of chapters) {
    // Chapter title
    children.push(
      new Paragraph({
        text: chapter.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );

    // Chapter content
    if (chapter.content) {
      const contentParagraphs = htmlToDocxParagraphs(chapter.content);
      children.push(...contentParagraphs);
    }

    // Page break between chapters
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // Create document
  const doc = new Document({
    creator: metadata.author,
    title: metadata.title,
    description: metadata.description ?? '',
    sections: [{
      properties: {
        page: {
          size: {
            width: getDocxPageSize(layout.pageSize).width,
            height: getDocxPageSize(layout.pageSize).height,
          },
          margin: {
            top: layout.marginTop * 56.7, // mm to twips (1 inch = 1440 twips)
            bottom: layout.marginBottom * 56.7,
            left: layout.marginLeft * 56.7,
            right: layout.marginRight * 56.7,
          },
        },
      },
      headers: {
        default: layout.showHeaders
          ? new Header({
              children: [
                new Paragraph({
                  text: metadata.title,
                  alignment: AlignmentType.CENTER,
                  style: 'Header',
                }),
              ],
            })
          : undefined,
      },
      footers: {
        default: layout.showPageNumbers
          ? new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ children: [PageNumber.CURRENT] }),
                  ],
                }),
              ],
            })
          : undefined,
      },
      children,
    }],
  });

  // Generate blob
  const buffer = await Packer.toBlob(doc);
  return buffer;
}

/** Convert HTML to DOCX paragraphs */
function htmlToDocxParagraphs(html: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const nodes = tempDiv.childNodes;
  for (const node of nodes) {
    const para = convertNodeToParagraph(node);
    if (para) paragraphs.push(para);
  }

  return paragraphs;
}

/** Convert a DOM node to a DOCX Paragraph */
function convertNodeToParagraph(node: Node): Paragraph | null {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim();
    if (!text) return null;
    return new Paragraph({ children: [new TextRun(text)] });
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  switch (tag) {
    case 'h1':
      return new Paragraph({
        children: extractTextRuns(el),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 120 },
      });
    case 'h2':
      return new Paragraph({
        children: extractTextRuns(el),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
      });
    case 'h3':
      return new Paragraph({
        children: extractTextRuns(el),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 240, after: 80 },
      });
    case 'p':
      return new Paragraph({
        children: extractTextRuns(el),
        spacing: { after: 120 },
      });
    case 'blockquote':
      return new Paragraph({
        children: extractTextRuns(el),
        indent: { left: 720 },
        spacing: { after: 120 },
      });
    case 'pre':
    case 'code':
      return new Paragraph({
        children: [new TextRun({ text: el.textContent ?? '', font: 'Courier New' })],
        spacing: { after: 120 },
      });
    case 'ul':
    case 'ol':
      return null; // Handle list items separately
    case 'li':
      return new Paragraph({
        children: extractTextRuns(el),
        bullet: { level: 0 },
        spacing: { after: 80 },
      });
    case 'hr':
      return new Paragraph({
        children: [new TextRun({ text: '─────────────────────────────' })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
      });
    case 'br':
      return new Paragraph({ children: [] });
    case 'table':
      return null; // Tables handled separately
    case 'img':
      return null; // Images handled separately
    default:
      return new Paragraph({
        children: extractTextRuns(el),
        spacing: { after: 120 },
      });
  }
}

/** Extract TextRuns from an element with formatting */
function extractTextRuns(el: HTMLElement): TextRun[] {
  const runs: TextRun[] = [];

  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text) runs.push(new TextRun(text));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const childEl = node as HTMLElement;
      const tag = childEl.tagName.toLowerCase();
      const text = childEl.textContent ?? '';

      const options: any = { text };

      switch (tag) {
        case 'strong':
        case 'b':
          options.bold = true;
          break;
        case 'em':
        case 'i':
          options.italics = true;
          break;
        case 'u':
          options.underline = {};
          break;
        case 's':
        case 'del':
          options.strike = true;
          break;
        case 'code':
          options.font = 'Courier New';
          break;
        case 'a':
          // Links need special handling in docx
          options.color = '2563EB';
          break;
      }

      runs.push(new TextRun(options));
    }
  }

  return runs;
}

/** Get page size in twips (1/20 of a point, 1 inch = 1440 twips) */
function getDocxPageSize(size: string): { width: number; height: number } {
  const sizes: Record<string, { width: number; height: number }> = {
    a4: { width: 11906, height: 16838 },
    a5: { width: 8391, height: 11906 },
    letter: { width: 12240, height: 15840 },
    legal: { width: 12240, height: 20160 },
  };
  return sizes[size] ?? sizes.a4;
}
