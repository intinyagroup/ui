---
title: Wave Section
description: Flat section with a wavy SVG top or bottom divider.
---

# Wave Section

A full-width section whose top or bottom edge is a wavy SVG divider. Use it to transition between sections with different background colors.

## Preview

```svelte
<script>
  import { WaveSection } from '@intinyagroup/flat';
</script>

<div class="bg-white">
  <WaveSection color="var(--flat-blue)" height="120px">
    <div class="h-40 flex items-center justify-center text-white">
      Content above the wave
    </div>
  </WaveSection>
</div>

<div class="bg-[var(--flat-teal)] h-24"></div>
```

## Usage

```svelte
<script>
  import { WaveSection } from '@intinyagroup/flat';
</script>

<WaveSection color="var(--flat-purple)" flip height="150px">
  <div class="h-48 flex items-center justify-center text-white">
    Content below the wave
  </div>
</WaveSection>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `'var(--flat-blue)'` | Section background color |
| `flip` | `boolean` | `false` | Render wave at the bottom instead of the top |
| `height` | `string` | `'150px'` | Wave height |
| `class` | `string` | `undefined` | Additional CSS classes |
| `children` | `Snippet` | `undefined` | Content rendered on top of the wave |

## Install

```bash
npx @intinyagroup/cli add flat-wave-section
```