<script lang="ts">
	import { page } from '$app/state';
	import Button from '$components/Button.svelte';
	import type { User } from '$lib/API/Models/Users';
	import { Gift } from 'phosphor-svelte';
	import { onMount } from 'svelte';

	export let user: User | null;

	onMount(async () => {
		console.log('StreamElementsBar component mounted');
	});

	function getCategoryPath(category: string) {
		if (category === '') return `/users/${user?.id}/streamelements`;
		return `/users/${user?.id}/streamelements/${category}`;
	}
</script>

<section class="sidebar">
	<nav>
		<Button href={getCategoryPath('codes')} active={page.url.pathname === getCategoryPath('codes')}>
			{#snippet icon({ active })}
				<Gift weight={active ? 'fill' : 'regular'} />
			{/snippet}
			Codes
		</Button>
	</nav>
</section>

<style lang="scss">
	.sidebar {
		background-color: #101010;
		color: white;
		width: 100%;

		nav {
			width: 100%;
			display: flex;
			flex-direction: row;
		}
	}
</style>
