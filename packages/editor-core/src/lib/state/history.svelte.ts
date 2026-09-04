import { editor, type EditorState } from './editor.svelte.js';

const MAX_HISTORY = 100;

let history: EditorState[] = [];
let currentIndex = -1;
let isUndoing = false;

export function pushState(state: EditorState) {
  if (isUndoing) return;

  // Remove future states if we're in the middle of history
  history = history.slice(0, currentIndex + 1);

  // Add new state
  history.push(JSON.parse(JSON.stringify(state)));

  // Trim history if too long
  if (history.length > MAX_HISTORY) {
    history.shift();
  } else {
    currentIndex++;
  }
}

export function undo() {
  if (currentIndex <= 0) return;

  isUndoing = true;
  currentIndex--;
  const state = history[currentIndex];
  editor.reset();
  state.elements.forEach(el => editor.addElement(el));
  isUndoing = false;
}

export function redo() {
  if (currentIndex >= history.length - 1) return;

  isUndoing = true;
  currentIndex++;
  const state = history[currentIndex];
  editor.reset();
  state.elements.forEach(el => editor.addElement(el));
  isUndoing = false;
}

export function canUndo() {
  return currentIndex > 0;
}

export function canRedo() {
  return currentIndex < history.length - 1;
}

export function clearHistory() {
  history = [];
  currentIndex = -1;
}
