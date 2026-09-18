# Timeline

A vertical timeline for displaying chronological events or steps.

## Install

```bash
npx @intinyagroup/cli add timeline
```

## Usage

```svelte
<script>
  import { Timeline, TimelineItem, TimelineDot } from '@intinyagroup/ui';
</script>

<Timeline>
  <TimelineItem>
    <TimelineDot />
    <div>
      <h3 class="font-medium">Step 1</h3>
      <p class="text-sm text-muted-foreground">Account created successfully.</p>
    </div>
  </TimelineItem>
  <TimelineItem>
    <TimelineDot />
    <div>
      <h3 class="font-medium">Step 2</h3>
      <p class="text-sm text-muted-foreground">Email verified.</p>
    </div>
  </TimelineItem>
  <TimelineItem>
    <TimelineDot />
    <div>
      <h3 class="font-medium">Step 3</h3>
      <p class="text-sm text-muted-foreground">Profile completed.</p>
    </div>
  </TimelineItem>
</Timeline>
```

## Structure

- `Timeline` — root wrapper (vertical list with connecting line)
- `TimelineItem` — a single timeline entry
- `TimelineDot` — the circle indicator on the timeline line

## Props

| Sub-component | Description |
|---------------|-------------|
| `Timeline` | Root — vertical list with connecting line between items |
| `TimelineItem` | Single entry — accepts `class` |
| `TimelineDot` | Circle indicator — accepts `class` |
