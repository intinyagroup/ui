// ============================================
// Slide data model — slides, themes, transitions
// ============================================

export type SlideLayout = 'title' | 'title-content' | 'two-column' | 'image-left' | 'image-right' | 'blank' | 'section';

export type SlideTransition = 'none' | 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'zoom' | 'flip' | 'cube';

export type SlideElement = {
  id: string;
  type: 'text' | 'image' | 'shape' | 'chart' | 'code';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string;
  style: ElementStyle;
  locked?: boolean;
  visible?: boolean;
};

export type ElementStyle = {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  opacity?: number;
  shadow?: boolean;
};

export type Slide = {
  id: string;
  layout: SlideLayout;
  elements: SlideElement[];
  background: string;
  transition: SlideTransition;
  transitionDuration: number; // ms
  notes: string;
  order: number;
  isHidden: boolean;
};

export type PresentationTheme = {
  id: string;
  name: string;
  background: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  titleFont: string;
  titleSize: number;
  subtitleSize: number;
  bodySize: number;
};

export type Presentation = {
  id: string;
  title: string;
  description: string;
  theme: PresentationTheme;
  slides: Slide[];
  aspectRatio: '16:9' | '4:3' | '1:1';
  createdAt: string;
  updatedAt: string;
};

// Default themes
export const defaultThemes: PresentationTheme[] = [
  {
    id: 'modern',
    name: 'Modern',
    background: '#ffffff',
    textColor: '#1a1a1a',
    accentColor: '#3b82f6',
    fontFamily: 'Inter, system-ui, sans-serif',
    titleFont: 'Inter, system-ui, sans-serif',
    titleSize: 48,
    subtitleSize: 24,
    bodySize: 18,
  },
  {
    id: 'dark',
    name: 'Dark',
    background: '#1a1a2e',
    textColor: '#ffffff',
    accentColor: '#e94560',
    fontFamily: 'Inter, system-ui, sans-serif',
    titleFont: 'Inter, system-ui, sans-serif',
    titleSize: 48,
    subtitleSize: 24,
    bodySize: 18,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    background: '#fefefe',
    textColor: '#2d3748',
    accentColor: '#805ad5',
    fontFamily: 'Georgia, serif',
    titleFont: 'Georgia, serif',
    titleSize: 44,
    subtitleSize: 22,
    bodySize: 16,
  },
  {
    id: 'bold',
    name: 'Bold',
    background: '#0f172a',
    textColor: '#f8fafc',
    accentColor: '#f59e0b',
    fontFamily: 'Inter, system-ui, sans-serif',
    titleFont: 'Inter, system-ui, sans-serif',
    titleSize: 52,
    subtitleSize: 28,
    bodySize: 18,
  },
  {
    id: 'nature',
    name: 'Nature',
    background: '#f0fdf4',
    textColor: '#14532d',
    accentColor: '#16a34a',
    fontFamily: 'Inter, system-ui, sans-serif',
    titleFont: 'Inter, system-ui, sans-serif',
    titleSize: 46,
    subtitleSize: 24,
    bodySize: 18,
  },
];

export const defaultTheme = defaultThemes[0];

// Aspect ratios
export const aspectRatios: Record<string, { width: number; height: number }> = {
  '16:9': { width: 1920, height: 1080 },
  '4:3': { width: 1024, height: 768 },
  '1:1': { width: 1080, height: 1080 },
};

// Slide layouts
export const slideLayouts: { value: SlideLayout; label: string; description: string }[] = [
  { value: 'title', label: 'Title Slide', description: 'Big title with subtitle' },
  { value: 'title-content', label: 'Title + Content', description: 'Title at top, content below' },
  { value: 'two-column', label: 'Two Columns', description: 'Side by side content' },
  { value: 'image-left', label: 'Image Left', description: 'Image on left, text on right' },
  { value: 'image-right', label: 'Image Right', description: 'Text on left, image on right' },
  { value: 'blank', label: 'Blank', description: 'Empty slide' },
  { value: 'section', label: 'Section', description: 'Section divider' },
];

// Transitions
export const slideTransitions: { value: SlideTransition; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'fade', label: 'Fade' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'slide-down', label: 'Slide Down' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'flip', label: 'Flip' },
  { value: 'cube', label: 'Cube' },
];

// Create helpers
export function createSlide(layout: SlideLayout = 'title-content', order: number = 0): Slide {
  return {
    id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    layout,
    elements: createDefaultElements(layout),
    background: '',
    transition: 'fade',
    transitionDuration: 500,
    notes: '',
    order,
    isHidden: false,
  };
}

function createDefaultElements(layout: SlideLayout): SlideElement[] {
  const elements: SlideElement[] = [];

  switch (layout) {
    case 'title':
      elements.push(
        { id: 'el-1', type: 'text', x: 10, y: 35, width: 80, height: 20, rotation: 0, content: 'Title', style: { fontSize: 48, fontWeight: 'bold', textAlign: 'center' } },
        { id: 'el-2', type: 'text', x: 10, y: 60, width: 80, height: 10, rotation: 0, content: 'Subtitle', style: { fontSize: 24, textAlign: 'center', color: '#666666' } }
      );
      break;
    case 'title-content':
      elements.push(
        { id: 'el-1', type: 'text', x: 5, y: 5, width: 90, height: 15, rotation: 0, content: 'Slide Title', style: { fontSize: 36, fontWeight: 'bold' } },
        { id: 'el-2', type: 'text', x: 5, y: 25, width: 90, height: 65, rotation: 0, content: 'Add your content here...', style: { fontSize: 18 } }
      );
      break;
    case 'two-column':
      elements.push(
        { id: 'el-1', type: 'text', x: 5, y: 5, width: 90, height: 12, rotation: 0, content: 'Slide Title', style: { fontSize: 36, fontWeight: 'bold' } },
        { id: 'el-2', type: 'text', x: 5, y: 22, width: 42, height: 65, rotation: 0, content: 'Left column content...', style: { fontSize: 16 } },
        { id: 'el-3', type: 'text', x: 53, y: 22, width: 42, height: 65, rotation: 0, content: 'Right column content...', style: { fontSize: 16 } }
      );
      break;
    case 'image-left':
      elements.push(
        { id: 'el-1', type: 'text', x: 55, y: 10, width: 40, height: 10, rotation: 0, content: 'Slide Title', style: { fontSize: 32, fontWeight: 'bold' } },
        { id: 'el-2', type: 'text', x: 55, y: 25, width: 40, height: 60, rotation: 0, content: 'Description text goes here...', style: { fontSize: 16 } },
        { id: 'el-3', type: 'image', x: 5, y: 10, width: 45, height: 80, rotation: 0, content: '', style: { borderRadius: 8 } }
      );
      break;
    case 'image-right':
      elements.push(
        { id: 'el-1', type: 'text', x: 5, y: 10, width: 40, height: 10, rotation: 0, content: 'Slide Title', style: { fontSize: 32, fontWeight: 'bold' } },
        { id: 'el-2', type: 'text', x: 5, y: 25, width: 40, height: 60, rotation: 0, content: 'Description text goes here...', style: { fontSize: 16 } },
        { id: 'el-3', type: 'image', x: 50, y: 10, width: 45, height: 80, rotation: 0, content: '', style: { borderRadius: 8 } }
      );
      break;
    case 'section':
      elements.push(
        { id: 'el-1', type: 'text', x: 10, y: 40, width: 80, height: 20, rotation: 0, content: 'Section Title', style: { fontSize: 42, fontWeight: 'bold', textAlign: 'center' } }
      );
      break;
    default:
      break;
  }

  return elements;
}

export function createPresentation(title: string = 'Untitled Presentation'): Presentation {
  return {
    id: `pres-${Date.now()}`,
    title,
    description: '',
    theme: defaultTheme,
    slides: [createSlide('title', 0)],
    aspectRatio: '16:9',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function addSlide(presentation: Presentation, layout: SlideLayout = 'title-content'): Presentation {
  const newSlide = createSlide(layout, presentation.slides.length);
  return {
    ...presentation,
    slides: [...presentation.slides, newSlide],
    updatedAt: new Date().toISOString(),
  };
}

export function duplicateSlide(presentation: Presentation, slideId: string): Presentation {
  const slide = presentation.slides.find((s) => s.id === slideId);
  if (!slide) return presentation;

  const newSlide: Slide = {
    ...JSON.parse(JSON.stringify(slide)),
    id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    order: presentation.slides.length,
  };

  const index = presentation.slides.findIndex((s) => s.id === slideId);
  const slides = [...presentation.slides];
  slides.splice(index + 1, 0, newSlide);

  return {
    ...presentation,
    slides: slides.map((s, i) => ({ ...s, order: i })),
    updatedAt: new Date().toISOString(),
  };
}

export function deleteSlide(presentation: Presentation, slideId: string): Presentation {
  return {
    ...presentation,
    slides: presentation.slides.filter((s) => s.id !== slideId).map((s, i) => ({ ...s, order: i })),
    updatedAt: new Date().toISOString(),
  };
}

export function reorderSlides(presentation: Presentation, fromIndex: number, toIndex: number): Presentation {
  const slides = [...presentation.slides];
  const [moved] = slides.splice(fromIndex, 1);
  slides.splice(toIndex, 0, moved);
  return {
    ...presentation,
    slides: slides.map((s, i) => ({ ...s, order: i })),
    updatedAt: new Date().toISOString(),
  };
}
