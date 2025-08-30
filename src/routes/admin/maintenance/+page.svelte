<script lang="ts">
	import { PostReload } from '$lib/API/Admin';
	import { onMount } from 'svelte';
	import LoadingIndicator from '../../../components/LoadingIndicator.svelte';

	let error: string = '';
	let isLoading: boolean = false;

	onMount(async () => {
		console.log('Maintenance page mounted');

        // Send initial ping
        await reload('webping');
	});

	async function reload(module: string) {
		let success = false;
		isLoading = true;
		try {
			success = await PostReload(module);
		} catch (err) {
			console.error(`Error reloading ${module}:`, error);
			error = err instanceof Error ? err.message : String(err).replace('Error: ', '');
		}
		isLoading = false;
	}
</script>

<section class="maintenance">
	{#if !error && !isLoading}
		<section class="panel">
			<h1>Bot</h1>
			<nav>
				<button onclick={() => reload('rolemanager')}>Reload Roles</button>
				<button onclick={() => reload('afkmanager')}>Reload AFKs</button>
                <button onclick={() => reload('translationmanager')}>Reload Translations</button>
                <br>
				<button class="danger" onclick={() => reload('bot')}>Restart Bot</button>
			</nav>
		</section>
	{:else if isLoading}
		<section class="panel">
			<LoadingIndicator />
		</section>
	{:else}
		<section class="panel">
			<h1>{error}</h1>
		</section>
	{/if}
</section>

<style lang="scss">
	section.panel {
		display: flex;
		flex-direction: column;
		gap: 20px;

		background-color: #101010;
		padding: 15px;
		text-align: center;

		h1 {
			margin: 0;
			font-size: 1.75rem;
		}

		button {
			background-color: #33ca00;
			color: white;
			border: none;
			border-radius: 10px;
			padding: 10px 15px;
			cursor: pointer;
			margin-bottom: 10px;

			&:hover {
				background-color: #28a745;
			}

			&:active {
				transform: scale(1.05);
			}

			&.danger {
				background-color: #dc3545;

				&:hover {
					background-color: #c82333;
				}
			}
		}
	}
</style>
