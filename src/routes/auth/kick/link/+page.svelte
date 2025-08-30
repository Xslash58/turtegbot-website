<script lang="ts">
	import { page } from '$app/state';
	import { generatePKCE, LinkKickAccount } from '$lib/API/Auth';
	import { onMount } from 'svelte';
	import { Check, X } from 'phosphor-svelte';
	import LoadingIndicator from '../../../../components/LoadingIndicator.svelte';
	import { GetMe } from '$lib/API/Users';
	import type { User } from '$lib/API/Models/Users';
	import Error from '../../../+error.svelte';

	let success: boolean = false;
	let error: string = "";
	let user: User | null = null;

	onMount(async () => {
		console.log('Kick Auth Page Mounted');
		const query = page.url.searchParams;
		const code = query.get('code');
		const state = query.get('state');
		const codeVerifier = localStorage.getItem('turteg-kick-verifier');

		user = await GetMe();

		if (!user) {
			console.error('User is not logged in');
			error = "User not logged in";
			return;
		}

		if (code == null || state == null || codeVerifier == null) {
			const { codeVerifier, codeChallenge } = await generatePKCE();
			localStorage.setItem('turteg-kick-verifier', codeVerifier);

			location.href = `${import.meta.env.VITE_LINK_KICK_URL}&state=test&code_challenge=${codeChallenge}`;
            
			return;
		}

		try {
			success = await LinkKickAccount(code, codeVerifier);
		} catch (err) {
			console.error('Error linking Kick account:', err);
			error = err instanceof Error ? err.message : String(err).replace("Error: ", "");
			return;
		}

		if (success) location.href = `/users/${user?.id}/connections`;
	});
</script>

<section class="loading">
	{#if error}
	<p>{error}</p>
	{#if error.startsWith("Connection already linked")}
		<p>Invoke "#unlink" command at <a href="https://kick.com/turtegbot" target="_blank">kick.com/turtegbot</a> with your kick account and try again.</p>
	{/if}
	<X size="40px" weight="bold" color="white" />
	{:else if !error && !success}
		<p>Linking...</p>
		<LoadingIndicator />
	{:else}
		<p>Link Successful!</p>
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
