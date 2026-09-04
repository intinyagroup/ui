# Card

A flexible content container with header, title, description, content, and footer sections.

## Preview

```svelte
<script>
  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@intinyagroup/ui';
  import { Button } from '@intinyagroup/ui';
</script>

<Card class="w-80">
  <CardHeader>
    <CardTitle>Project Card</CardTitle>
    <CardDescription>Description of the project</CardDescription>
  </CardHeader>
  <CardContent>
    <p>This is the card body content.</p>
  </CardContent>
  <CardFooter class="flex justify-end gap-2">
    <Button variant="outline" size="sm">Cancel</Button>
    <Button size="sm">Save</Button>
  </CardFooter>
</Card>
```

## Structure

A card composes five sub-components:

- `Card` — the container
- `CardHeader` — header region (title + description)
- `CardTitle` — the heading
- `CardDescription` — supporting text
- `CardContent` — main body
- `CardFooter` — action area

## Props

All sub-components accept `class` and forward all other props to their underlying element.

| Sub-component | Renders |
|---------------|---------|
| `Card` | `<div>` |
| `CardHeader` | `<div>` |
| `CardTitle` | `<h3>` |
| `CardDescription` | `<p>` |
| `CardContent` | `<div>` |
| `CardFooter` | `<div>` |

## Install

```bash
npx @intinyagroup/cli add card
```
