<script lang="ts">
	import Playground from '$lib/components/Playground.svelte';
	import type { PlaygroundProp } from '$lib/components/Playground.svelte';

	import { Button } from '@intinyagroup/ui/components/button';
	import { Badge } from '@intinyagroup/ui/components/badge';
	import { Input } from '@intinyagroup/ui/components/input';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
		CardFooter
	} from '@intinyagroup/ui/components/card';
	import { Alert, AlertTitle, AlertDescription } from '@intinyagroup/ui/components/alert';
	import { Switch } from '@intinyagroup/ui/components/switch';
	import {
		Select,
		SelectTrigger,
		SelectValue,
		SelectContent,
		SelectItem
	} from '@intinyagroup/ui/components/select';
	import { createListCollection } from '@ark-ui/svelte/select';
	import { SliderRoot, SliderRange, SliderThumb } from '@intinyagroup/ui/components/slider';
	import { Progress } from '@intinyagroup/ui/components/progress';
	import { Checkbox } from '@intinyagroup/ui/components/checkbox';

	const buttonProps: PlaygroundProp[] = [
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

	const badgeProps: PlaygroundProp[] = [
		{
			name: 'variant',
			label: 'Variant',
			type: 'enum',
			default: 'default',
			values: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link']
		},
		{ name: 'label', label: 'Label', type: 'string', default: 'Badge' }
	];

	const inputProps: PlaygroundProp[] = [
		{
			name: 'type',
			label: 'Type',
			type: 'enum',
			default: 'text',
			values: ['text', 'email', 'password', 'number', 'tel', 'url']
		},
		{ name: 'placeholder', label: 'Placeholder', type: 'string', default: 'Enter text…' },
		{ name: 'disabled', label: 'Disabled', type: 'boolean', default: false },
		{ name: 'value', label: 'Value', type: 'string', default: '' }
	];

	const cardProps: PlaygroundProp[] = [
		{ name: 'title', label: 'Title', type: 'string', default: 'Project Card' },
		{
			name: 'description',
			label: 'Description',
			type: 'string',
			default: 'A short description of the project goes here.'
		},
		{ name: 'footer', label: 'Show footer', type: 'boolean', default: true }
	];

	const alertProps: PlaygroundProp[] = [
		{
			name: 'variant',
			label: 'Variant',
			type: 'enum',
			default: 'default',
			values: ['default', 'destructive']
		},
		{ name: 'title', label: 'Title', type: 'string', default: 'Heads up!' },
		{
			name: 'description',
			label: 'Description',
			type: 'string',
			default: 'You can add content to the alert.'
		}
	];

	const switchProps: PlaygroundProp[] = [
		{ name: 'checked', label: 'Checked', type: 'boolean', default: true },
		{ name: 'disabled', label: 'Disabled', type: 'boolean', default: false },
		{ name: 'label', label: 'Label', type: 'string', default: 'Airplane mode' }
	];

	const selectProps: PlaygroundProp[] = [
		{
			name: 'size',
			label: 'Size',
			type: 'enum',
			default: 'default',
			values: ['xs', 'sm', 'default', 'lg']
		},
		{ name: 'placeholder', label: 'Placeholder', type: 'string', default: 'Select a fruit…' },
		{ name: 'disabled', label: 'Disabled', type: 'boolean', default: false }
	];

	const sliderProps: PlaygroundProp[] = [
		{ name: 'value', label: 'Value', type: 'number', default: 50, min: 0, max: 100 },
		{ name: 'step', label: 'Step', type: 'number', default: 5, min: 1, max: 25 },
		{ name: 'disabled', label: 'Disabled', type: 'boolean', default: false }
	];

	const progressProps: PlaygroundProp[] = [
		{ name: 'value', label: 'Value', type: 'number', default: 65, min: 0, max: 100 },
		{ name: 'indeterminate', label: 'Indeterminate', type: 'boolean', default: false }
	];

	const checkboxProps: PlaygroundProp[] = [
		{ name: 'checked', label: 'Checked', type: 'boolean', default: true },
		{ name: 'disabled', label: 'Disabled', type: 'boolean', default: false },
		{ name: 'label', label: 'Label', type: 'string', default: 'Accept terms' }
	];
</script>

<svelte:head>
	<title>Playground — Intinya UI</title>
	<meta name="description" content="Live interactive component playgrounds for Intinya UI" />
</svelte:head>

<section class="mx-auto max-w-5xl px-4 py-12">
	<div class="mb-10">
		<h1 class="text-3xl font-bold">Playground</h1>
		<p class="mt-2 text-[var(--ui-muted-foreground)]">
			Tweak props live. Switch to the <strong class="font-medium text-[var(--ui-foreground)]">Code</strong> tab to copy the generated
			snippet.
		</p>
	</div>

	<div class="space-y-8">
		<!-- Button -->
		<Playground
			title="Button"
			description="Variants, sizes, disabled state"
			props={buttonProps}
			getCode={(v) =>
				`<Button variant="${v.variant}" size="${v.size}"${v.disabled ? ' disabled' : ''}>${v.label}</Button>`}
		>
			{#snippet render(v)}
				<Button variant={v.variant} size={v.size} disabled={v.disabled}>{v.label}</Button>
			{/snippet}
		</Playground>

		<!-- Badge -->
		<Playground
			title="Badge"
			description="Status and label badges"
			props={badgeProps}
			getCode={(v) => `<Badge variant="${v.variant}">${v.label}</Badge>`}
		>
			{#snippet render(v)}
				<Badge variant={v.variant}>{v.label}</Badge>
			{/snippet}
		</Playground>

		<!-- Input -->
		<Playground
			title="Input"
			description="Input types, placeholder, disabled"
			props={inputProps}
			getCode={(v) =>
				`<Input type="${v.type}" placeholder="${v.placeholder}"${v.disabled ? ' disabled' : ''}${v.value ? ` value="${v.value}"` : ''} />`}
		>
			{#snippet render(v)}
				<div class="w-64">
					<Input type={v.type} placeholder={v.placeholder} disabled={v.disabled} value={v.value} />
				</div>
			{/snippet}
		</Playground>

		<!-- Card -->
		<Playground
			title="Card"
			description="Content container with header and footer"
			props={cardProps}
			getCode={(v) =>
				`<Card>
  <CardHeader>
    <CardTitle>${v.title}</CardTitle>
    <CardDescription>${v.description}</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Some body content lives here.</p>
  </CardContent>${v.footer
					? `\n  <CardFooter class="flex justify-end gap-2">
    <Button variant="outline" size="sm">Cancel</Button>
    <Button size="sm">Save</Button>
  </CardFooter>`
					: ''}
</Card>`}
		>
			{#snippet render(v)}
				<Card class="w-72">
					<CardHeader>
						<CardTitle>{v.title}</CardTitle>
						<CardDescription>{v.description}</CardDescription>
					</CardHeader>
					<CardContent>
						<p class="text-sm text-[var(--ui-muted-foreground)]">Some body content lives here.</p>
					</CardContent>
					{#if v.footer}
						<CardFooter class="flex justify-end gap-2">
							<Button variant="outline" size="sm">Cancel</Button>
							<Button size="sm">Save</Button>
						</CardFooter>
					{/if}
				</Card>
			{/snippet}
		</Playground>

		<!-- Alert -->
		<Playground
			title="Alert"
			description="Feedback messages"
			props={alertProps}
			getCode={(v) =>
				`<Alert variant="${v.variant}">
  <AlertTitle>${v.title}</AlertTitle>
  <AlertDescription>${v.description}</AlertDescription>
</Alert>`}
		>
			{#snippet render(v)}
				<Alert variant={v.variant} class="w-72">
					<AlertTitle>{v.title}</AlertTitle>
					<AlertDescription>{v.description}</AlertDescription>
				</Alert>
			{/snippet}
		</Playground>

		<!-- Switch -->
		<Playground
			title="Switch"
			description="Toggle between two states"
			props={switchProps}
			getCode={(v) =>
				`<div class="flex items-center gap-2">
  <Switch checked={${v.checked}}${v.disabled ? ' disabled' : ''} />
  <Label>${v.label}</Label>
</div>`}
		>
			{#snippet render(v)}
				<div class="flex items-center gap-3">
					<Switch checked={v.checked} disabled={v.disabled} />
					<span class="text-sm">{v.label}</span>
				</div>
			{/snippet}
		</Playground>

		<!-- Select -->
		<Playground
			title="Select"
			description="Dropdown selection"
			props={selectProps}
			getCode={(v) =>
				`<Select disabled={${v.disabled}} size="${v.size}">
  <SelectTrigger>
    <SelectValue placeholder="${v.placeholder}" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="cherry">Cherry</SelectItem>
  </SelectContent>
</Select>`}
		>
			{#snippet render(v)}
				{@const collection = createListCollection({
					items: [
						{ label: 'Apple', value: 'apple' },
						{ label: 'Banana', value: 'banana' },
						{ label: 'Cherry', value: 'cherry' }
					]
				})}
				<div class="w-56">
					<Select disabled={v.disabled} {collection}>
						<SelectTrigger>
							<SelectValue placeholder={v.placeholder} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem item="apple">Apple</SelectItem>
							<SelectItem item="banana">Banana</SelectItem>
							<SelectItem item="cherry">Cherry</SelectItem>
						</SelectContent>
					</Select>
				</div>
			{/snippet}
		</Playground>

		<!-- Slider -->
		<Playground
			title="Slider"
			description="Value selector on a track"
			props={sliderProps}
			getCode={(v) =>
				`<Slider defaultValue={[${v.value}]} step={${v.step}} max={100}${v.disabled ? ' disabled' : ''} />`}
		>
			{#snippet render(v)}
				<div class="w-64">
					<SliderRoot
						value={[v.value]}
						step={v.step}
						max={100}
						disabled={v.disabled}
						class="relative flex h-5 w-full touch-none select-none items-center"
					>
						<SliderRange class="absolute h-full rounded-full bg-[var(--ui-primary)]" />
						<SliderThumb index={0} class="block size-4 rounded-full bg-[var(--ui-primary)] shadow transition-colors focus-visible:outline-2 focus-visible:outline-[var(--ui-ring)]" />
					</SliderRoot>
				</div>
			{/snippet}
		</Playground>

		<!-- Progress -->
		<Playground
			title="Progress"
			description="Visual progress indicator"
			props={progressProps}
			getCode={(v) =>
				v.indeterminate
					? `<Progress value={null} />`
					: `<Progress value={${v.value}} />`}
		>
			{#snippet render(v)}
				<div class="w-64">
					<Progress value={v.indeterminate ? null : v.value} />
				</div>
			{/snippet}
		</Playground>

		<!-- Checkbox -->
		<Playground
			title="Checkbox"
			description="Binary choice with label"
			props={checkboxProps}
			getCode={(v) =>
				`<div class="flex items-center gap-2">
  <Checkbox checked={${v.checked}}${v.disabled ? ' disabled' : ''} />
  <Label>${v.label}</Label>
</div>`}
		>
			{#snippet render(v)}
				<div class="flex items-center gap-3">
					<Checkbox checked={v.checked} disabled={v.disabled} />
					<span class="text-sm">{v.label}</span>
				</div>
			{/snippet}
		</Playground>
	</div>
</section>
