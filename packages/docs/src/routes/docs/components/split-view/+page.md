# Split View

A resizable split-pane layout with a draggable (and keyboard-operable) separator. Panels are provided via `first`/`second` snippets; the first panel's size is controlled as a percentage.

## Usage

```svelte
<script>
  import { SplitView } from '@intinyagroup/ui';
</script>

<SplitView class="h-96">
  {#snippet first()}
    <div class="p-4">Left panel</div>
  {/snippet}
  {#snippet second()}
    <div class="p-4">Right panel</div>
  {/snippet}
</SplitView>
```

## Options

```svelte
<!-- Vertical split (top/bottom), first panel starts at 60% -->
<SplitView direction="vertical" defaultSize={60} minSize={30} maxSize={70} class="h-96">
  {#snippet first()}<div class="p-4">Top</div>{/snippet}
  {#snippet second()}<div class="p-4">Bottom</div>{/snippet}
</SplitView>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Split orientation (left/right or top/bottom) |
| `defaultSize` | `number` | `50` | Initial size of the first panel, in percent |
| `minSize` | `number` | `20` | Minimum first-panel size, in percent |
| `maxSize` | `number` | `80` | Maximum first-panel size, in percent |
| `first` | `Snippet` | — | First panel content |
| `second` | `Snippet` | — | Second panel content |
| `children` | `Snippet` | — | Fallback content when `first`/`second` aren't provided |
| `class` | `string` | — | Additional classes |

Sizes are percentages of the container. Give the `SplitView` a fixed height (`class="h-96"`) since it doesn't reserve one itself.

## Keyboard navigation

Focus the separator, then:

| Key | Action |
|-----|--------|
| `ArrowLeft` / `ArrowUp` | Shrink the first panel by 5% |
| `ArrowRight` / `ArrowDown` | Grow the first panel by 5% |
| `Home` | Snap to `minSize` |
| `End` | Snap to `maxSize` |

## Features

- Drag-to-resize with pointer capture and touch support
- Full keyboard accessibility (`role="separator"`, arrows, Home/End)
- Percentage-based sizing clamped to `min`/`max`
- Optional fallback `children` when no panels are given

## Install

```bash
npx @intinyagroup/cli add split-view
```