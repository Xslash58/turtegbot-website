<script lang="ts">
	import { page } from '$app/state';
	import { ExchangeCodeForToken } from '$lib/API/Auth';
	import { onMount } from 'svelte';
	import { Check, X } from 'phosphor-svelte';
	import LoadingIndicator from '../../../components/LoadingIndicator.svelte';

	let token: string = '';
	let error: string = "";

	onMount(async () => {
		console.log('Twitch Auth Page Mounted');
		const query = page.url.searchParams;
		const code = query.get('code');
		const scope = query.get('scope');
		const save = query.get('save') === 'true';

		if (code == null || scope == null) {
			console.error('Missing code or scope in query parameters');
			error = "Missing code or scope in query parameters";
			return;
		}
		
		try {
			token = await ExchangeCodeForToken(code, scope, save);
		} catch (err) {
			error = err instanceof Error ? err.message : String(err).replace("Error: ", "");
			return;
		}

		localStorage.setItem('turteg-token', token);

		location.href = '/';
	});
</script>

<section class="loading">
	{#if error}
		<p>{error}</p>
		<X size="40px" weight="bold" color="white" />
	{:else if !token}
		<p>Logging you in...</p>
		<LoadingIndicator />
	{:else}
		<p>Auth Successful!</p>
		<p>You should be redirected soon.</p>
		<Check size="40px" weight="bold" color="white" />
	{/if}
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
