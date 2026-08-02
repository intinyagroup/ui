<script lang="ts">
  import { Download, X, FileText, Printer, Loader2 } from 'lucide-svelte';
  import { Button } from '@intinyagroup/ui';
  import { cn } from '@intinyagroup/grid-core/utils';
  import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
  import { type Chapter, type BookMetadata, type BookLayout, pageSizes } from '../book-model.js';

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
  let exportFormat = $state<'pdf' | 'print'>('pdf');

  async function exportToPDF() {
    exporting = true;
    exportProgress = 'Creating PDF document...';

    try {
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
      const contentHeight = size.height - margin.top - margin.bottom;

      // Cover page
      if (layout.showCoverPage) {
        const page = pdfDoc.addPage([size.width, size.height]);

        // Title
        const title = layout.coverTitle || metadata.title;
        page.drawText(title, {
          x: size.width / 2 - fontBold.widthOfTextAtSize(title, 32) / 2,
          y: size.height / 2 + 50,
          size: 32,
          font: fontBold,
          color: rgb(0, 0, 0),
        });

        // Subtitle
        if (layout.coverSubtitle || metadata.subtitle) {
          const subtitle = layout.coverSubtitle || metadata.subtitle!;
          page.drawText(subtitle, {
            x: size.width / 2 - font.widthOfTextAtSize(subtitle, 18) / 2,
            y: size.height / 2,
            size: 18,
            font,
            color: rgb(0.3, 0.3, 0.3),
          });
        }

        // Author
        page.drawText(metadata.author, {
          x: size.width / 2 - font.widthOfTextAtSize(metadata.author, 14) / 2,
          y: size.height / 2 - 60,
          size: 14,
          font,
          color: rgb(0.4, 0.4, 0.4),
        });
      }

      // TOC
      if (layout.generateTOC && chapters.length > 0) {
        const page = pdfDoc.addPage([size.width, size.height]);
        let y = size.height - margin.top;

        page.drawText(layout.tocTitle, {
          x: margin.left,
          y,
          size: layout.chapterTitleSize,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        y -= 30;

        for (let i = 0; i < chapters.length; i++) {
          const chapter = chapters[i];
          const text = `${i + 1}. ${chapter.title}`;
          page.drawText(text, {
            x: margin.left,
            y,
            size: layout.fontSize,
            font,
            color: rgb(0, 0, 0),
          });
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

        // Chapter title
        page.drawText(chapter.title, {
          x: layout.chapterTitleAlign === 'center'
            ? size.width / 2 - fontBold.widthOfTextAtSize(chapter.title, layout.chapterTitleSize) / 2
            : margin.left,
          y,
          size: layout.chapterTitleSize,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        y -= layout.chapterTitleSize * 1.5;

        // Chapter content (plain text)
        const plainText = chapter.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        if (plainText) {
          const words = plainText.split(' ');
          let line = '';

          for (const word of words) {
            const testLine = line ? `${line} ${word}` : word;
            const textWidth = font.widthOfTextAtSize(testLine, layout.fontSize);

            if (textWidth > contentWidth) {
              if (y < margin.bottom) {
                // New page
                const newPage = pdfDoc.addPage([size.width, size.height]);
                y = size.height - margin.top;
              }

              page.drawText(line, {
                x: margin.left,
                y,
                size: layout.fontSize,
                font,
                color: rgb(0.1, 0.1, 0.1),
              });
              y -= layout.fontSize * layout.lineHeight;
              line = word;
            } else {
              line = testLine;
            }
          }

          if (line) {
            if (y < margin.bottom) {
              const newPage = pdfDoc.addPage([size.width, size.height]);
              y = size.height - margin.top;
            }
            page.drawText(line, {
              x: margin.left,
              y,
              size: layout.fontSize,
              font,
              color: rgb(0.1, 0.1, 0.1),
            });
          }
        }

        // Page numbers
        if (layout.showPageNumbers) {
          const pageNum = String(i + 1);
          page.drawText(pageNum, {
            x: size.width / 2 - font.widthOfTextAtSize(pageNum, 10) / 2,
            y: margin.bottom / 2,
            size: 10,
            font,
            color: rgb(0.5, 0.5, 0.5),
          });
        }
      }

      exportProgress = 'Generating PDF file...';
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      onExportComplete(blob);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      exporting = false;
      exportProgress = '';
    }
  }

  function handlePrint() {
    window.print();
    onClose();
  }
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-[var(--ui-card)] rounded-xl p-6 w-96 shadow-xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-[var(--ui-foreground)]">Export Book</h3>
        <button onclick={onClose} class="p-1 rounded hover:bg-[var(--ui-secondary)] cursor-pointer">
          <X class="size-5" />
        </button>
      </div>

      <div class="space-y-3">
        <!-- Export format -->
        <div class="grid grid-cols-2 gap-3">
          <button
            onclick={() => exportFormat = 'pdf'}
            class={cn(
              "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors cursor-pointer",
              exportFormat === 'pdf'
                ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5"
                : "border-[var(--ui-border)] hover:bg-[var(--ui-secondary)]"
            )}
          >
            <FileText class="size-6 text-[var(--ui-primary)]" />
            <span class="text-sm font-medium">PDF</span>
            <span class="text-[10px] text-[var(--ui-muted-foreground)]">Print-ready document</span>
          </button>

          <button
            onclick={() => exportFormat = 'print'}
            class={cn(
              "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors cursor-pointer",
              exportFormat === 'print'
                ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5"
                : "border-[var(--ui-border)] hover:bg-[var(--ui-secondary)]"
            )}
          >
            <Printer class="size-6 text-[var(--ui-primary)]" />
            <span class="text-sm font-medium">Print</span>
            <span class="text-[10px] text-[var(--ui-muted-foreground)]">Browser print dialog</span>
          </button>
        </div>

        <!-- Export info -->
        <div class="text-xs text-[var(--ui-muted-foreground)] space-y-1">
          <p>Book: {metadata.title}</p>
          <p>Author: {metadata.author}</p>
          <p>Chapters: {chapters.length}</p>
          <p>Format: {layout.pageSize.toUpperCase()}</p>
        </div>

        {#if exporting}
          <div class="flex items-center gap-2 text-sm text-[var(--ui-primary)]">
            <Loader2 class="size-4 animate-spin" />
            {exportProgress}
          </div>
        {/if}

        <Button
          class="w-full"
          onclick={exportFormat === 'pdf' ? exportToPDF : handlePrint}
          disabled={exporting}
        >
          {#if exporting}
            Exporting...
          {:else}
            <Download class="size-4 mr-2" />
            {exportFormat === 'pdf' ? 'Export PDF' : 'Print Book'}
          {/if}
        </Button>
      </div>
    </div>
  </div>
{/if}
