# Footer

A page footer with top border and padding. Compose with your own grid of links.

## Preview

```svelte
<script>
  import { Footer } from '@intinyagroup/ui';
</script>

<Footer class="mx-auto max-w-6xl">
  <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
    <div>
      <h4 class="mb-3 font-semibold">Product</h4>
      <ul class="flex flex-col gap-1.5 text-sm text-[var(--ui-muted-foreground)]">
        <li><a href="#">Features</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Changelog</a></li>
      </ul>
    </div>
    <div>
      <h4 class="mb-3 font-semibold">Company</h4>
      <ul class="flex flex-col gap-1.5 text-sm text-[var(--ui-muted-foreground)]">
        <li><a href="#">About</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Careers</a></li>
      </ul>
    </div>
    <div>
      <h4 class="mb-3 font-semibold">Docs</h4>
      <ul class="flex flex-col gap-1.5 text-sm text-[var(--ui-muted-foreground)]">
        <li><a href="#">Getting Started</a></li>
        <li><a href="#">Components</a></li>
      </ul>
    </div>
    <div>
      <h4 class="mb-3 font-semibold">Legal</h4>
      <ul class="flex flex-col gap-1.5 text-sm text-[var(--ui-muted-foreground)]">
        <li><a href="#">Privacy</a></li>
        <li><a href="#">Terms</a></li>
      </ul>
    </div>
  </div>
  <div class="mt-8 border-t border-[var(--ui-border)] pt-6 text-center text-sm text-[var(--ui-muted-foreground)]">
    &copy; 2026 Intinya Digital Asia
  </div>
</Footer>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | — |

## Install

```bash
npx @intinyagroup/cli add footer
```
