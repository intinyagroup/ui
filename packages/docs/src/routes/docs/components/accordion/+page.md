# Accordion

Collapsible content sections with smooth expand/collapse animation.

## Preview

```svelte
<script>
  import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@intinyagroup/ui';
</script>

<Accordion type="single" collapsible class="w-80">
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. Built on bits-ui, which follows WAI-ARIA.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it styled?</AccordionTrigger>
    <AccordionContent>Yes. Fully themed with design tokens.</AccordionContent>
  </AccordionItem>
</Accordion>
```

## Props

| Sub-component | Description |
|---------------|-------------|
| `Accordion` | Root — `type="single" \| "multiple"`, `collapsible` |
| `AccordionItem` | One collapsible section (requires `value`) |
| `AccordionTrigger` | The visible button |
| `AccordionContent` | The collapsible panel |

## Install

```bash
npx @intinyagroup/cli add accordion
```
