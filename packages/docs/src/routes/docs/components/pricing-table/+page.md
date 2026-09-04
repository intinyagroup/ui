---
title: Pricing Table
description: Multi-tier pricing comparison table.
---

# Pricing Table

Displays multiple pricing tiers side-by-side for easy comparison.

## Install

```bash
npx @intinyagroup/cli add pricing-table
```

## Usage

```svelte
<script>
  import { PricingTable } from '@intinyagroup/ui';

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: ['1 project', '1 GB storage', 'Community support'],
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      features: ['Unlimited projects', '100 GB storage', 'Priority support'],
      featured: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      features: ['Everything in Pro', 'Custom domain', 'SLA guarantee'],
    },
  ];
</script>

<PricingTable {tiers} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| tiers | PricingTier[] | [] | Array of pricing tier objects |
| columns | number | 3 | Number of visible columns |
| class | string | - | Additional CSS classes |

## Tier Properties

| Property | Type | Description |
|----------|------|-------------|
| name | string | Tier name |
| price | string | Price display text |
| period | string | Billing period label |
| features | string[] | List of included features |
| featured | boolean | Highlight this tier |
| cta | string | Call-to-action button text |

## Notes

- `featured` tier is visually emphasized (e.g. border, scale).
- Responsive: stacks vertically on small screens.
