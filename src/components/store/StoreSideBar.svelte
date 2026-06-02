<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(async () => {
		console.log('StoreSideBar component mounted');
	});

	function gotoCategory(category: string) {
		goto(`/store/${category}`);
	}
</script>

<section class="sidebar">
	<nav>
		<button on:click={() => gotoCategory(`redeem`)}>Redeem Code</button>
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

		button {
			background-color: #33ca00;
			color: white;
			border: none;
			border-radius: 10px;
			padding: 10px 15px;
			cursor: pointer;
			margin-bottom: 10px;

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
			flex-direction: column;
		}
	}

	@media (max-width: 768px) {
		.sidebar {
			width: 100%;
			padding: 0;
			gap: 0;
		}
		button {
			min-width: 120px;
			padding: 5px 0 !important;

			display: flex;
			justify-content: center;
			align-items: center;
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
