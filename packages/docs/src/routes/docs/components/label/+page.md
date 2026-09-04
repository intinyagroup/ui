# Label

A form label that associates with inputs for accessibility. Built on bits-ui label primitive.

## Preview

```svelte
<script>
  import { Label } from '@intinyagroup/ui';
  import { Input } from '@intinyagroup/ui';
</script>

<div class="flex w-72 flex-col gap-2">
  <Label for="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

## With Checkbox

```svelte
<script>
  import { Label } from '@intinyagroup/ui';
  import { Checkbox } from '@intinyagroup/ui';
</script>

<div class="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms and conditions</Label>
</div>
```

## Disabled State

```svelte
<script>
  import { Label } from '@intinyagroup/ui';
  import { Input } from '@intinyagroup/ui';
</script>

<div class="flex w-72 flex-col gap-2">
  <Label for="disabled-input">Disabled</Label>
  <Input id="disabled-input" disabled value="Read only" />
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` | `string` | — | ID of the associated form control |
| `class` | `string` | — | Additional classes |

All other props are forwarded to the underlying `<label>` element.

## Accessibility

- Renders a `<label>` element that associates with form controls via `for` attribute.
- Automatically reduces opacity when the associated input is disabled (`peer-disabled:opacity-50`).
- Uses `select-none` to prevent accidental text selection when clicking.
- `font-medium` provides visual weight for form readability.
- Supports `group-data-[disabled=true]` for group-level disabled states.

## Install

```bash
npx @intinyagroup/cli add label
```
