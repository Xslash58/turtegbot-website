<script lang="ts">
	import { page } from '$app/state';
	import { GetModVIPList, GetTwitchUsersBulk } from '$lib/API/IVR';
	import type { IVRTwitchUser, RoleUser } from '$lib/API/Models/IVR';
	import { formatDate, formatTimeSpan } from '$lib/Utilities';
	import { onMount } from 'svelte';
	import loadingImage from '$lib/assets/loading_texture.webp';
	import LoadingIndicator from '../../../../components/LoadingIndicator.svelte';

	let channelName = page.params.channel;

	let mods: RoleUser[] = $state([]);
	let profilePictures: Record<string, string> = $state({});

	let isLoading: boolean = $state(true);

	onMount(async () => {
		console.log('Mods page mounted for channel:', channelName);

		if (!channelName) {
			alert('Channel name is missing in URL parameters.');
			return;
		}

		mods = (await GetModVIPList(channelName))?.mods || [];

        isLoading = false;

		if (mods.length > 0) {
			let users: IVRTwitchUser[] = [];

			let usersToFetch = mods.map((mod) => mod.login);

			while (usersToFetch.length > 0) {
				const batch = usersToFetch.splice(0, 50); // IVR API allows up to 50 logins per request
				const batchUsers = await GetTwitchUsersBulk(batch);
				if (batchUsers) {
					users.push(...batchUsers);
				}
			}

			if (users) {
				profilePictures = users.reduce(
					(acc, user) => {
						acc[user.login] = user.logo;
						return acc;
					},
					{} as Record<string, string>
				);
			}
		}
	});
</script>

<section class="mods">
	<h1>Twitch Moderators for {channelName}</h1>

	<section class="list">
		{#if isLoading}
            <LoadingIndicator />
        {:else if mods.length === 0}
			<p>No moderators found.</p>
		{:else}
			{#each mods as mod}
				<button
					class="mod"
					onclick={() => window.open(`https://www.twitch.tv/${mod.login}`, '_blank')}
				>
					<img src={profilePictures[mod.login] || loadingImage} alt="Moderator Twitch Avatar" />
					<h2>{mod.displayName}</h2>
					<p>{formatDate(mod.grantedAt)}</p>
					{#if Math.floor((new Date(Date.now()).getTime() - new Date(mod.grantedAt).getTime()) / 1000) < 3600}
						<p>{formatTimeSpan(mod.grantedAt, Date.now(), { shorthand: true })} ago</p>
					{:else}
						<p>
							{formatTimeSpan(mod.grantedAt, Date.now(), { shorthand: true, minUnit: 'hour' })} ago
						</p>
					{/if}
				</button>
			{/each}
		{/if}
	</section>
</section>

<style lang="scss">
	.mods {
		color: white;
		text-align: center;

		h1 {
			margin-bottom: 30px;
		}
	}

	.list {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		justify-content: center;

		.mod {
			border: none;
			color: white;
			background-color: #202020;
			padding: 20px;
			border-radius: 10px;
			width: 200px;
			text-align: center;

			&:hover {
				background-color: #242424;
			}

			img {
				border-radius: 50%;
				width: 100px;
				height: 100px;
				object-fit: cover;
				margin-bottom: 10px;
			}

			h2 {
				margin: 0;
				font-size: 1.2em;
			}

			p {
				margin: 5px 0 0 0;
				color: #888;
				font-size: 0.9em;
			}
		}
	}
</style>
