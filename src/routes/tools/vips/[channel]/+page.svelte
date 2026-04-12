<script lang="ts">
	import { page } from '$app/state';
	import { GetModVIPList, GetTwitchUsersBulk } from '$lib/API/IVR';
	import type { IVRTwitchUser, RoleUser } from '$lib/API/Models/IVR';
	import { formatDate, formatTimeSpan } from '$lib/Utilities';
	import { onMount } from 'svelte';
	import loadingImage from '$lib/assets/loading_texture.webp';
	import LoadingIndicator from '../../../../components/LoadingIndicator.svelte';
	import { X } from 'phosphor-svelte';

	let channelName = $state(page.params.channel);

	let vips: RoleUser[] = $state([]);
	let profilePictures: Record<string, string> = $state({});

	let isLoading: boolean = $state(true);

	onMount(async () => {
		console.log('VIPs page mounted for channel:', channelName);

		if (!channelName) {
			alert('Channel name is missing in URL parameters.');
			return;
		}

		let channel = await GetTwitchUsersBulk([channelName]);
		if (channel && channel.length > 0) channelName = channel[0].displayName || channelName;
		else channelName = '';

		vips = (await GetModVIPList(channelName))?.vips || [];

		isLoading = false;

		if (vips.length > 0) {
			let users: IVRTwitchUser[] = [];

			let usersToFetch = vips.map((vip) => vip.login);

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

<section class="vips">
	{#if channelName}
		<h1>Twitch VIPs for {channelName}</h1>

		<section class="list">
			{#if isLoading}
				<LoadingIndicator />
			{:else if vips.length === 0}
				<p>No VIPs found.</p>
			{:else}
				{#each vips as vip}
					<button
						class="vip"
						onclick={() => window.open(`https://www.twitch.tv/${vip.login}`, '_blank')}
					>
						<img src={profilePictures[vip.login] || loadingImage} alt="VIP Twitch Avatar" />
						<section class="user-data">
							<h2>{vip.displayName}</h2>
							<p>{formatDate(vip.grantedAt)}</p>
							{#if Math.floor((new Date(Date.now()).getTime() - new Date(vip.grantedAt).getTime()) / 1000) < 3600}
								<p>{formatTimeSpan(vip.grantedAt, Date.now(), { shorthand: true })} ago</p>
							{:else}
								<p>
									{formatTimeSpan(vip.grantedAt, Date.now(), { shorthand: true, minUnit: 'hour' })} ago
								</p>
							{/if}
						</section>
					</button>
				{/each}
			{/if}
		</section>
	{:else}
		<p style="font-size: 1.25rem;">Channel not found.</p>
		<X size="40px" weight="bold" color="white" />
	{/if}
</section>

<style lang="scss">
	.vips {
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

		.vip {
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

	@media (max-width: 425px) {
		h1 {
			font-size: 1.65rem;
			margin-bottom: 0;
		}

		.list {
			gap: 5px;

			.vip {
				width: 100%;

				border-radius: 0;

				img {
					height: 100%;
					width: auto;
					margin-bottom: 0;
				}

				.user-data {
					text-align: center;
					width: 100%;
				}

				height: 100px;

				display: flex;
				flex-direction: row;
				align-items: center;
			}
		}
	}
</style>
