<script lang="ts">
	import Tabs from './tabs.svelte';
	import TabsList from './tabs-list.svelte';
	import TabsTrigger from './tabs-trigger.svelte';
	import TabsContent from './tabs-content.svelte';

	let { value = $bindable('tab1') }: { value?: string } = $props();
</script>

<Tabs bind:value>
	<TabsList>
		<TabsTrigger value="tab1">Tab 1</TabsTrigger>
		<TabsTrigger value="tab2">Tab 2</TabsTrigger>
		<TabsTrigger value="tab3">Tab 3</TabsTrigger>
	</TabsList>
	<TabsContent value="tab1">Content 1</TabsContent>
	<TabsContent value="tab2">Content 2</TabsContent>
	<TabsContent value="tab3">Content 3</TabsContent>
</Tabs>
