// ============================================
// RTL/LTR unicode support — bidirectional text
// ============================================

// Unicode bidirectional characters
export const BIDI_CHARS = {
  // Strong right-to-left
  RLM: '\u200F',  // Right-to-Left Mark
  RTL: '\u202B',  // Right-to-Left Embedding
  RLE: '\u202B',  // Right-to-Left Embedding
  RLO: '\u202E',  // Right-to-Left Override

  // Strong left-to-right
  LRM: '\u200E',  // Left-to-Right Mark
  LTR: '\u202A',  // Left-to-Right Embedding
  LRE: '\u202A',  // Left-to-Right Embedding
  LRO: '\u202D',  // Left-to-Right Override

  // Neutral
  FSI: '\u2068',  // First Strong Isolate
  PDI: '\u2069',  // Pop Directional Isolate
  PDF: '\u202C',  // Pop Directional Formatting

  // Paragraph
  LRE: '\u202A',  // Left-to-Right Embedding
  RLE: '\u202B',  // Right-to-Left Embedding
  LRO: '\u202D',  // Left-to-Right Override
  RLO: '\u202E',  // Right-to-Left Override

  // Neutral
  FSI: '\u2068',  // First Strong Isolate
  PDI: '\u2069',  // Pop Directional Isolate
  PDF: '\u202C',  // Pop Directional Formatting
} as const;

// RTL languages
export const RTL_LANGUAGES = [
  'ar', 'ar-AE', 'ar-SA', 'ar-EG', 'ar-MA',
  'he', 'he-IL',
  'fa', 'fa-IR',
  'ur', 'ur-PK',
  'yi',
  'ps',
  'sd',
  'ug',
  'ku',
  'fa-AF',
] as const;

// Common RTL scripts regex
const RTL_SCRIPTS = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;

/**
 * Detect if text is RTL
 */
export function isRTL(text: string): boolean {
  if (!text) return false;
  // Check first strong character
  for (const char of text) {
    if (RTL_SCRIPTS.test(char)) return true;
    // Skip weak/neutral characters
    if (/[\s\d\p{P}]/u.test(char)) continue;
    // Found a strong LTR character
    return false;
  }
  return false;
}

/**
 * Detect if a language code is RTL
 */
export function isRTLLanguage(langCode: string): boolean {
  const base = langCode.split('-')[0].toLowerCase();
  return (RTL_LANGUAGES as readonly string[]).some(
    (rtl) => rtl.toLowerCase().startsWith(base)
  );
}

/**
 * Get text direction from content and language
 */
export function getTextDirection(text: string, lang?: string): 'ltr' | 'rtl' {
  if (lang && isRTLLanguage(lang)) return 'rtl';
  return isRTL(text) ? 'rtl' : 'ltr';
}

/**
 * Wrap text with appropriate BIDI isolation
 */
export function wrapBidi(text: string, direction: 'ltr' | 'rtl' = 'auto'): string {
  if (direction === 'auto') {
    direction = isRTL(text) ? 'rtl' : 'ltr';
  }

  const isolate = direction === 'rtl' ? BIDI_CHARS.FSI : BIDI_CHARS.LRE;
  const pop = BIDI_CHARS.PDI;

  return `${isolate}${text}${pop}`;
}

/**
 * Add RTL mark to text
 */
export function addRTLMark(text: string): string {
  return `${BIDI_CHARS.RLM}${text}`;
}

/**
 * Add LTR mark to text
 */
export function addLTRMark(text: string): string {
  return `${BIDI_CHARS.LRM}${text}`;
}

/**
 * Get CSS direction from text content
 */
export function getDirectionStyle(text: string, lang?: string): string {
  const dir = getTextDirection(text, lang);
  return `direction: ${dir}; text-align: ${dir === 'rtl' ? 'right' : 'left'};`;
}

/**
 * Common emoji categories for picker
 */
export const emojiCategories = [
  {
    name: 'Smileys',
    icon: '😊',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🫢', '🫣', '🤫', '🤔', '🫡', '🤐', '🤨', '😐', '😑', '😶', '🫥', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🥵', '🥶', '🥴', '😵', '🤯', '🥳', '🥸', '😎', '🤓', '🧐']
  },
  {
    name: 'Gestures',
    icon: '👋',
    emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '🫱', '🫲', '🫳', '🫴', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '🫵', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '🫶', '👐', '🤲', '🤝', '🙏']
  },
  {
    name: 'Objects',
    icon: '💡',
    emojis: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '📡', '🔋', '🪫', '🪛', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪚', '🔩', '⚙️', '🗜️', '🪤', '🧰', '🪜']
  },
  {
    name: 'Nature',
    icon: '🌿',
    emojis: ['🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🪹', '🪺', '🍄', '🪵', '🌰', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵']
  },
  {
    name: 'Symbols',
    icon: '❤️',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⚛️']
  },
  {
    name: 'Flags',
    icon: '🏁',
    emojis: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇺🇸', '🇬🇧', '🇫🇷', '🇩🇪', '🇮🇹', '🇪🇸', '🇯🇵', '🇰🇷', '🇨🇳', '🇮🇳', '🇧🇷', '🇷🇺', '🇦🇺', '🇨🇦', '🇲🇽', '🇦🇷']
  }
];

/**
 * Search emojis by keyword
 */
export function searchEmojis(query: string): string[] {
  if (!query) return [];
  const lower = query.toLowerCase();
  const results: string[] = [];

  for (const category of emojiCategories) {
    // Search in category name
    if (category.name.toLowerCase().includes(lower)) {
      results.push(...category.emojis);
    }
  }

  return results;
}

/**
 * Get recent emojis from localStorage
 */
export function getRecentEmojis(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('emoji-recents');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Add emoji to recent list
 */
export function addRecentEmoji(emoji: string): void {
  if (typeof window === 'undefined') return;
  try {
    const recents = getRecentEmojis().filter((e) => e !== emoji);
    recents.unshift(emoji);
    localStorage.setItem('emoji-recents', JSON.stringify(recents.slice(0, 20)));
  } catch {
    // Ignore storage errors
  }
}
