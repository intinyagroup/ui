# Input

A text field for user input.

## Preview

```svelte
<script>
  import { Input } from '@intinyagroup/ui';
  import { Label } from '@intinyagroup/ui';
</script>

<div class="flex w-72 flex-col gap-2">
  <Label for="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

## Disabled

```svelte
<Input disabled value="Read only" />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `type` | `string` | `'text'` |
| `placeholder` | `string` | — |
| `value` | `string` | `''` |
| `disabled` | `boolean` | `false` |
| `class` | `string` | — |

All other props forward to the `<input>` element.

## Install

```bash
npx @intinyagroup/cli add input
```
