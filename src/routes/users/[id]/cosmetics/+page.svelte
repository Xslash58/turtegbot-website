<script lang="ts">
	import { onMount } from 'svelte';
	import type { FFZBadge } from '$lib/API/Models/FFZ';
	import { EquipBadge, GetUserBadges } from '$lib/API/Entitlements';
	import type { User } from '$lib/API/Models/Users';
	import { profileUser } from '$lib/stores/userStore';
	import { page } from '$app/state';
	import { feedbackDialog } from '$lib/stores/modalStore';
    import tBadgeNone from '$lib/assets/tbadgenone.png';

	let selectedBadgeId: string | null = $state(null);
	let badges: FFZBadge[] | null = $state(null);

	let user: User | null = $profileUser;
	let userPageId: string | null = page.params.id || null;

	onMount(async () => {
		if(userPageId)
			badges = await GetUserBadges(userPageId);
		if (user && badges) {
			let selBadge = badges.find((b) => b.users.includes(user.twitchId));
			if (selBadge) selectedBadgeId = selBadge.id.toString();
		}
	});

	async function selectBadge(badgeId: string | null) {
		if (!userPageId || badgeId == selectedBadgeId) return;
		let success = await EquipBadge(userPageId, badgeId);
		if (!success) {
			feedbackDialog.set({
				visible: true,
				title: 'Error',
				content: 'Failed to equip badge. Please try again later or contact support.'
			});
			return;
		}
		selectedBadgeId = badgeId;
        feedbackDialog.set({
            visible: true,
            title: 'Success',
            content: badgeId ? 'Badge equipped successfully! It may take a while for the change to be reflected.' : 'Badge removed successfully! It may take a while for the change to be reflected.'
        });
	}
</script>

<section class="cosmetics">
	<h2>Badges</h2>
	<hr />
	<section class="badges">
		<button
			class="badge none"
			class:selected={selectedBadgeId === null}
			onclick={() => selectBadge(null)}
		>
			<img src={tBadgeNone} alt="No Badge" />
			<p>None</p>
		</button>
		{#if user}
			{#each badges as badge}
				<button
					class="badge"
					class:selected={selectedBadgeId === badge.id.toString()}
					onclick={() => selectBadge(badge.id.toString())}
				>
					<img src={badge.image} alt={badge.title} />
					<p>{badge.title.replace('TurtegBot', '')}</p>
				</button>
			{/each}
		{/if}
	</section>
</section>

<style lang="scss">
	.cosmetics {
		h2 {
			color: gray;
			margin: 0;
		}
		hr {
			background-color: gray;
			height: 1px;
			border: 0;
		}
		.badges {
			display: flex;
			flex-direction: row;
            flex-wrap: wrap;
			gap: 10px;

			.badge {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 64px;

				border: none;
				background: none;
				padding: 0;

				&:hover {
					img {
						transform: translateY(-5px) scale(1.05);
						transition: transform 0.2s;
					}
				}
				&.selected {
					img {
						transform: translateY(5px);
						filter: drop-shadow(0 -5px 0px #33ca00);
					}
				}

				img {
					width: 64px;
					height: 64px;
					transition: transform 0.2s;
				}

				p {
					margin-top: 8px;
					font-size: 12px;
					color: white;
					text-wrap: wrap;
				}
			}
		}
	}
</style>
