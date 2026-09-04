# CTASection

A call-to-action banner with multiple style variants — for prompting users to sign up, upgrade, or take action.

## Preview

```svelte
<script>
  import { CTASection } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
</script>

<CTASection variant="primary">
  <h2 class="text-2xl font-bold">Ready to get started?</h2>
  <p class="max-w-md text-[var(--ui-primary-foreground)]/80">Join thousands of developers building with Intinya UI.</p>
  <Button variant="secondary" size="lg">Get started free</Button>
</CTASection>
```

## Variants

| `variant` | Description |
|-----------|-------------|
| `primary` | Filled with primary color, white text |
| `outline` | Bordered, card-style |
| `muted` | Subtle muted background |

## Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'primary' \| 'outline' \| 'muted'` | `'primary'` |
| `class` | `string` | — |

## Install

```bash
npx @intinyagroup/cli add cta-section
```
