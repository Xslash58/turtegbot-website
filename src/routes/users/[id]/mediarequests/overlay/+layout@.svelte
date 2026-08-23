<script>
	let { children } = $props();
</script>

<svelte:head>
	<style>
		/* Ensure transparent background for OBS Browser Source */
		:root,
		body,
		html {
			background-color: transparent !important;
			margin: 0;
			padding: 0;
			overflow: hidden;
		}
	</style>
</svelte:head>

{@render children?.()}
