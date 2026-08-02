# @intinyagroup/ui

Shared UI component library for intinyagroup projects.

## Installation

```bash
npm install @intinyagroup/ui
```

## Setup

Import the base tokens in your app's CSS:

```css
@import "@intinyagroup/ui/tokens";
```

Set a theme on your root element:

```html
<html data-ui-theme="warm">
```

Available themes: `neutral` (default), `warm`, `dark`.

## Usage

```svelte
<script>
  import { Button, Card, CardHeader, CardTitle, CardContent } from '@intinyagroup/ui';
</script>

<Card>
  <CardHeader>
    <CardTitle>Hello World</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="primary">Click me</Button>
  </CardContent>
</Card>
```

## Theming

Override CSS custom properties in your project:

```css
:root {
  --ui-primary: oklch(0.216 0.006 56.043);
  --ui-accent: oklch(0.553 0.013 58.071);
  --ui-radius: 0.625rem;
}
```

## Development

```bash
npm install
npm run dev      # Start dev server
npm run build    # Build library
npm run check    # Type check
npm run release  # Publish
```

## Versioning

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

```bash
npx changeset      # Add a changeset
npx changeset version  # Bump versions
npx changeset publish  # Publish to npm
```

## License

MIT
