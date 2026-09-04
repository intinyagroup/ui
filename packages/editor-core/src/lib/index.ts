// @intinyagroup/editor-core
// Visual editor engine for Intinya UI

// DnD System
export { Draggable, Droppable, DragOverlay, Sortable } from './dnd/index.js';
export { snapToGrid, snapToElements } from './dnd/GridSnap.js';
export type { GridSnapOptions } from './dnd/GridSnap.js';

// Canvas
export { Canvas, Grid, Overlay } from './canvas/index.js';

// State
export { editor, selectedElements, elementCount } from './state/editor.svelte.js';
export { undo, redo, canUndo, canRedo, pushState, clearHistory } from './state/history.svelte.js';
export { getTree, moveElement, bringToFront, sendToBack } from './state/tree.svelte.js';
export type { EditorElement, EditorState } from './state/editor.svelte.js';
export type { TreeNode } from './state/tree.svelte.js';

// Export
export { exportToSvelte, exportToReact, exportToHTML } from './export/index.js';

// UI Panels
export { ComponentPanel, PropertyPanel, LayerPanel, Toolbar } from './ui/index.js';
