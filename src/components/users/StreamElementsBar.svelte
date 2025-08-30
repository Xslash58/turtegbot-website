<script lang="ts">
	import { goto } from '$app/navigation';
	import type { User } from '$lib/API/Models/Users';
	import { onMount } from 'svelte';

	export let user: User | null;

	onMount(async () => {
		console.log('StreamElementsBar component mounted');
	});

	function gotoCategory(category: string) {
		goto(`/users/${user?.id}/streamelements/${category}`);
	}
</script>

<section class="sidebar">
	<nav>
		<button on:click={() => gotoCategory(`codes`)}>Codes</button>
	</nav>
</section>

<style lang="scss">
	.sidebar {
		background-color: #101010;
		color: white;
		width: 100%;

		button {
			background-color: #0079ca;
			color: white;
			border: none;
			border-radius: 10px;
			padding: 10px 0;
			cursor: pointer;
            width: 120px;
            margin: 5px;
			&:hover {
				background-color: #28a300;
			}

			&:disabled {
				background-color: #555;
				cursor: not-allowed;
			}
		}

		nav {
			width: 100%;
			display: flex;
			flex-direction: row;
		}
	}
</style>
