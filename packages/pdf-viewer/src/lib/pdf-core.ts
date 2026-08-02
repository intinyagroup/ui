// ============================================
// PDF.js worker setup — Adobe Acrobat level
// ============================================

import * as pdfjsLib from 'pdfjs-dist';

export function initPdfWorker(workerSrc?: string) {
  pdfjsLib.GlobalWorkerOptions.src = workerSrc ?? `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export { pdfjsLib };

// ============================================
// Core Types
// ============================================

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

// ============================================
// Annotation Types — All Adobe annotation kinds
// ============================================

export type AnnotationType =
  | 'highlight' | 'underline' | 'strikethrough' | 'squiggly'
  | 'freehand' | 'eraser'
  | 'text' | 'note' | 'callout' | 'stamp'
  | 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'polyline' | 'polygon'
  | 'cloud' | 'arrow-double';

export type AnnotationColor = string; // hex

export type Annotation = {
  id: string;
  pageNumber: number;
  type: AnnotationType;
  color: AnnotationColor;
  opacity: number;
  strokeWidth: number;
  // For text markup (highlight, underline, strikethrough, squiggly)
  rects?: { x: number; y: number; width: number; height: number }[];
  // For freehand / eraser / polyline
  points?: { x: number; y: number }[];
  // For text / note / callout
  x?: number;
  y?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  // For shapes (rectangle, ellipse, line, arrow)
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  // For stamps
  stampType?: 'approved' | 'rejected' | 'draft' | 'final' | 'confidential' | 'custom';
  stampText?: string;
  stampImage?: string;
  // For polygon
  vertices?: { x: number; y: number }[];
  // Common metadata
  createdAt: string;
  updatedAt: string;
  author?: string;
  locked?: boolean;
  visible?: boolean;
  // Appearance
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  fillColor?: string;
  fillOpacity?: number;
};

export type AnnotationTool =
  | 'select' | 'hand' | 'marquee'
  | 'highlight' | 'underline' | 'strikethrough' | 'squiggly'
  | 'freehand' | 'eraser'
  | 'text-box' | 'note' | 'callout' | 'stamp'
  | 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'polyline' | 'polygon' | 'cloud'
  | 'redact';

export type StampTemplate = {
  id: string;
  type: Annotation['stampType'];
  text: string;
  color: string;
  icon?: string;
};

// ============================================
// Form Field Types
// ============================================

export type FormFieldType = 'text' | 'checkbox' | 'radio' | 'dropdown' | 'listbox' | 'button' | 'signature' | 'image';

export type FormField = {
  id: string;
  type: FormFieldType;
  name: string;
  alternateName?: string;
  value: string;
  defaultValue?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
  // Text field
  maxLength?: number;
  multiline?: boolean;
  // Checkbox / Radio
  checked?: boolean;
  exportValue?: string;
  // Dropdown / Listbox
  options?: { label: string; value: string }[];
  // Signature
  signatureData?: string;
  // Common
  readOnly?: boolean;
  required?: boolean;
  locked?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontStyle?: 'normal' | 'bold' | 'italic' | 'bold-italic';
  textAlign?: 'left' | 'center' | 'right';
};

// ============================================
// Bookmark Types
// ============================================

export type Bookmark = {
  title: string;
  pageNumber: number;
  children?: Bookmark[];
  collapsed?: boolean;
  color?: string;
};

// ============================================
// Page Manipulation Types
// ============================================

export type PageOperation =
  | { type: 'delete'; pageIndex: number }
  | { type: 'move'; fromIndex: number; toIndex: number }
  | { type: 'rotate'; pageIndex: number; degrees: number }
  | { type: 'crop'; pageIndex: number; x: number; y: number; width: number; height: number }
  | { type: 'insert'; pageIndex: number; content: 'blank' | 'template'; template?: string }
  | { type: 'duplicate'; pageIndex: number }
  | { type: 'merge'; documents: string[] };

export type PageThumbnail = {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
};

// ============================================
// Search Types
// ============================================

export type SearchResult = {
  pageNumber: number;
  text: string;
  index: number;
  rect: { x: number; y: number; width: number; height: number };
};

export type SearchState = {
  query: string;
  results: SearchResult[];
  currentResult: number;
  totalResults: number;
  caseSensitive: boolean;
  wholeWord: boolean;
  regex: boolean;
};

// ============================================
// Export Types
// ============================================

export type ExportFormat = 'pdf' | 'png' | 'jpg' | 'svg' | 'text';

export type ExportOptions = {
  format: ExportFormat;
  pages?: number[];
  quality?: number; // 0-1 for images
  scale?: number;
  includeAnnotations?: boolean;
};

// ============================================
// View Mode Types
// ============================================

export type ViewMode = 'single' | 'continuous' | 'facing' | 'facing-first' | 'fullscreen';
export type ZoomMode = 'fit-width' | 'fit-height' | 'fit-page' | 'actual-size' | 'custom';

// ============================================
// Default Stamp Templates
// ============================================

export const defaultStamps: StampTemplate[] = [
  { id: 'approved', type: 'approved', text: 'APPROVED', color: '#22c55e' },
  { id: 'rejected', type: 'rejected', text: 'REJECTED', color: '#ef4444' },
  { id: 'draft', type: 'draft', text: 'DRAFT', color: '#f59e0b' },
  { id: 'final', type: 'final', text: 'FINAL', color: '#3b82f6' },
  { id: 'confidential', type: 'confidential', text: 'CONFIDENTIAL', color: '#dc2626' },
  { id: 'sign-here', type: 'custom', text: 'SIGN HERE', color: '#2563eb' },
  { id: 'paid', type: 'custom', text: 'PAID', color: '#22c55e' },
  { id: 'void', type: 'custom', text: 'VOID', color: '#dc2626' },
  { id: 'copy', type: 'custom', text: 'COPY', color: '#6b7280' },
  { id: 'original', type: 'custom', text: 'ORIGINAL', color: '#059669' },
];
