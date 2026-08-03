// ============================================
// Caption animations — word-level timing
// ============================================

import type { CaptionLine, CaptionStyle } from './caption-model.js';

/** Get CSS styles for caption at a specific time */
export function getCaptionStyles(
  line: CaptionLine,
  currentTimeMs: number,
  style: CaptionStyle
): { css: string; wordIndex: number } {
  if (currentTimeMs < line.startMs || currentTimeMs > line.endMs) {
    return { css: 'opacity: 0;', wordIndex: -1 };
  }

  const elapsed = currentTimeMs - line.startMs;
  const progress = Math.min(1, elapsed / (line.endMs - line.startMs));

  let animationCss = '';
  let wordIndex = 0;

  // Find current word
  for (let i = 0; i < line.words.length; i++) {
    if (currentTimeMs >= line.words[i].startMs && currentTimeMs <= line.words[i].endMs) {
      wordIndex = i;
      break;
    }
  }

  switch (style.animation) {
    case 'pop-in':
      const scale = Math.min(1, progress * 2);
      animationCss = `transform: scale(${scale}); opacity: ${Math.min(1, progress * 3)};`;
      break;
    case 'slide-up':
      const translateY = (1 - Math.min(1, progress * 2)) * 30;
      animationCss = `transform: translateY(${translateY}px); opacity: ${Math.min(1, progress * 3)};`;
      break;
    case 'slide-down':
      const slideDown = (1 - Math.min(1, progress * 2)) * -30;
      animationCss = `transform: translateY(${slideDown}px); opacity: ${Math.min(1, progress * 3)};`;
      break;
    case 'highlight':
      animationCss = `opacity: 1;`;
      break;
    case 'karaoke':
      animationCss = `opacity: 1;`;
      break;
    case 'typewriter':
      const visibleChars = Math.floor(progress * line.text.length);
      animationCss = `clip-path: inset(0 ${100 - (visibleChars / line.text.length) * 100}% 0 0);`;
      break;
    default:
      animationCss = 'opacity: 1;';
  }

  return { css: animationCss, wordIndex };
}

/** Render caption as HTML */
export function renderCaptionHTML(line: CaptionLine, currentTimeMs: number, style: CaptionStyle): string {
  const { css, wordIndex } = getCaptionStyles(line, currentTimeMs, style);

  let wordsHtml = '';
  for (let i = 0; i < line.words.length; i++) {
    const word = line.words[i];
    const isCurrent = i === wordIndex;
    const isPast = currentTimeMs > word.endMs;

    let wordStyle = '';
    if (style.animation === 'highlight' && isCurrent) {
      wordStyle = `color: ${style.color}; font-weight: bold; text-shadow: 0 0 20px ${style.color};`;
    } else if (style.animation === 'karaoke') {
      if (isCurrent) {
        wordStyle = `color: #ffeb3b; font-weight: bold;`;
      } else if (isPast) {
        wordStyle = `color: ${style.color}; opacity: 0.5;`;
      } else {
        wordStyle = `color: ${style.color}; opacity: 0.3;`;
      }
    } else {
      wordStyle = `color: ${style.color};`;
    }

    wordsHtml += `<span style="${wordStyle}">${word.text}</span> `;
  }

  const positionStyle = style.position === 'bottom'
    ? 'bottom: 10%; left: 50%; transform: translateX(-50%);'
    : style.position === 'top'
      ? 'top: 10%; left: 50%; transform: translateX(-50%);'
      : 'top: 50%; left: 50%; transform: translate(-50%, -50%);';

  return `<div class="caption-line" style="position: absolute; ${positionStyle} font-family: ${style.fontFamily}; font-size: ${style.fontSize}px; ${style.backgroundColor ? `background: ${style.backgroundColor};` : ''} padding: ${style.padding}px; border-radius: ${style.borderRadius}px; text-align: ${style.alignment}; ${css} pointer-events: none; z-index: 10;">${wordsHtml}</div>`;
}
