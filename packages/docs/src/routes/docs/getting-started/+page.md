# Getting Started

Intinya UI is a Svelte 5 component library with 100+ components, 9 themes, and a CLI installer.

## Installation

### Option A — npm package (recommended)

```bash
npm install @intinyagroup/ui @intinyagroup/tokens
```

### Option B — CLI copy (shadcn model)

```bash
npx @intinyagroup/cli add button card dialog
```

The CLI copies components into your project and rewrites imports automatically.

### Option C — CLI npm mode

```bash
npx @intinyagroup/cli add button --mode npm
```

Adds `@intinyagroup/ui` + deps to package.json and prints import snippets (no file copy).

## Import Tokens

In your root layout:

```svelte
<script>
  import '@intinyagroup/tokens/base.css';
</script>
```

Or choose a theme:

```css
@import '@intinyagroup/tokens/md3.css';
@import '@intinyagroup/tokens/flat.css';
@import '@intinyagroup/tokens/cyberpunk.css';
```

Set a theme on your root element:

```html
<html data-ui-theme="neutral">
```

## Use a component

```svelte
<script>
  import { Button, Card } from '@intinyagroup/ui';
</script>

<Card>
  <h2>Hello World</h2>
  <Button>Click me</Button>
</Card>
```

## MD3 components

```svelte
<script>
  import { FAB, Chip, Snackbar } from '@intinyagroup/md3';
</script>

<FAB onclick={() => alert('Clicked!')}>+</FAB>
```

## Flat geometric components

```svelte
<script>
  import { HexagonGrid, OctagonCard, DiamondBadge } from '@intinyagroup/flat';
</script>

<HexagonGrid columns={3}>
  <OctagonCard color="blue" title="Feature 1" />
</HexagonGrid>
```

## Mobile components

Touch-optimized, safe-area aware, no hover-dependent features:

```svelte
<script>
  import { TabBar, PullToRefresh, ListView, ActionSheet } from '@intinyagroup/ui';
</script>

<TabBar bind:value={tab}>
  <TabBarItem value="home" label="Home" />
  <TabBarItem value="cart" label="Cart" badge={3} />
</TabBar>
```

## Native device features

```ts
import { getDeviceInfo, takePhoto, localNotify } from '@intinyagroup/native';

const info = await getDeviceInfo();
await localNotify('Hello', 'Body text');
```

## CLI commands

```bash
npx @intinyagroup/cli init           # Setup project
npx @intinyagroup/cli add button     # Copy component
npx @intinyagroup/cli update         # Update components
npx @intinyagroup/cli doctor         # Check setup
npx @intinyagroup/cli list           # Browse by category
```

## Next steps

- [Components](/docs/components) — Browse all 100+ components
- [Themes](/docs/themes) — Explore 9 theme directions
