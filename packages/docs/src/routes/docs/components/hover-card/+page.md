# Hover Card

A popup that shows on hover with rich content (e.g., user profile preview). Built on bits-ui hover card primitives.

## Install

```bash
npx @intinyagroup/cli add hover-card
```

## Usage

```svelte
<script>
  import { HoverCard, HoverCardContent, HoverCardTrigger } from '@intinyagroup/ui';
</script>

<HoverCard>
  <HoverCardTrigger href="https://github.com">
    @github
  </HoverCardTrigger>
  <HoverCardContent class="w-80">
    <div class="flex justify-between space-x-4">
      <div>
        <h4 class="text-sm font-semibold">GitHub</h4>
        <p class="text-sm text-muted-foreground">
          Build software on a massive, scalable platform.
        </p>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>
```

## Structure

- `HoverCard` — root wrapper
- `HoverCardTrigger` — the element that triggers the popup on hover
- `HoverCardContent` — the popup panel

## Props

| Sub-component | Description |
|---------------|-------------|
| `HoverCard` | Root — accepts `openDelay` and `closeDelay` (ms) |
| `HoverCardContent` | Accepts `align` (`'start' \| 'center' \| 'end'`), `sideOffset`, `side` |
| `HoverCardTrigger` | The trigger element |
