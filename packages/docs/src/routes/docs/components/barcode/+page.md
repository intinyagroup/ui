# Barcode

Renders a 1D barcode as inline SVG using JsBarcode. Supports Code128, EAN-13, and UPC-A formats, with configurable dimensions and an optional human-readable value.

## Usage

```svelte
<script>
  import { Barcode } from '@intinyagroup/ui';
</script>

<Barcode value="INTINYA-2026" />
```

## Options

```svelte
<!-- EAN-13 product barcode, taller bars, no text -->
<Barcode value="4006381333931" format="ean13" height={120} width={3} displayValue={false} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | The value to encode (required) |
| `format` | `'code128' \| 'ean13' \| 'upc'` | `'code128'` | Barcode symbology |
| `height` | `number` | `80` | Bar height in pixels |
| `width` | `number` | `2` | Bar width in pixels |
| `displayValue` | `boolean` | `true` | Show the human-readable value under the bars |
| `class` | `string` | — | Additional classes |

The barcode is generated as an inline SVG with a 4px margin. Invalid values are caught and logged instead of breaking the render.

## Features

- Zero-dependency rendering (JsBarcode → inline SVG)
- Three common symbologies: Code128, EAN-13, UPC
- Re-renders automatically when `value` or options change

## Install

```bash
npx @intinyagroup/cli add barcode
```
