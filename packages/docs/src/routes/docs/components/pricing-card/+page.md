# PricingCard

A card for displaying pricing tiers with a featured variant for highlighting the recommended plan.

## Preview

```svelte
<script>
  import { PricingCard } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
  import { Check } from 'lucide-svelte';
</script>

<div class="grid max-w-4xl gap-6 md:grid-cols-3">
  <PricingCard>
    <h3 class="text-lg font-semibold">Starter</h3>
    <div class="text-3xl font-bold">$9<span class="text-sm font-normal text-[var(--ui-muted-foreground)]">/mo</span></div>
    <ul class="flex flex-col gap-2 text-sm text-[var(--ui-muted-foreground)]">
      <li class="flex items-center gap-2"><Check class="size-4 text-green-500" /> 1 project</li>
      <li class="flex items-center gap-2"><Check class="size-4 text-green-500" /> Basic support</li>
    </ul>
    <Button variant="outline" class="w-full">Choose plan</Button>
  </PricingCard>

  <PricingCard variant="featured">
    <h3 class="text-lg font-semibold">Pro</h3>
    <div class="text-3xl font-bold">$29<span class="text-sm font-normal text-[var(--ui-muted-foreground)]">/mo</span></div>
    <ul class="flex flex-col gap-2 text-sm text-[var(--ui-muted-foreground)]">
      <li class="flex items-center gap-2"><Check class="size-4 text-green-500" /> Unlimited projects</li>
      <li class="flex items-center gap-2"><Check class="size-4 text-green-500" /> Priority support</li>
      <li class="flex items-center gap-2"><Check class="size-4 text-green-500" /> Custom domains</li>
    </ul>
    <Button class="w-full">Choose plan</Button>
  </PricingCard>

  <PricingCard>
    <h3 class="text-lg font-semibold">Enterprise</h3>
    <div class="text-3xl font-bold">$99<span class="text-sm font-normal text-[var(--ui-muted-foreground)]">/mo</span></div>
    <ul class="flex flex-col gap-2 text-sm text-[var(--ui-muted-foreground)]">
      <li class="flex items-center gap-2"><Check class="size-4 text-green-500" /> Everything in Pro</li>
      <li class="flex items-center gap-2"><Check class="size-4 text-green-500" /> SSO / SAML</li>
    </ul>
    <Button variant="outline" class="w-full">Contact sales</Button>
  </PricingCard>
</div>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'default' \| 'featured'` | `'default'` |
| `class` | `string` | — |

## Install

```bash
npx @intinyagroup/cli add pricing-card
```
