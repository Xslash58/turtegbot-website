<script lang="ts">
	import { onMount } from 'svelte';
	import StoreSideBar from '$components/store/StoreSideBar.svelte';

	let { data, children } = $props();

	onMount(async () => {
		console.log('Store layout mounted');
	});
</script>

<section class="store-layout">
	<StoreSideBar />
	<section class="store-content">
		{@render children?.()}
	</section>
</section>

<style lang="scss">
	.store-layout {
		display: flex;
		flex-direction: row;
		flex: 1;
	}

	.store-content {
		flex: 1;
		padding: 20px;
	}

	@media (max-width: 768px) {
		.store-layout {
			flex-direction: column;
			flex: 0;
		}
	}
</style>
