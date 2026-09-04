# @intinyagroup/md3

[![npm version](https://img.shields.io/npm/v/@intinyagroup/md3?style=flat-square&color=7c3aed)](https://www.npmjs.com/package/@intinyagroup/md3)
[![Docs](https://img.shields.io/badge/docs-ui.intinya.id-7c3aed?style=flat-square&labelColor=1a1a1a)](https://ui.intinya.id)
[![License MIT](https://img.shields.io/npm/l/@intinyagroup/md3?style=flat-square&color=7c3aed)](https://github.com/intinyagroup/ui/blob/main/LICENSE)


Material Design 3 components for Intinya UI — FAB, Chip, Snackbar, BottomSheet, TopAppBar, NavigationRail, NavigationBar, SearchBar, Ripple, Badge, and more. Self-contained components styled by the MD3 token theme.

## Install

```bash
npm install @intinyagroup/md3
```

## Usage

```svelte
<script>
  import { FAB, Chip, Snackbar } from '@intinyagroup/md3';
</script>

<FAB variant="tertiary">+</FAB>
<Chip type="filter" selected>Filter</Chip>
```

Import the MD3 theme to match the Material look:

```css
@import "@intinyagroup/tokens/md3.css";
```

## License

MIT
