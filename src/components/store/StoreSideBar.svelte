<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Button from '$components/Button.svelte';
	import { Gift } from 'phosphor-svelte';
	import { onMount } from 'svelte';

	const buttonVariant = 'transparent';

	onMount(async () => {
		console.log('StoreSideBar component mounted');
	});

	function gotoCategory(category: string) {
		goto(getCategoryPath(category));
	}
	function getCategoryPath(category: string) {
		if (category === '') return `/store`;
		return `/store/${category}`;
	}
</script>

<section class="sidebar">
	<nav>
		<Button
			active={page.url.pathname === getCategoryPath('redeem')}
			onclick={() => gotoCategory(`redeem`)}
			variant={buttonVariant}
		>
			{#snippet icon({ active })}
				<Gift weight={active ? 'fill' : 'regular'} />
			{/snippet}
			Redeem Code
		</Button>
	</nav>
</section>

<style lang="scss">
	.sidebar {
		background-color: #101010;
		color: white;
		padding: 20px;
		width: 200px;
		min-height: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 50px;

		nav {
			width: 100%;
			display: flex;
			flex-direction: column;
		}
	}

	@media (max-width: 768px) {
		.sidebar {
			width: 100%;
			padding: 0;
			gap: 0;
		}
		nav {
			flex-direction: row !important;
			flex-shrink: 0;
			overflow-x: scroll;
			gap: 5px;
			scrollbar-width: initial;

			&::-webkit-scrollbar {
				height: 6px;
			}
		}
	}
</style>
