---
title: User Profile Card
description: Rich profile card with cover, avatar, role, bio, stats row, social links, and a contact button.
---

# User Profile Card

A complete profile card: optional cover image, overlapping avatar (or initials fallback), name, role, bio, a three-column stats row, social links, and an optional contact button.

## Usage

```svelte
<script>
  import { UserProfileCard } from '@intinyagroup/ui';

  const stats = [
    { label: 'Posts', value: 128 },
    { label: 'Followers', value: '12.4k' },
    { label: 'Following', value: 231 }
  ];

  const socials = [
    { icon: '𝕏', href: 'https://x.com/user' },
    { icon: 'in', href: 'https://linkedin.com/in/user', label: 'LinkedIn' }
  ];
</script>

<UserProfileCard
  name="Ada Lovelace"
  role="Analytical Engine Programmer"
  bio="First programmer. Writing notes on computing."
  avatar="https://github.com/shadcn.png"
  cover="/cover.jpg"
  {stats}
  {socials}
  onContact={() => console.log('contact')}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Profile name |
| `avatar` | `string` | — | Avatar image URL; initials fallback when omitted |
| `role` | `string` | — | Role or headline |
| `bio` | `string` | — | Short bio |
| `stats` | `ProfileStat[]` | `[]` | Stats row items |
| `socials` | `ProfileSocial[]` | `[]` | Social link buttons |
| `cover` | `string` | — | Cover image URL; muted placeholder otherwise |
| `contactLabel` | `string` | `'Contact'` | Contact button label |
| `onContact` | `() => void` | — | Shows the contact button when provided |
| `class` | `string` | — | Additional CSS classes |

### ProfileStat

```ts
{
  label: string;
  value: string | number;
}
```

### ProfileSocial

```ts
{
  icon: string;
  href: string;
  label?: string;
}
```

## Features

- Initials fallback avatar when no image is provided.
- Three-column stats row with dividers.
- Social links open in a new tab with `rel="noreferrer"` and accessible labels.
- Contact button appears only when `onContact` is set.