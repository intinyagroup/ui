// ============================================
// @intinyagroup/slides — Presentation Editor
// ============================================

// Main component
export { default as SlidesEditor } from './components/SlidesEditor.svelte';

// Sub-components
export { default as SlideSidebar } from './components/SlideSidebar.svelte';
export { default as SlideCanvas } from './components/SlideCanvas.svelte';
export { default as SlideShow } from './components/SlideShow.svelte';

// Data model & utilities
export {
  createSlide,
  createPresentation,
  addSlide,
  duplicateSlide,
  deleteSlide,
  reorderSlides,
  defaultThemes,
  defaultTheme,
  aspectRatios,
  slideLayouts,
  slideTransitions,
  type Slide,
  type SlideLayout,
  type SlideTransition,
  type SlideElement,
  type ElementStyle,
  type PresentationTheme,
  type Presentation,
} from './slide-model.js';

// PDF export
export { exportSlidesToPdf } from './pdf-export.js';
