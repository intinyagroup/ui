# Toast

Transient notifications with a lightweight store.

## Preview

```svelte
<script>
  import { Toast, toasts } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
</script>

<Button onclick={() => toasts.push({ title: 'Saved', description: 'Changes saved successfully' })}>
  Show toast
</Button>

<Toast />
```

## Usage

Push to the `toasts` store to show a notification:

```ts
toasts.push({
  title: 'Saved',
  description: 'Your changes were saved.',
  variant: 'default' // 'default' | 'destructive'
});
```

Render `<Toast />` once in your layout. It subscribes to the store and stacks notifications.

## API

| Export | Type |
|--------|------|
| `Toast` | Component |
| `toasts` | `Writable<ToastItem[]>` |
| `ToastType` | `{ title, description?, variant? }` |

## Install

```bash
npx @intinyagroup/cli add toast
```
