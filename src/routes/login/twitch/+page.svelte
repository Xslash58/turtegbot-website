<script lang="ts">
	import { onMount } from 'svelte';
	import LoadingIndicator from '../../../components/LoadingIndicator.svelte';

	onMount(() => {
		location.href = import.meta.env.VITE_AUTH_TWITCH_URL;
	});
</script>

<section class="loading">
	<p>Redirecting...</p>
	<LoadingIndicator />
</section>

<style lang="scss">
	section.loading {
		flex-grow: 1;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		font-weight: bold;

		p {
			text-align: center;
			margin: 0 0 0.5rem 0;
		}
	}
</style>
