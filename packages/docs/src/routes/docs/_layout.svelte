<script lang="ts">
	let { children } = $props();
</script>

<div class="prose-docs max-w-3xl">
	{@render children?.()}
</div>
