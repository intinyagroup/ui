# Textarea

A multi-line text input field with consistent styling and validation support.

## Preview

```svelte
<script>
  import { Textarea } from '@intinyagroup/ui';
  import { Label } from '@intinyagroup/ui';
</script>

<div class="grid w-full gap-1.5">
  <Label for="message">Your message</Label>
  <Textarea placeholder="Type your message here." id="message" />
</div>
```

## With Helper Text

```svelte
<script>
  import { Textarea } from '@intinyagroup/ui';
  import { Label } from '@intinyagroup/ui';
</script>

<div class="grid w-full gap-1.5">
  <Label for="bio">Bio</Label>
  <Textarea placeholder="Tell us a bit about yourself." id="bio" />
  <p class="text-sm text-muted-foreground">Max 280 characters.</p>
</div>
```

## Disabled

```svelte
<Textarea disabled placeholder="This textarea is disabled." />
```

## With Error

```svelte
<script>
  import { Textarea } from '@intinyagroup/ui';
</script>

<Textarea aria-invalid="true" placeholder="Enter valid text" />
```

## Auto-resizing

```svelte
<script>
  import { Textarea } from '@intinyagroup/ui';
</script>

<Textarea placeholder="This textarea auto-resizes to content." style="field-sizing: content;" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Text content (bindable) |
| `placeholder` | `string` | — | Placeholder text |
| `disabled` | `boolean` | `false` | Disables the textarea |
| `rows` | `number` | `undefined` | Visible number of rows |
| `class` | `string` | — | Additional classes |

All other props are forwarded to the underlying `<textarea>` element.

## Accessibility

- Uses native `<textarea>` for full screen reader support.
- Visible focus ring with `focus-visible:ring-ring`.
- `aria-invalid` styles applied for validation error states.
- Disabled state uses `disabled:cursor-not-allowed` and reduced opacity.
- Supports `aria-describedby` for helper text association.

## Install

```bash
npx @intinyagroup/cli add textarea
```
