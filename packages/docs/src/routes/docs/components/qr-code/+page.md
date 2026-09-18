# QR Code

Renders a QR code as inline SVG using the [`qrcode`](https://github.com/soldair/node-qrcode) library. Supports configurable size, foreground/background colors, and error-correction levels.

## Usage

```svelte
<script>
  import { QRCode } from '@intinyagroup/ui';
</script>

<QRCode value="https://intinya.digital" />
```

## Options

```svelte
<QRCode
  value="https://intinya.digital"
  size={320}
  level="H"
  fgColor="#1a1a2e"
  bgColor="#f5f5f5"
  onReady={(svg) => console.log('rendered', svg.length, 'bytes of SVG')}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | The data to encode (required) |
| `size` | `number` | `200` | QR code size in pixels |
| `fgColor` | `string` | `'#000000'` | Foreground (module) color |
| `bgColor` | `string` | `'#ffffff'` | Background color |
| `level` | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'` | Error-correction level (L=7%, M=15%, Q=25%, H=30%) |
| `class` | `string` | — | Additional classes |
| `onReady` | `(svg: string) => void` | — | Called with the generated SVG markup |

The SVG is generated asynchronously; the component renders nothing until it's ready. Generation errors are caught and logged instead of breaking the render.

## Features

- Inline SVG output — crisp at any size, no image requests
- Four error-correction levels for damaged/obscured codes
- Custom foreground and background colors
- Regenerates automatically when any prop changes

## Install

```bash
npx @intinyagroup/cli add qr-code
```