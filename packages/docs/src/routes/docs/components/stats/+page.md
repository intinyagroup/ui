# Stats

A row of key metrics displayed as large numbers with labels. Perfect for hero sections or "trusted by" social proof.

## Preview

```svelte
<script>
  import { Stats } from '@intinyagroup/ui';
</script>

<Stats
  stats={[
    { value: '10K+', label: 'Developers' },
    { value: '50+', label: 'Components' },
    { value: '99%', label: 'Uptime' },
    { value: '4.9', label: 'Rating' }
  ]}
/>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `stats` | `{ value: string; label: string }[]` | **required** |
| `class` | `string` | — |

## Install

```bash
npx @intinyagroup/cli add stats
```
