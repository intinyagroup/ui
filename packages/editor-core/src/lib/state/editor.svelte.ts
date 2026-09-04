import { writable, derived } from 'svelte/store';

export interface EditorElement {
  id: string;
  type: string;
  props: Record<string, any>;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  name: string;
}

export interface EditorState {
  elements: EditorElement[];
  selectedIds: string[];
  zoom: number;
  panX: number;
  panY: number;
  gridEnabled: boolean;
  gridSize: number;
  showGrid: boolean;
}

function createEditorStore() {
  const { subscribe, set, update } = writable<EditorState>({
    elements: [],
    selectedIds: [],
    zoom: 1,
    panX: 0,
    panY: 0,
    gridEnabled: true,
    gridSize: 20,
    showGrid: true
  });

  return {
    subscribe,

    // Selection
    select: (id: string) => update(s => ({ ...s, selectedIds: [id] })),
    selectMultiple: (ids: string[]) => update(s => ({ ...s, selectedIds: ids })),
    deselect: () => update(s => ({ ...s, selectedIds: [] })),
    toggleSelect: (id: string) => update(s => ({
      ...s,
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter(i => i !== id)
        : [...s.selectedIds, id]
    })),

    // Elements
    addElement: (element: EditorElement) => update(s => ({
      ...s,
      elements: [...s.elements, element]
    })),
    removeElement: (id: string) => update(s => ({
      ...s,
      elements: s.elements.filter(e => e.id !== id),
      selectedIds: s.selectedIds.filter(i => i !== id)
    })),
    updateElement: (id: string, updates: Partial<EditorElement>) => update(s => ({
      ...s,
      elements: s.elements.map(e => e.id === id ? { ...e, ...updates } : e)
    })),

    // View
    setZoom: (zoom: number) => update(s => ({ ...s, zoom })),
    setPan: (x: number, y: number) => update(s => ({ ...s, panX: x, panY: y })),
    toggleGrid: () => update(s => ({ ...s, showGrid: !s.showGrid })),

    // Reset
    reset: () => set({
      elements: [],
      selectedIds: [],
      zoom: 1,
      panX: 0,
      panY: 0,
      gridEnabled: true,
      gridSize: 20,
      showGrid: true
    })
  };
}

export const editor = createEditorStore();

// Derived stores
export const selectedElements = derived(editor, $editor =>
  $editor.elements.filter(e => $editor.selectedIds.includes(e.id))
);

export const elementCount = derived(editor, $editor => $editor.elements.length);
