<script lang="ts">
	import TabBar from './TabBar.svelte';
	import TabBarItem from './TabBarItem.svelte';

	let { value = $bindable('home') }: { value?: string | number } = $props();
</script>

<TabBar bind:value>
	<TabBarItem value="home" label="Home" />
	<TabBarItem value="search" label="Search" />
	<TabBarItem value="profile" label="Profile" badge={3} />
</TabBar>