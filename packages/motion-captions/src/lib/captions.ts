// ============================================
// Caption model + animation + SRT parsing
// ============================================

export type CaptionWord = { text: string; startMs: number; endMs: number };
export type CaptionLine = { id: string; text: string; startMs: number; endMs: number; words: CaptionWord[] };
export type CaptionStyle = { fontFamily: string; fontSize: number; color: string; backgroundColor?: string; position: 'top' | 'center' | 'bottom'; alignment: 'left' | 'center' | 'right'; padding: number; borderRadius: number; animation: CaptionAnimation };
export type CaptionAnimation = 'none' | 'pop-in' | 'slide-up' | 'slide-down' | 'highlight' | 'karaoke' | 'typewriter';
export type CaptionTrack = { id: string; name: string; lines: CaptionLine[]; style: CaptionStyle; visible: boolean };

export function createCaptionTrack(): CaptionTrack { return { id: `cap-${Date.now()}`, name: 'Captions', lines: [], style: createCaptionStyle(), visible: true }; }
export function createCaptionStyle(): CaptionStyle { return { fontFamily: 'Inter, sans-serif', fontSize: 48, color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.75)', position: 'bottom', alignment: 'center', padding: 12, borderRadius: 8, animation: 'pop-in' }; }
export function createCaptionLine(text: string, startMs: number, endMs: number): CaptionLine {
  const words = text.split(/\s+/).filter(Boolean);
  const wordDuration = (endMs - startMs) / words.length;
  return { id: `capline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text, startMs, endMs, words: words.map((w, i) => ({ text: w, startMs: startMs + i * wordDuration, endMs: startMs + (i + 1) * wordDuration })) };
}

export function getCaptionStyles(line: CaptionLine, currentTimeMs: number, style: CaptionStyle): { css: string; wordIndex: number } {
  if (currentTimeMs < line.startMs || currentTimeMs > line.endMs) return { css: 'opacity: 0;', wordIndex: -1 };
  const progress = Math.min(1, (currentTimeMs - line.startMs) / (line.endMs - line.startMs));
  let wordIndex = 0;
  for (let i = 0; i < line.words.length; i++) { if (currentTimeMs >= line.words[i].startMs && currentTimeMs <= line.words[i].endMs) { wordIndex = i; break; } }
  let anim = '';
  switch (style.animation) {
    case 'pop-in': anim = `transform: scale(${Math.min(1, progress * 2)}); opacity: ${Math.min(1, progress * 3)};`; break;
    case 'slide-up': anim = `transform: translateY(${(1 - Math.min(1, progress * 2)) * 30}px); opacity: ${Math.min(1, progress * 3)};`; break;
    case 'slide-down': anim = `transform: translateY(${(1 - Math.min(1, progress * 2)) * -30}px); opacity: ${Math.min(1, progress * 3)};`; break;
    case 'typewriter': anim = `clip-path: inset(0 ${100 - (progress * line.text.length / line.text.length) * 100}% 0 0);`; break;
    case 'highlight': case 'karaoke': anim = 'opacity: 1;'; break;
    default: anim = 'opacity: 1;';
  }
  return { css: anim, wordIndex };
}

export function renderCaptionHTML(line: CaptionLine, currentTimeMs: number, style: CaptionStyle): string {
  const { wordIndex } = getCaptionStyles(line, currentTimeMs, style);
  let wordsHtml = '';
  for (let i = 0; i < line.words.length; i++) {
    const w = line.words[i]; const isCurrent = i === wordIndex; const isPast = currentTimeMs > w.endMs;
    let ws = `color: ${style.color};`;
    if (style.animation === 'highlight' && isCurrent) ws = `color: ${style.color}; font-weight: bold; text-shadow: 0 0 20px ${style.color};`;
    else if (style.animation === 'karaoke') ws = isCurrent ? 'color: #ffeb3b; font-weight: bold;' : isPast ? `color: ${style.color}; opacity: 0.5;` : `color: ${style.color}; opacity: 0.3;`;
    wordsHtml += `<span style="${ws}">${w.text}</span> `;
  }
  const pos = style.position === 'bottom' ? 'bottom: 10%; left: 50%; transform: translateX(-50%);' : style.position === 'top' ? 'top: 10%; left: 50%; transform: translateX(-50%);' : 'top: 50%; left: 50%; transform: translate(-50%, -50%);';
  return `<div style="position: absolute; ${pos} font-family: ${style.fontFamily}; font-size: ${style.fontSize}px; ${style.backgroundColor ? `background: ${style.backgroundColor};` : ''} padding: ${style.padding}px; border-radius: ${style.borderRadius}px; text-align: ${style.alignment}; pointer-events: none; z-index: 10;">${wordsHtml}</div>`;
}

export function parseSRT(srtText: string): CaptionLine[] {
  const lines: CaptionLine[] = [];
  for (const block of srtText.trim().split(/\n\n+/)) {
    const parts = block.split('\n');
    if (parts.length < 3) continue;
    const m = parts[1].match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
    if (!m) continue;
    const text = parts.slice(2).join(' ').replace(/<[^>]*>/g, '');
    lines.push(createCaptionLine(text, parseSRTTime(m[1]), parseSRTTime(m[2])));
  }
  return lines;
}

function parseSRTTime(t: string): number { const [hms, ms] = t.split(','); const [h, m, s] = hms.split(':').map(Number); return h * 3600000 + m * 60000 + s * 1000 + Number(ms); }

export function exportToSRT(lines: CaptionLine[]): string {
  return lines.map((l, i) => { const s = fmtSRT(l.startMs), e = fmtSRT(l.endMs); return `${i + 1}\n${s} --> ${e}\n${l.text}\n`; }).join('\n');
}
function fmtSRT(ms: number): string { const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000), mil = ms % 1000; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(mil).padStart(3, '0')}`; }
