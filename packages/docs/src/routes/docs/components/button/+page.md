<script lang="ts">
	import Playground from '$lib/components/Playground.svelte';
	import { Button } from '@intinyagroup/ui/components/button';

	const buttonProps = [
		{
			name: 'variant',
			label: 'Variant',
			type: 'enum',
			default: 'default',
			values: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link']
		},
		{
			name: 'size',
			label: 'Size',
			type: 'enum',
			default: 'default',
			values: ['xs', 'sm', 'default', 'lg', 'icon']
		},
		{ name: 'disabled', label: 'Disabled', type: 'boolean', default: false },
		{ name: 'label', label: 'Label', type: 'string', default: 'Click me' }
	];
</script>

# Button

Displays a button or link that looks like a button. Renders an `<a>` when `href` is set, otherwise a `<button>`.

## Preview

```svelte
<script>
  import { Button } from '@intinyagroup/ui';
</script>

<div class="flex flex-wrap gap-2">
  <Button>Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="link">Link</Button>
</div>
```

## Sizes

```svelte
<div class="flex flex-wrap items-center gap-2">
  <Button size="xs">Extra small</Button>
  <Button size="sm">Small</Button>
  <Button size="default">Default</Button>
  <Button size="lg">Large</Button>
  <Button size="icon" aria-label="Search">🔍</Button>
</div>
```

## As a link

```svelte
<Button href="/docs">Go to docs</Button>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'default' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive' \| 'link'` | `'default'` |
| `size` | `'xs' \| 'sm' \| 'default' \| 'lg' \| 'icon' \| 'icon-xs' \| 'icon-sm' \| 'icon-lg'` | `'default'` |
| `href` | `string` | `undefined` |
| `type` | `string` | `'button'` |
| `disabled` | `boolean` | `undefined` |
| `class` | `string` | — |

All other props are forwarded to the underlying `<button>` or `<a>` element.

## Install

```bash
npx @intinyagroup/cli add button
```

## Playground

Live playground — tweak the props and watch the button update. Switch to the **Code** tab to copy the generated snippet.

<Playground
	title="Button Playground"
	description="Variants, sizes, disabled state"
	props={buttonProps}
	getCode={(v) =>
		`<Button variant="${v.variant}" size="${v.size}"${v.disabled ? ' disabled' : ''}>${v.label}</Button>`}
>
	{#snippet render(values)}
		<Button variant={values.variant} size={values.size} disabled={values.disabled}>
			{values.label}
		</Button>
	{/snippet}
</Playground>
