// ============================================
// Caption model — word-level timing
// ============================================

export type CaptionWord = {
  text: string;
  startMs: number;
  endMs: number;
};

export type CaptionLine = {
  id: string;
  text: string;
  startMs: number;
  endMs: number;
  words: CaptionWord[];
};

export type CaptionStyle = {
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor?: string;
  position: 'top' | 'center' | 'bottom';
  alignment: 'left' | 'center' | 'right';
  padding: number;
  borderRadius: number;
  animation: CaptionAnimation;
};

export type CaptionAnimation = 'none' | 'pop-in' | 'slide-up' | 'slide-down' | 'highlight' | 'karaoke' | 'typewriter';

export type CaptionTrack = {
  id: string;
  name: string;
  lines: CaptionLine[];
  style: CaptionStyle;
  visible: boolean;
};

export function createCaptionTrack(): CaptionTrack {
  return {
    id: `cap-${Date.now()}`,
    name: 'Captions',
    lines: [],
    style: createCaptionStyle(),
    visible: true,
  };
}

export function createCaptionStyle(): CaptionStyle {
  return {
    fontFamily: 'Inter, sans-serif',
    fontSize: 48,
    color: '#ffffff',
    backgroundColor: 'rgba(0,0,0,0.75)',
    position: 'bottom',
    alignment: 'center',
    padding: 12,
    borderRadius: 8,
    animation: 'pop-in',
  };
}

export function createCaptionLine(text: string, startMs: number, endMs: number): CaptionLine {
  const words = text.split(/\s+/).filter(Boolean);
  const wordDuration = (endMs - startMs) / words.length;

  return {
    id: `capline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    startMs,
    endMs,
    words: words.map((word, i) => ({
      text: word,
      startMs: startMs + i * wordDuration,
      endMs: startMs + (i + 1) * wordDuration,
    })),
  };
}

/** Parse SRT text into caption lines */
export function parseSRT(srtText: string): CaptionLine[] {
  const lines: CaptionLine[] = [];
  const blocks = srtText.trim().split(/\n\n+/);

  for (const block of blocks) {
    const parts = block.split('\n');
    if (parts.length < 3) continue;

    const timeMatch = parts[1].match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
    if (!timeMatch) continue;

    const text = parts.slice(2).join(' ').replace(/<[^>]*>/g, '');
    const startMs = parseSRTTime(timeMatch[1]);
    const endMs = parseSRTTime(timeMatch[2]);

    lines.push(createCaptionLine(text, startMs, endMs));
  }

  return lines;
}

function parseSRTTime(time: string): number {
  const [hms, ms] = time.split(',');
  const [h, m, s] = hms.split(':').map(Number);
  return h * 3600000 + m * 60000 + s * 1000 + Number(ms);
}

/** Export caption lines to SRT format */
export function exportToSRT(lines: CaptionLine[]): string {
  return lines
    .map((line, i) => {
      const start = formatSRTTime(line.startMs);
      const end = formatSRTTime(line.endMs);
      return `${i + 1}\n${start} --> ${end}\n${line.text}\n`;
    })
    .join('\n');
}

function formatSRTTime(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const mil = ms % 1000;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(mil).padStart(3, '0')}`;
}
