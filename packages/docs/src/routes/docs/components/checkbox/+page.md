# Checkbox

A toggleable checkbox with checked and indeterminate states. Built on bits-ui checkbox primitives.

## Preview

```svelte
<script>
  import { Checkbox } from '@intinyagroup/ui';
  import { Label } from '@intinyagroup/ui';
</script>

<div class="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms and conditions</Label>
</div>
```

## States

```svelte
<script>
  import { Checkbox } from '@intinyagroup/ui';
</script>

<div class="flex items-center gap-4">
  <!-- Checked -->
  <Checkbox checked />
  <!-- Indeterminate -->
  <Checkbox indeterminate />
  <!-- Disabled -->
  <Checkbox disabled />
  <!-- Disabled checked -->
  <Checkbox checked disabled />
</div>
```

## With Label

```svelte
<script>
  import { Checkbox } from '@intinyagroup/ui';
  import { Label } from '@intinyagroup/ui';
</script>

<div class="flex flex-col gap-3">
  <div class="flex items-center gap-2">
    <Checkbox id="marketing" />
    <Label for="marketing">Marketing emails</Label>
  </div>
  <div class="flex items-center gap-2">
    <Checkbox id="social" checked />
    <Label for="social">Social notifications</Label>
  </div>
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Checked state (bindable) |
| `indeterminate` | `boolean` | `false` | Indeterminate state (bindable) |
| `disabled` | `boolean` | `false` | Disables the checkbox |
| `required` | `boolean` | `false` | Marks as required for form validation |
| `class` | `string` | — | Additional classes |

All other props are forwarded to the underlying element.

## Accessibility

- Renders a native checkbox input for full screen reader support.
- Shows a check icon when checked, a minus icon when indeterminate.
- Supports keyboard navigation: `Space` to toggle.
- Visible focus ring with `focus-visible:ring-ring`.
- `aria-invalid` styles applied when used inside invalid form fields.

## Install

```bash
npx @intinyagroup/cli add checkbox
```
