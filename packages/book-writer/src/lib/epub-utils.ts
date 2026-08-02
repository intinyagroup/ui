// ============================================
// EPUB export — create EPUB books with images
// ============================================

import Epub from 'epubjs';
import type { Chapter, BookMetadata, BookLayout } from './book-model.js';
import { htmlToMarkdown, markdownToHtml } from './markdown-utils.js';
import { extractImageUrls } from './image-utils.js';

/** Generate EPUB from book data with embedded images */
export async function exportToEpub(
  metadata: BookMetadata,
  layout: BookLayout,
  chapters: Chapter[]
): Promise<Blob> {
  const book = Epub.init({});

  // Set metadata
  book.setMetadata({
    title: metadata.title,
    author: metadata.author,
    description: metadata.description ?? '',
    publisher: metadata.publisher ?? '',
    lang: metadata.language ?? 'en',
  });

  // Embed cover image if URL provided
  if (metadata.coverImage) {
    try {
      const coverResponse = await fetch(metadata.coverImage);
      if (coverResponse.ok) {
        const coverBlob = await coverResponse.blob();
        const coverArrayBuffer = await coverBlob.arrayBuffer();
        book.addCoverImage('cover.jpg', coverArrayBuffer, { mediaType: 'image/jpeg' });
      }
    } catch {
      // Skip if cover image fails
    }
  }

  // Collect and embed all images from chapters
  const imageCache = new Map<string, string>();
  for (const chapter of chapters) {
    if (!chapter.content) continue;
    const imageUrls = extractImageUrls(chapter.content);
    for (const url of imageUrls) {
      if (imageCache.has(url)) continue;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const mediaType = blob.type || 'image/png';
          const extension = mediaType.split('/')[1] || 'png';
          const fileName = `images/${imageCache.size}.${extension}`;
          book.addImage(url, fileName, arrayBuffer, { mediaType });
          imageCache.set(url, fileName);
        }
      } catch {
        // Skip failed images
      }
    }
  }

  // Cover page
  if (layout.showCoverPage) {
    const coverHtml = generateCoverHtml(metadata, layout);
    book.addSection('cover.xhtml', coverHtml, { spine: 'cover', properties: { nav: { label: 'Cover' } } });
  }

  // Table of contents
  if (layout.generateTOC) {
    const tocHtml = generateTocHtml(metadata, chapters);
    book.addSection('toc.xhtml', tocHtml, { spine: 'toc', properties: { nav: { label: 'Table of Contents' } } });
  }

  // Chapters with image references updated
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    let chapterHtml = generateChapterHtml(chapter, layout);

    // Replace image URLs with embedded file references
    for (const [originalUrl, embeddedPath] of imageCache.entries()) {
      chapterHtml = chapterHtml.replaceAll(originalUrl, embeddedPath);
    }

    book.addSection(
      `chapter-${i + 1}.xhtml`,
      chapterHtml,
      {
        spine: `chapter-${i + 1}`,
        properties: { nav: { label: chapter.title } }
      }
    );
  }
    const chapterHtml = generateChapterHtml(chapter, layout);
    book.addSection(
      `chapter-${i + 1}.xhtml`,
      chapterHtml,
      {
        spine: `chapter-${i + 1}`,
        properties: { nav: { label: chapter.title } }
      }
    );
  }

  // Generate EPUB blob
  const arrayBuffer = await book.archive.generateZip();
  return new Blob([arrayBuffer], { type: 'application/epub+zip' });
}

function generateCoverHtml(metadata: BookMetadata, layout: BookLayout): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>Cover</title>
  <style>
    body { margin: 0; padding: 0; text-align: center; font-family: serif; }
    .cover { padding: 20% 10%; }
    h1 { font-size: 2.5em; margin-bottom: 0.3em; }
    h2 { font-size: 1.5em; color: #666; margin-bottom: 1em; }
    .author { font-size: 1.2em; color: #444; }
    .divider { width: 100px; height: 2px; background: #333; margin: 1.5em auto; }
  </style>
</head>
<body>
  <div class="cover">
    <h1>${escapeXml(layout.coverTitle || metadata.title)}</h1>
    ${layout.coverSubtitle || metadata.subtitle ? `<h2>${escapeXml(layout.coverSubtitle || metadata.subtitle!)}</h2>` : ''}
    <div class="divider"></div>
    <div class="author">${escapeXml(metadata.author)}</div>
  </div>
</body>
</html>`;
}

function generateTocHtml(metadata: BookMetadata, chapters: Chapter[]): string {
  const items = chapters
    .map((ch, i) => `<li><a href="chapter-${i + 1}.xhtml">${escapeXml(ch.title)}</a></li>`)
    .join('\n            ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>Table of Contents</title>
  <style>
    body { font-family: serif; padding: 2em; }
    h1 { text-align: center; margin-bottom: 1.5em; }
    ul { list-style: none; padding: 0; }
    li { padding: 0.5em 0; border-bottom: 1px dotted #ccc; }
    a { text-decoration: none; color: #333; }
    a:hover { color: #000; }
  </style>
</head>
<body>
  <h1>${escapeXml(metadata.title)}</h1>
  <nav epub:type="toc">
    <ul>
            ${items}
    </ul>
  </nav>
</body>
</html>`;
}

function generateChapterHtml(chapter: Chapter, layout: BookLayout): string {
  // Convert rich text content to XHTML
  let content = chapter.content || '';

  // Ensure proper XHTML
  content = content
    .replace(/<br\s*\/?>/g, '<br />')
    .replace(/<hr\s*\/?>/g, '<hr />')
    .replace(/<img([^>]*)>/g, '<img$1 />')
    .replace(/<([^>]+)>/g, (match) => {
      // Self-close void elements
      if (/^<(br|hr|img|input|meta|link)/i.test(match)) {
        if (!match.endsWith('/>')) return match.slice(0, -1) + ' />';
      }
      return match;
    });

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>${escapeXml(chapter.title)}</title>
  <style>
    body {
      font-family: ${layout.fontFamily};
      font-size: ${layout.fontSize}pt;
      line-height: ${layout.lineHeight};
      margin: 0;
      padding: 2em;
    }
    h1 {
      font-size: ${layout.chapterTitleSize}pt;
      font-weight: ${layout.chapterTitleWeight};
      text-align: ${layout.chapterTitleAlign};
      margin-bottom: 1.5em;
      page-break-before: always;
    }
    p { margin: 0.8em 0; }
    blockquote {
      border-left: 3px solid #ccc;
      padding-left: 1em;
      color: #666;
      margin: 1em 0;
    }
    pre {
      background: #f5f5f5;
      padding: 1em;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 0.9em;
    }
    code {
      font-family: monospace;
      background: #f0f0f0;
      padding: 0.1em 0.3em;
      border-radius: 3px;
    }
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    .image-container {
      margin: 1.5em 0;
      text-align: center;
    }
    .image-container.align-left { text-align: left; }
    .image-container.align-right { text-align: right; }
    .image-container.align-center { text-align: center; }
    .image-container.align-full img { width: 100%; }
    .image-caption {
      font-size: 0.85em;
      color: #666;
      margin-top: 0.5em;
      font-style: italic;
    }
    .footnote-marker {
      color: #2563eb;
      cursor: pointer;
      font-size: 0.8em;
    }
    .footnote-definition {
      font-size: 0.9em;
      color: #666;
      border-top: 1px solid #eee;
      padding-top: 0.5em;
      margin-top: 1em;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 0.5em 0.75em;
      text-align: left;
    }
    th {
      background: #f5f5f5;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>${escapeXml(chapter.title)}</h1>
  ${content || '<p><em>This chapter is empty.</em></p>'}
</body>
</html>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
