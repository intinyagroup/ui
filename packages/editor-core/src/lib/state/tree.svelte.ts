import { get } from 'svelte/store';
import { editor, type EditorElement } from './editor.svelte.js';

export interface TreeNode {
  id: string;
  name: string;
  type: string;
  children: TreeNode[];
  collapsed: boolean;
}

export function getTree(): TreeNode[] {
  const state = get(editor);
  return state.elements.map(el => ({
    id: el.id,
    name: el.name,
    type: el.type,
    children: [],
    collapsed: false
  }));
}

export function moveElement(id: string, newIndex: number) {
  editor.updateElement(id, { zIndex: newIndex });
}

export function bringToFront(id: string) {
  const state = get(editor);
  const maxZ = Math.max(...state.elements.map(e => e.zIndex), 0);
  editor.updateElement(id, { zIndex: maxZ + 1 });
}

export function sendToBack(id: string) {
  const state = get(editor);
  const minZ = Math.min(...state.elements.map(e => e.zIndex), 0);
  editor.updateElement(id, { zIndex: minZ - 1 });
}
