# Switch

A toggle switch for on/off states. Built on bits-ui switch primitives.

## Preview

```svelte
<script>
  import { Switch } from '@intinyagroup/ui';
  import { Label } from '@intinyagroup/ui';
</script>

<div class="flex items-center gap-2">
  <Switch id="airplane-mode" />
  <Label for="airplane-mode">Airplane Mode</Label>
</div>
```

## Sizes

```svelte
<script>
  import { Switch } from '@intinyagroup/ui';
</script>

<div class="flex items-center gap-4">
  <Switch size="sm" />
  <Switch size="default" />
</div>
```

## States

```svelte
<script>
  import { Switch } from '@intinyagroup/ui';
</script>

<div class="flex items-center gap-4">
  <!-- Default off -->
  <Switch />
  <!-- Checked on -->
  <Switch checked />
  <!-- Disabled -->
  <Switch disabled />
  <!-- Disabled checked -->
  <Switch checked disabled />
</div>
```

## With Label

```svelte
<script>
  import { Switch } from '@intinyagroup/ui';
  import { Label } from '@intinyagroup/ui';
</script>

<div class="flex flex-col gap-3">
  <div class="flex items-center gap-2">
    <Switch id="notifications" checked />
    <Label for="notifications">Push notifications</Label>
  </div>
  <div class="flex items-center gap-2">
    <Switch id="darkmode" />
    <Label for="darkmode">Dark mode</Label>
  </div>
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Switch state (bindable) |
| `size` | `'sm' \| 'default'` | `'default'` | Size variant |
| `disabled` | `boolean` | `false` | Disables the switch |
| `class` | `string` | — | Additional classes |

All other props are forwarded to the underlying element.

## Accessibility

- Renders a toggle button with `role="switch"` for screen readers.
- Supports keyboard navigation: `Space` to toggle.
- Visible focus ring with `focus-visible:ring-ring`.
- `aria-invalid` styles applied when used inside invalid form fields.
- Disabled state uses `data-disabled` attribute with reduced opacity and cursor.

## Install

```bash
npx @intinyagroup/cli add switch
```
