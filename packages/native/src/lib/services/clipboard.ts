import { Clipboard } from '@capacitor/clipboard';

/**
 * Copy text to the clipboard. Prefers the native @capacitor/clipboard plugin,
 * falling back to the asynchronous `navigator.clipboard` API.
 */
export async function writeClipboard(text: string): Promise<void> {
  try {
    await Clipboard.write({ string: text });
    return;
  } catch {
    // fall through to the web API
  }

  const g = globalThis as {
    navigator?: { clipboard?: { writeText(text: string): Promise<void> } };
  };
  if (g.navigator?.clipboard?.writeText) {
    await g.navigator.clipboard.writeText(text);
    return;
  }

  // Legacy textarea + execCommand fallback for non-secure contexts.
  const el = typeof document?.createElement === 'function' ? document.createElement('textarea') : null;
  if (!el) throw new Error('Clipboard is not available in this environment');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  const ok = document.execCommand?.('copy');
  document.body.removeChild(el);
  if (!ok) throw new Error('Clipboard copy failed');
}

/**
 * Read text from the clipboard. Prefers the native plugin and falls back to
 * the `navigator.clipboard.readText()` API.
 */
export async function readClipboard(): Promise<string> {
  try {
    const { value } = await Clipboard.read();
    return value ?? '';
  } catch {
    // fall through to the web API
  }

  const g = navigator as {
    clipboard?: { readText(): Promise<string> };
  };
  if (g.clipboard?.readText) {
    return g.clipboard.readText();
  }
  throw new Error('Clipboard read is not available in this environment');
}