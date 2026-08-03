// ============================================
// PDF export for slides
// ============================================

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { Presentation, Slide, SlideElement } from './slide-model.js';
import { aspectRatios } from './slide-model.js';

/** Export presentation as PDF */
export async function exportSlidesToPdf(presentation: Presentation): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const dims = aspectRatios[presentation.aspectRatio] ?? aspectRatios['16:9'];

  for (const slide of presentation.slides) {
    if (slide.isHidden) continue;

    const page = pdfDoc.addPage([dims.width, dims.height]);

    // Background
    const bgColor = hexToRgb(slide.background || presentation.theme.background);
    if (bgColor) {
      page.drawRectangle({
        x: 0, y: 0,
        width: dims.width, height: dims.height,
        color: bgColor,
      });
    }

    // Elements
    for (const element of slide.elements) {
      if (element.visible === false) continue;

      const x = (element.x / 100) * dims.width;
      const y = dims.height - ((element.y + element.height) / 100) * dims.height;
      const width = (element.width / 100) * dims.width;
      const height = (element.height / 100) * dims.height;

      if (element.type === 'text') {
        const fontSize = element.style?.fontSize ?? 16;
        const scaledFontSize = fontSize * (dims.width / 960); // Scale from 960px preview
        const textFont = element.style?.fontWeight === 'bold' ? fontBold : font;
        const textColor = hexToRgb(element.style?.color ?? presentation.theme.textColor);

        if (textColor) {
          // Simple text rendering (first line)
          const lines = element.content.split('\n');
          let lineY = y + height - scaledFontSize;

          for (const line of lines) {
            if (lineY < y) break;
            page.drawText(line, {
              x,
              y: lineY,
              size: scaledFontSize,
              font: textFont,
              color: textColor,
              maxWidth: width,
            });
            lineY -= scaledFontSize * 1.4;
          }
        }
      } else if (element.type === 'shape') {
        const bgColor = hexToRgb(element.style?.backgroundColor ?? presentation.theme.accentColor);
        if (bgColor) {
          page.drawRectangle({
            x, y, width, height,
            color: bgColor,
            borderColor: element.style?.borderColor ? hexToRgb(element.style.borderColor) : undefined,
            borderWidth: element.style?.borderWidth,
          });
        }
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

function hexToRgb(hex: string): { red: number; green: number; blue: number } | null {
  if (!hex) return null;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    red: parseInt(result[1], 16) / 255,
    green: parseInt(result[2], 16) / 255,
    blue: parseInt(result[3], 16) / 255,
  };
}
