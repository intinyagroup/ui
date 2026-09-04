<script lang="ts">
	import ProgressSteps from './ProgressSteps.svelte';

	let { current = $bindable(1), completed = 1 }: { current?: number; completed?: number } = $props();

	const steps = [
		{ label: 'Account' },
		{ label: 'Payment' },
		{ label: 'Confirm' },
		{ label: 'Done' }
	];
</script>

<ProgressSteps {steps} bind:current {completed} />