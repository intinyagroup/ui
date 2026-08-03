<script lang="ts">
  import { Download, X, FileText, Printer, Loader2, BookOpen, FileCode } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import { PDFDocument, StandardFonts, rgb, PDFImage } from 'pdf-lib';
  import { type Chapter, type BookMetadata, type BookLayout, pageSizes } from '../book-model.js';
  import { exportToMarkdown, downloadAsFile, downloadBlob } from '../markdown-utils.js';
  import { exportToEpub } from '../epub-utils.js';
  import { exportToDocx } from '../docx-utils.js';
  import { fetchImageAsBytes, getImageType, dataUrlToBytes } from '../image-utils.js';

  let {
    open,
    metadata,
    layout,
    chapters,
    onClose,
    onExportComplete,
  }: {
    open: boolean;
    metadata: BookMetadata;
    layout: BookLayout;
    chapters: Chapter[];
    onClose: () => void;
    onExportComplete: (blob: Blob) => void;
  } = $props();

  let exporting = $state(false);
  let exportProgress = $state('');
  let exportFormat = $state<'pdf' | 'epub' | 'docx' | 'markdown' | 'print'>('pdf');

  type ExportFormat = typeof exportFormat;

  const formats: { value: ExportFormat; label: string; icon: any; description: string }[] = [
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Print-ready document' },
    { value: 'epub', label: 'EPUB', icon: BookOpen, description: 'E-book format (Kindle, Kobo)' },
    { value: 'docx', label: 'DOCX', icon: FileCode, description: 'Microsoft Word document' },
    { value: 'markdown', label: 'Markdown', icon: FileCode, description: 'Plain text with formatting' },
    { value: 'print', label: 'Print', icon: Printer, description: 'Browser print dialog' },
  ];

  const safeTitle = $derived(metadata.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'book');

  async function handleExport() {
    exporting = true;
    exportProgress = `Exporting as ${exportFormat.toUpperCase()}...`;

    try {
      switch (exportFormat) {
        case 'pdf':
          await exportToPDF();
          break;
        case 'epub':
          await exportToEpubFile();
          break;
        case 'docx':
          await exportToDocxFile();
          break;
        case 'markdown':
          exportToMarkdownFile();
          break;
        case 'print':
          window.print();
          break;
      }
    } catch (err) {
      console.error('Export failed:', err);
      exportProgress = 'Export failed. Please try again.';
    } finally {
      exporting = false;
      exportProgress = '';
    }
  }

  async function exportToPDF() {
    exportProgress = 'Creating PDF document...';
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const size = pageSizes[layout.pageSize] ?? pageSizes.a4;
    const margin = {
      top: layout.marginTop,
      bottom: layout.marginBottom,
      left: layout.marginLeft,
      right: layout.marginRight,
    };

    const contentWidth = size.width - margin.left - margin.right;

    // Cover page
    if (layout.showCoverPage) {
      const page = pdfDoc.addPage([size.width, size.height]);
      const title = layout.coverTitle || metadata.title;
      page.drawText(title, {
        x: size.width / 2 - fontBold.widthOfTextAtSize(title, 32) / 2,
        y: size.height / 2 + 50,
        size: 32, font: fontBold, color: rgb(0, 0, 0),
      });
      if (layout.coverSubtitle || metadata.subtitle) {
        const subtitle = layout.coverSubtitle || metadata.subtitle!;
        page.drawText(subtitle, {
          x: size.width / 2 - font.widthOfTextAtSize(subtitle, 18) / 2,
          y: size.height / 2,
          size: 18, font, color: rgb(0.3, 0.3, 0.3),
        });
      }
      page.drawText(metadata.author, {
        x: size.width / 2 - font.widthOfTextAtSize(metadata.author, 14) / 2,
        y: size.height / 2 - 60,
        size: 14, font, color: rgb(0.4, 0.4, 0.4),
      });
    }

    // TOC
    if (layout.generateTOC && chapters.length > 0) {
      const page = pdfDoc.addPage([size.width, size.height]);
      let y = size.height - margin.top;
      page.drawText(layout.tocTitle, { x: margin.left, y, size: layout.chapterTitleSize, font: fontBold, color: rgb(0, 0, 0) });
      y -= 30;
      for (let i = 0; i < chapters.length; i++) {
        const text = `${i + 1}. ${chapters[i].title}`;
        page.drawText(text, { x: margin.left, y, size: layout.fontSize, font, color: rgb(0, 0, 0) });
        y -= layout.fontSize * layout.lineHeight;
        if (y < margin.bottom) break;
      }
    }

    // Chapters
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      exportProgress = `Processing chapter ${i + 1}/${chapters.length}: ${chapter.title}`;
      const page = pdfDoc.addPage([size.width, size.height]);
      let y = size.height - margin.top;

      page.drawText(chapter.title, {
        x: layout.chapterTitleAlign === 'center'
          ? size.width / 2 - fontBold.widthOfTextAtSize(chapter.title, layout.chapterTitleSize) / 2
          : margin.left,
        y, size: layout.chapterTitleSize, font: fontBold, color: rgb(0, 0, 0),
      });
      y -= layout.chapterTitleSize * 1.5;

      const plainText = chapter.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      if (plainText) {
        const words = plainText.split(' ');
        let line = '';
        for (const word of words) {
          const testLine = line ? `${line} ${word}` : word;
          if (font.widthOfTextAtSize(testLine, layout.fontSize) > contentWidth) {
            if (y < margin.bottom) { const p = pdfDoc.addPage([size.width, size.height]); y = size.height - margin.top; }
            page.drawText(line, { x: margin.left, y, size: layout.fontSize, font, color: rgb(0.1, 0.1, 0.1) });
            y -= layout.fontSize * layout.lineHeight;
            line = word;
          } else { line = testLine; }
        }
        if (line) {
          if (y < margin.bottom) { pdfDoc.addPage([size.width, size.height]); y = size.height - margin.top; }
          page.drawText(line, { x: margin.left, y, size: layout.fontSize, font, color: rgb(0.1, 0.1, 0.1) });
        }
      }

      if (layout.showPageNumbers) {
        page.drawText(String(i + 1), {
          x: size.width / 2 - font.widthOfTextAtSize(String(i + 1), 10) / 2,
          y: margin.bottom / 2, size: 10, font, color: rgb(0.5, 0.5, 0.5),
        });
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    downloadBlob(blob, `${safeTitle}.pdf`);
    onExportComplete(blob);
  }

  async function exportToEpubFile() {
    exportProgress = 'Creating EPUB book...';
    const blob = await exportToEpub(metadata, layout, chapters);
    downloadBlob(blob, `${safeTitle}.epub`);
    onExportComplete(blob);
  }

  async function exportToDocxFile() {
    exportProgress = 'Creating DOCX document...';
    const blob = await exportToDocx(metadata, layout, chapters);
    downloadBlob(blob, `${safeTitle}.docx`);
    onExportComplete(blob);
  }

  function exportToMarkdownFile() {
    exportProgress = 'Exporting Markdown...';
    const md = exportToMarkdown(metadata, chapters);
    downloadAsFile(md, `${safeTitle}.md`, 'text/markdown');
    const blob = new Blob([md], { type: 'text/markdown' });
    onExportComplete(blob);
  }
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-[var(--ui-card)] rounded-xl p-6 w-[480px] shadow-xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-[var(--ui-foreground)]">Export Book</h3>
        <button onclick={onClose} class="p-1 rounded hover:bg-[var(--ui-secondary)] cursor-pointer">
          <X class="size-5" />
        </button>
      </div>

      <div class="space-y-4">
        <!-- Format selection -->
        <div class="grid grid-cols-2 gap-3">
          {#each formats as format (format.value)}
            {@const Icon = format.icon}
            <button
              onclick={() => exportFormat = format.value}
              class={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors cursor-pointer",
                exportFormat === format.value
                  ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5"
                  : "border-[var(--ui-border)] hover:bg-[var(--ui-secondary)]"
              )}
            >
              <Icon class="size-6 {exportFormat === format.value ? 'text-[var(--ui-primary)]' : 'text-[var(--ui-muted-foreground)]'}" />
              <span class="text-sm font-medium">{format.label}</span>
              <span class="text-[10px] text-[var(--ui-muted-foreground)] text-center">{format.description}</span>
            </button>
          {/each}
        </div>

        <!-- Book info -->
        <div class="text-xs text-[var(--ui-muted-foreground)] space-y-1 p-3 rounded-lg bg-[var(--ui-secondary)]/20">
          <p><strong>Book:</strong> {metadata.title}</p>
          <p><strong>Author:</strong> {metadata.author}</p>
          <p><strong>Chapters:</strong> {chapters.length}</p>
          <p><strong>Format:</strong> {layout.pageSize.toUpperCase()}</p>
          <p><strong>Output:</strong> {safeTitle}.{exportFormat === 'print' ? 'pdf' : exportFormat === 'markdown' ? 'md' : exportFormat}</p>
        </div>

        {#if exporting}
          <div class="flex items-center gap-2 text-sm text-[var(--ui-primary)] p-3 rounded-lg bg-[var(--ui-primary)]/5">
            <Loader2 class="size-4 animate-spin" />
            {exportProgress}
          </div>
        {/if}

        <Button
          class="w-full"
          onclick={handleExport}
          disabled={exporting}
        >
          {#if exporting}
            Exporting...
          {:else}
            <Download class="size-4 mr-2" />
            Export as {formats.find((f) => f.value === exportFormat)?.label}
          {/if}
        </Button>
      </div>
    </div>
  </div>
{/if}
