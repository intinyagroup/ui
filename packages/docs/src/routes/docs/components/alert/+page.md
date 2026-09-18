# Alert

A message box for feedback — success, info, warning, or error.

## Preview

```svelte
<script>
  import { Alert, AlertTitle, AlertDescription } from '@intinyagroup/ui';
</script>

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>You can add content to the alert.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'default' \| 'destructive'` | `'default'` |
| `class` | `string` | — |

## Install

```bash
npx @intinyagroup/cli add alert
```
