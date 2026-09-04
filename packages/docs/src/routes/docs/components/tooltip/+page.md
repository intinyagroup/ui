# Tooltip

A small popup that appears on hover or focus to show additional information. Built on bits-ui tooltip primitives.

## Preview

```svelte
<script>
  import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
</script>

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Add to library</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Sides

```svelte
<script>
  import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
</script>

<TooltipProvider>
  <div class="flex gap-4">
    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline" size="sm">Top</Button>
      </TooltipTrigger>
      <TooltipContent side="top">Top tooltip</TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline" size="sm">Right</Button>
      </TooltipTrigger>
      <TooltipContent side="right">Right tooltip</TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline" size="sm">Bottom</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline" size="sm">Left</Button>
      </TooltipTrigger>
      <TooltipContent side="left">Left tooltip</TooltipContent>
    </Tooltip>
  </div>
</TooltipProvider>
```

## With Keyboard Shortcut

```svelte
<script>
  import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
  import { Kbd } from '@intinyagroup/ui';
</script>

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <Button variant="outline" size="sm">Copy</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Copy to clipboard <Kbd>⌘C</Kbd></p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Structure

- `TooltipProvider` — wraps tooltip group, controls delay and duration
- `Tooltip` — root (manages open state)
- `TooltipTrigger` — the element that triggers the tooltip
- `TooltipContent` — the floating popup

## Props

### TooltipProvider

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `delayDuration` | `number` | `700` | Delay before showing (ms) |
| `skipDelayDuration` | `number` | `300` | Delay to skip when moving between tooltips |

### TooltipContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Popup position |
| `sideOffset` | `number` | `0` | Distance from trigger (px) |
| `class` | `string` | — | Additional classes |

## Accessibility

- Trigger is focusable — tooltip appears on `Focus` and disappears on `Blur`.
- Escape key closes the tooltip.
- `role="tooltip"` with `aria-describedby` linking trigger to content.
- Delay prevents accidental tooltip flashing during navigation.
- Arrow pointer connects tooltip visually to trigger.

## Install

```bash
npx @intinyagroup/cli add tooltip
```
