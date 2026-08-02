// ============================================
// PDF.js worker setup
// ============================================

import * as pdfjsLib from 'pdfjs-dist';

// Set worker source - must be done before any PDF operations
export function initPdfWorker(workerSrc?: string) {
  pdfjsLib.GlobalWorkerOptions.src = workerSrc ?? `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export { pdfjsLib };

// Types
export type PDFPageInfo = {
  pageNumber: number;
  width: number;
  height: number;
  rotation: number;
};

export type PDFDocumentInfo = {
  title: string;
  author: string;
  subject: string;
  creator: string;
  producer: string;
  creationDate: Date | null;
  modificationDate: Date | null;
  pageCount: number;
  pdfVersion: string;
};

export type TextItem = {
  str: string;
  dir: string;
  transform: number[];
  width: number;
  height: number;
  x: number;
  y: number;
  fontSize: number;
};

export type AnnotationType = 'highlight' | 'underline' | 'strikethrough' | 'freehand' | 'text' | 'note' | 'rectangle' | 'ellipse';

export type Annotation = {
  id: string;
  pageNumber: number;
  type: AnnotationType;
  color: string;
  opacity: number;
  // For text markup
  rects?: { x: number; y: number; width: number; height: number }[];
  // For freehand
  points?: { x: number; y: number }[];
  // For text/note
  x?: number;
  y?: number;
  text?: string;
  // For shapes
  width?: number;
  height?: number;
  // Common
  createdAt: string;
  updatedAt: string;
  author?: string;
};

export type FormField = {
  id: string;
  type: 'text' | 'checkbox' | 'radio' | 'dropdown' | 'signature';
  name: string;
  value: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
  options?: string[];
  readOnly?: boolean;
};
