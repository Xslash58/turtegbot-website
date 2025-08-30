<script lang="ts">
	import { page } from '$app/state';
	import { LinkTwitchAccount } from '$lib/API/Auth';
	import { onMount } from 'svelte';
	import LoadingIndicator from '../../../../components/LoadingIndicator.svelte';
	import { GetMe } from '$lib/API/Users';
	import type { User } from '$lib/API/Models/Users';
	import { Check, X } from 'phosphor-svelte';

	let success: boolean = false;
	let error: string = "";
	let user: User | null = null;

	onMount(async () => {
		console.log('Twitch Auth Page Mounted');
		const query = page.url.searchParams;
		const code = query.get('code');

		user = await GetMe();

		if (!user) {
			console.error('User is not logged in');
			error = "User not logged in";
			return;
		}

		if (code == null) {
			location.href = `${import.meta.env.VITE_LINK_TWITCH_URL}`;
			return;
		}

        try {
			success = await LinkTwitchAccount(code);
		} catch (err) {
			console.error('Error linking Twitch account:', err);
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
		<p>Invoke "#unlink" command at <a href="https://twitch.tv/turtegbot" target="_blank">twitch.tv/turtegbot</a> with your twitch account and try again.</p>
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
