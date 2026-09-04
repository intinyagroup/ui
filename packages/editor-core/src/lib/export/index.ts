// Export system for Intinya Editor

import type { EditorElement } from '../state/editor.svelte.js';

// Svelte exporter
export function exportToSvelte(elements: EditorElement[]): string {
  const imports = new Set<string>();
  const componentUsages: string[] = [];

  for (const el of elements) {
    imports.add(`import { ${el.type} } from '@intinyagroup/ui';`);
    componentUsages.push(
      `<${el.type}\n` +
      `  class="absolute"\n` +
      `  style="left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px;"\n` +
      `/>`
    );
  }

  return `<script>
${Array.from(imports).join('\n')}
</script>

<div class="relative">
${componentUsages.join('\n\n')}
</div>`;
}

// React exporter
export function exportToReact(elements: EditorElement[]): string {
  const imports = new Set<string>();
  const componentUsages: string[] = [];

  for (const el of elements) {
    imports.add(`import { ${el.type} } from '@intinyagroup/react';`);
    componentUsages.push(
      `<${el.type}\n` +
      `  className="absolute"\n` +
      `  style={{ left: ${el.x}, top: ${el.y}, width: ${el.width}, height: ${el.height} }}\n` +
      `/>`
    );
  }

  return `'use client';

import React from 'react';
${Array.from(imports).join('\n')}

export default function Page() {
  return (
    <div className="relative">
${componentUsages.join('\n\n')}
    </div>
  );
}`;
}

// HTML exporter
export function exportToHTML(elements: EditorElement[]): string {
  const components = elements.map(el => 
    `<div class="component ${el.type}" style="position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px;">\n` +
    `  <!-- ${el.type} -->\n` +
    `</div>`
  ).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Page</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
</head>
<body>
  <div class="relative">
${components}
  </div>
</body>
</html>`;
}
