# Navbar

A sticky responsive navigation bar with a mobile hamburger menu. Compose using `brand` and `links` snippets.

## Preview

```svelte
<script>
  import { Navbar } from '@intinyagroup/ui';
</script>

<Navbar>
  {#snippet brand()}<a href="/" class="font-bold">Acme</a>{/snippet}
  {#snippet links()}
    <a href="/features" class="rounded-md px-3 py-1.5 text-sm hover:bg-[var(--ui-muted)]">Features</a>
    <a href="/pricing" class="rounded-md px-3 py-1.5 text-sm hover:bg-[var(--ui-muted)]">Pricing</a>
    <a href="/docs" class="rounded-md px-3 py-1.5 text-sm hover:bg-[var(--ui-muted)]">Docs</a>
  {/snippet}
</Navbar>
```

## How it works

- **Desktop** (`md+`): links snippet shown inline, hamburger hidden
- **Mobile**: hamburger toggles a dropdown with the `children` slot

## Props

| Prop | Type | Default |
|------|------|---------|
| `brand` | `Snippet` | — |
| `links` | `Snippet` | — |
| `children` | `Snippet` | — (mobile menu body) |
| `class` | `string` | — |

## Install

```bash
npx @intinyagroup/cli add navbar
```
