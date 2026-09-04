# Testimonial

A blockquote card for customer testimonials and reviews.

## Preview

```svelte
<script>
  import { Testimonial } from '@intinyagroup/ui';
  import { Avatar, AvatarFallback, AvatarImage } from '@intinyagroup/ui';
</script>

<Testimonial class="max-w-md">
  <p class="text-[var(--ui-foreground)] italic">"Intinya UI saved our team weeks of development time. The components are production-ready and beautifully designed."</p>
  <div class="flex items-center gap-3 mt-4">
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
    <div>
      <div class="font-medium text-sm">Jane Doe</div>
      <div class="text-xs text-[var(--ui-muted-foreground)]">CTO, Acme Corp</div>
    </div>
  </div>
</Testimonial>
```

## Structure

Use `Testimonial` as an `<blockquote>` wrapper. Compose with your own inner content — avatar, name, role, and quote text.

## Props

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | — |

## Install

```bash
npx @intinyagroup/cli add testimonial
```
