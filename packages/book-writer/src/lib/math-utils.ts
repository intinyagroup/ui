// ============================================
// Math equation utilities — KaTeX rendering
// ============================================

/**
 * Render LaTeX math to HTML using KaTeX
 * Falls back to plain text if KaTeX is not loaded
 */
export function renderMath(latex: string, displayMode = false): string {
  if (typeof window === 'undefined') return latex;

  // Check if KaTeX is available
  const katex = (window as any).katex;
  if (!katex) {
    // Load KaTeX dynamically
    loadKaTeX();
    return `<span class="math-placeholder">${latex}</span>`;
  }

  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      trust: true,
    });
  } catch {
    return `<span class="math-error">${latex}</span>`;
  }
}

/**
 * Load KaTeX CSS and JS dynamically
 */
export function loadKaTeX() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('katex-css')) return;

  // CSS
  const link = document.createElement('link');
  link.id = 'katex-css';
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
  document.head.appendChild(link);

  // JS
  const script = document.createElement('script');
  script.id = 'katex-js';
  script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
  script.onload = () => {
    // Render any placeholders
    document.querySelectorAll('.math-placeholder').forEach((el) => {
      const latex = el.textContent || '';
      const rendered = renderMath(latex, false);
      el.outerHTML = rendered;
    });
  };
  document.head.appendChild(script);
}

/**
 * Check if content contains math expressions
 */
export function hasMath(content: string): boolean {
  return /\$\$[\s\S]+\$\$|\$[^$]+\$/.test(content);
}

/**
 * Extract math expressions from content
 */
export function extractMath(content: string): { inline: string[]; display: string[] } {
  const inline = content.match(/\$[^$]+\$/g) ?? [];
  const display = content.match(/\$\$[\s\S]+\$\$/g) ?? [];
  return {
    inline: inline.map((m) => m.slice(1, -1)),
    display: display.map((m) => m.slice(2, -2)),
  };
}

/**
 * Convert inline math markers to KaTeX spans in HTML
 */
export function processInlineMath(html: string): string {
  // Replace $...$ with rendered math
  return html.replace(/\$([^$]+)\$/g, (_, latex) => {
    return renderMath(latex, false);
  });
}

/**
 * Convert display math markers to KaTeX blocks in HTML
 */
export function processDisplayMath(html: string): string {
  return html.replace(/\$\$([\s\S]+?)\$\$/g, (_, latex) => {
    return `<div class="math-display">${renderMath(latex, true)}</div>`;
  });
}

/**
 * Common LaTeX templates
 */
export const mathTemplates = [
  { label: 'Fraction', latex: '\\frac{a}{b}' },
  { label: 'Square root', latex: '\\sqrt{x}' },
  { label: 'Sum', latex: '\\sum_{i=1}^{n} x_i' },
  { label: 'Integral', latex: '\\int_{a}^{b} f(x) \\, dx' },
  { label: 'Matrix', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  { label: 'Limit', latex: '\\lim_{x \\to \\infty} f(x)' },
  { label: 'Derivative', latex: '\\frac{d}{dx} f(x)' },
  { label: 'Greek letters', latex: '\\alpha \\beta \\gamma \\delta \\epsilon' },
  { label: 'Subscript', latex: 'x_{i}' },
  { label: 'Superscript', latex: 'x^{n}' },
];
