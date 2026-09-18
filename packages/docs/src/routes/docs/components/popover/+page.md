# Popover

A floating panel triggered by a button click. Built on bits-ui popover primitives.

## Preview

```svelte
<script>
  import { Popover, PopoverTrigger, PopoverContent } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
</script>

<Popover>
  <PopoverTrigger><Button variant="outline">Open popover</Button></PopoverTrigger>
  <PopoverContent class="w-80">
    <div class="grid gap-4">
      <div class="space-y-2">
        <h4 class="font-medium leading-none">Dimensions</h4>
        <p class="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
      </div>
    </div>
  </PopoverContent>
</Popover>
```

## With Form

```svelte
<script>
  import { Popover, PopoverTrigger, PopoverContent } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
  import { Input } from '@intinyagroup/ui';
  import { Label } from '@intinyagroup/ui';
</script>

<Popover>
  <PopoverTrigger><Button variant="outline">Settings</Button></PopoverTrigger>
  <PopoverContent class="w-80">
    <div class="grid gap-4">
      <div class="space-y-2">
        <h4 class="font-medium leading-none">Width</h4>
        <p class="text-sm text-muted-foreground">Adjust the width.</p>
      </div>
      <div class="grid gap-2">
        <div class="grid grid-cols-3 items-center gap-4">
          <Label for="width">Width</Label>
          <Input id="width" value="100%" class="col-span-2 h-8" />
        </div>
      </div>
    </div>
  </PopoverContent>
</Popover>
```

## Structure

- `Popover` — root (manages open state, bindable `open` prop)
- `PopoverTrigger` — the element that opens the popover
- `PopoverContent` — the floating panel (rendered in a portal)
- `PopoverHeader` — header region
- `PopoverTitle` — heading inside the popover
- `PopoverDescription` — description text
- `PopoverClose` — closes the popover

## Props

### Popover

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Open state (bindable) |

### PopoverContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sideOffset` | `number` | `4` | Distance from trigger (px) |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment relative to trigger |
| `class` | `string` | — | Additional classes |

## Accessibility

- Trigger uses `aria-haspopup="true"` and `aria-expanded` to indicate state.
- Focus is trapped inside the popover when open.
- Closes on `Escape` key press.
- Closes on outside click.
- `role="dialog"` with `aria-labelledby` and `aria-describedby`.
- Focus returns to trigger when closed.

## Install

```bash
npx @intinyagroup/cli add popover
```
