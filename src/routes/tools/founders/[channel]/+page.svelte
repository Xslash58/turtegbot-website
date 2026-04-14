<script lang="ts">
	import { page } from '$app/state';
	import { GetFounders, GetTwitchUsersBulk } from '$lib/API/IVR';
	import type { FounderUser, IVRTwitchUser } from '$lib/API/Models/IVR';
	import { formatDate, formatTimeSpan } from '$lib/Utilities';
	import { onMount } from 'svelte';
	import loadingImage from '$lib/assets/loading_texture.webp';
	import LoadingIndicator from '../../../../components/LoadingIndicator.svelte';
	import { Star, X } from 'phosphor-svelte';

	let channelName = $state(page.params.channel);

	let founders: FounderUser[] = $state([]);
	let profilePictures: Record<string, string> = $state({});

	let isLoading: boolean = $state(true);

	onMount(async () => {
		console.log('Founders page mounted for channel:', channelName);

		if (!channelName) {
			alert('Channel name is missing in URL parameters.');
			return;
		}

		let channel = await GetTwitchUsersBulk([channelName]);
		if (channel && channel.length > 0) channelName = channel[0].displayName || channelName;
		else channelName = '';

		founders = (await GetFounders(channelName))?.founders || [];

		isLoading = false;

		if (founders.length > 0) {
			let users: IVRTwitchUser[] = [];

			let usersToFetch = founders.map((founder) => founder.login);

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

<section class="founders">
	{#if channelName}
		<h1>Twitch Founders for {channelName}</h1>

		<section class="list">
			{#if isLoading}
				<LoadingIndicator />
			{:else if founders.length === 0}
				<p>No founders found.</p>
			{:else}
				{#each founders as founder}
					<button
						class="founder"
						onclick={() => window.open(`https://www.twitch.tv/${founder.login}`, '_blank')}
					>
						<img src={profilePictures[founder.login] || loadingImage} alt="Founder Twitch Avatar" />
						<section class="user-data">
                        {#if founder.isSubscribed}
                            <section class="sub-indicator" title="Active Subscriber">
                                <Star size="32px" weight="fill" color="yellow" />
                            </section>
                        {/if}
							<h2>{founder.displayName}</h2>
							<p>{formatDate(founder.entitlementStart)}</p>
							{#if Math.floor((new Date(Date.now()).getTime() - new Date(founder.entitlementStart).getTime()) / 1000) < 3600}
								<p>{formatTimeSpan(founder.entitlementStart, Date.now(), { shorthand: true })} ago</p>
							{:else}
								<p>
									{formatTimeSpan(founder.entitlementStart, Date.now(), { shorthand: true, minUnit: 'hour' })} ago
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
	.founders {
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

		.founder {
            position: relative;
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

            .sub-indicator {
                position: absolute;
                top: 10px;
                right: 10px;
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

			.founder {
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
