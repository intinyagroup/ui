# Avatar

A circular user image with fallback, status badge, and group support. Built on bits-ui avatar primitives.

## Preview

```svelte
<script>
  import { Avatar, AvatarImage, AvatarFallback } from '@intinyagroup/ui';
</script>

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

## Sizes

```svelte
<script>
  import { Avatar, AvatarImage, AvatarFallback } from '@intinyagroup/ui';
</script>

<div class="flex items-center gap-4">
  <Avatar size="sm">
    <AvatarImage src="https://github.com/shadcn.png" alt="Small" />
    <AvatarFallback>S</AvatarFallback>
  </Avatar>
  <Avatar size="default">
    <AvatarImage src="https://github.com/shadcn.png" alt="Default" />
    <AvatarFallback>D</AvatarFallback>
  </Avatar>
  <Avatar size="lg">
    <AvatarImage src="https://github.com/shadcn.png" alt="Large" />
    <AvatarFallback>L</AvatarFallback>
  </Avatar>
</div>
```

## Group

```svelte
<script>
  import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from '@intinyagroup/ui';
</script>

<AvatarGroup>
  <Avatar size="sm">
    <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
    <AvatarFallback>U1</AvatarFallback>
  </Avatar>
  <Avatar size="sm">
    <AvatarImage src="https://github.com/leerob.png" alt="User 2" />
    <AvatarFallback>U2</AvatarFallback>
  </Avatar>
  <Avatar size="sm">
    <AvatarImage src="https://github.com/evilrabbit.png" alt="User 3" />
    <AvatarFallback>U3</AvatarFallback>
  </Avatar>
</AvatarGroup>
```

## Status Badge

```svelte
<script>
  import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from '@intinyagroup/ui';
</script>

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="Online user" />
  <AvatarFallback>ON</AvatarFallback>
  <AvatarBadge />
</Avatar>
```

## Structure

- `Avatar` — root container (circular, handles loading status)
- `AvatarImage` — the user image
- `AvatarFallback` — shown when image fails to load or is loading
- `AvatarGroup` — stacks avatars with overlapping rings
- `AvatarBadge` — small status indicator positioned at bottom-right

## Props

### Avatar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Avatar size |
| `loadingStatus` | `string` | `'loading'` | Bindable loading status |
| `class` | `string` | — | Additional classes |

### AvatarImage

Forwards all props to the underlying `<img>` element.

### AvatarFallback

Renders when the image is not yet loaded or fails. Accepts `class` and children.

## Accessibility

- `alt` text on `AvatarImage` provides screen reader context.
- Falls back to initials when image is unavailable.
- `AvatarGroup` uses `aria-label` for the container.
- Status badge is decorative — marked `aria-hidden` when no semantic meaning.

## Install

```bash
npx @intinyagroup/cli add avatar
```
