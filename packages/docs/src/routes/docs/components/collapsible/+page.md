# Collapsible

A toggleable panel that shows or hides content. Simpler than Accordion — a single expand/collapse toggle.

## Install

```bash
npx @intinyagroup/cli add collapsible
```

## Usage

```svelte
<script>
  import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
</script>

<Collapsible>
  <CollapsibleTrigger>
    <Button variant="outline">Toggle</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <p class="text-sm text-muted-foreground">
      This content can be collapsed and expanded.
    </p>
  </CollapsibleContent>
</Collapsible>
```

## Structure

- `Collapsible` — root wrapper
- `CollapsibleTrigger` — toggles the content
- `CollapsibleContent` — the collapsible panel

## Props

| Sub-component | Description |
|---------------|-------------|
| `Collapsible` | Root — accepts `open` (bindable) and `disabled` |
| `CollapsibleTrigger` | Toggle button |
| `CollapsibleContent` | Content panel with enter/exit animation |
