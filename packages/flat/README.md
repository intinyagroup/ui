# @intinyagroup/flat

[![npm version](https://img.shields.io/npm/v/@intinyagroup/flat?style=flat-square&color=7c3aed)](https://www.npmjs.com/package/@intinyagroup/flat)
[![Docs](https://img.shields.io/badge/docs-ui.intinya.id-7c3aed?style=flat-square&labelColor=1a1a1a)](https://ui.intinya.id)
[![License MIT](https://img.shields.io/npm/l/@intinyagroup/flat?style=flat-square&color=7c3aed)](https://github.com/intinyagroup/ui/blob/main/LICENSE)


Flat color geometric components with clip-path shapes for Intinya UI — BlobCard, HexagonGrid, DiamondBadge, WaveSection, PentagonStat, StarCard, TriangleAlert, CircleAvatar.

## Install

```bash
npm install @intinyagroup/flat
```

## Usage

```svelte
<script>
  import { HexagonGrid, BlobCard, PentagonStat } from '@intinyagroup/flat';
</script>

<HexagonGrid>
  <BlobCard>Organic shape</BlobCard>
</HexagonGrid>
<PentagonStat value={42} label="tasks" />
```

Pair with the flat theme for the full look:

```css
@import "@intinyagroup/tokens/flat.css";
```

## License

MIT
