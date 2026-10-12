<script lang="ts">
	import { onMount } from 'svelte';
	import UserSearch from '$components/users/UserSearch.svelte';
	import type { SearchUser, User } from '$lib/API/Models/Users';
	import { GetUserPage } from '$lib/API/Users';
	import KickLogo from '$lib/assets/KickLogo.svg';
	import TwitchLogo from '$lib/assets/glitch_flat_white.svg';
	import { goto } from '$app/navigation';
	import { DeleteUserSession, PatchUser } from '$lib/API/Admin';
	import { feedbackDialog } from '$lib/stores/modalStore';
	import EntitlementDialog from '$components/entitlements/EntitlementDialog.svelte';
	import { page } from '$app/state';
	import Button from '$components/Button.svelte';
	import { ArrowSquareOut, Graph, Link, SmileyXEyes, UserMinus } from 'phosphor-svelte';
	import { can } from '$lib/stores/permissions';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';

	let entitlementDialog: EntitlementDialog | null = $state(null);

	let requestedUserId: string | null = page.params.id ?? null;

	let selectedUser: User | null = $state(null);

	let userKickId: number = $state(0);
	let userTwitchId: number = $state(0);

	onMount(async () => {
		console.log('Users page mounted for ' + requestedUserId);
		await GetProperUser(requestedUserId);
	});

	async function GetProperUser(userId: string | null) {
		if (!userId) {
			selectedUser = null;
			userKickId = 0;
			userTwitchId = 0;
			return;
		}

		let user = await GetUserPage(userId);
		if (user) {
			selectedUser = user.user;
			if (selectedUser == null) return;
			userKickId = Number(selectedUser.kickId) ?? 0;
			userTwitchId = Number(selectedUser.twitchId) ?? 0;
		} else {
			selectedUser = null;
			userKickId = 0;
			userTwitchId = 0;
		}
	}

	async function InvalidateSession() {
		if (!selectedUser) return;

		const success = await DeleteUserSession(selectedUser.id);
		if (success) {
			feedbackDialog.set({
				title: 'Session Invalidated',
				content: `The session for user ${selectedUser.display_name} has been invalidated.`,
				visible: true
			});
		} else {
			feedbackDialog.set({
				title: 'Failed to Invalidate Session',
				content: `The session for user ${selectedUser.display_name} can't be invalidated.`,
				visible: true
			});
		}
	}

	async function OpenEntitlementDialog() {
		if (entitlementDialog) {
			entitlementDialog.toggleVisibility();
		}
	}

	async function ApplyUserChanges() {
		if (!selectedUser) return;

		const updatedUser: Partial<User> = {
			kickId: userKickId != 0 ? userKickId + '' : undefined,
			twitchId: userTwitchId != 0 ? userTwitchId + '' : undefined
		};

		const success = await PatchUser(selectedUser.id, updatedUser);
		if (success) {
			console.log('User updated successfully');
		} else {
			console.error('Failed to update user');
		}
	}
</script>

<section class="users">
	{#if selectedUser}
		<EntitlementDialog bind:this={entitlementDialog} user={selectedUser} />

		<section class="panel">
			<section class="title">
				<img src={selectedUser.profile_image_url} alt="User Avatar" />
				<h1>User Details for {selectedUser.display_name}</h1>
			</section>
			<section class="user-data">
				<p><strong>ID:</strong> {selectedUser.id}</p>
				<p><strong>Display Name:</strong> {selectedUser.display_name}</p>
				<p><strong>Twitch Username:</strong> {selectedUser.twitchLogin ?? 'N/A'}</p>
				<p><strong>Kick Username:</strong> {selectedUser.kickLogin ?? 'N/A'}</p>
				<p>
					<strong>Profile Picture:</strong>
					<a href={selectedUser.profile_image_url ?? '#'} target="_blank">View</a>
				</p>
				<p><strong>Rooms:</strong> {Object.values(selectedUser.roomIds).join(', ')}</p>
				<p><strong>Flags:</strong> {selectedUser.flags.join(', ')}</p>
				<p>
					<strong>SE Points Name:</strong>
					{selectedUser.streamElementsData.pointsName ?? 'N/A'}
				</p>
			</section>
		</section>

		{#if $can('admin.users.update')}
			<section class="panel">
				<section class="title">
					<h1>Connections</h1>
				</section>
				<section class="connections">
					<label>
						<img src={KickLogo} alt="Kick" />
						<input type="number" placeholder="Kick ID..." bind:value={userKickId} />
					</label>
					<label>
						<img src={TwitchLogo} alt="Twitch" />
						<input type="number" placeholder="Twitch ID..." bind:value={userTwitchId} />
					</label>
				</section>
				<Button onclick={() => ApplyUserChanges}>
					{#snippet icon()}
						<Link weight="regular" />
					{/snippet}
					Save Changes</Button
				>
			</section>
		{/if}

		<section class="panel">
			<section class="title">
				<h1>Actions</h1>
			</section>
			<section class="actions">
				<Button
					onclick={() => {
						goto(`/users/${selectedUser?.id}`);
					}}
				>
					{#snippet icon()}
						<ArrowSquareOut weight="regular" />
					{/snippet}
					Go to Profile
				</Button>
				{#if $can('admin.users.ban')}
					<Button disabled>
						{#snippet icon()}
							<UserMinus weight="regular" />
						{/snippet}
						Global Ban
					</Button>
				{/if}
				{#if $can('admin.users.session.invalidate')}
					<Button onclick={() => InvalidateSession()}>
						{#snippet icon()}
							<SmileyXEyes weight="regular" />
						{/snippet}
						Invalidate Session
					</Button>
				{/if}
				{#if $can('admin.entitlements.grant') || $can('admin.entitlements.revoke')}
					<Button onclick={() => OpenEntitlementDialog()}>
						{#snippet icon()}
							<Graph weight="regular" />
						{/snippet}
						Manage Entitlements
					</Button>
				{/if}
			</section>
		</section>
	{:else}
		<section class="panel">
			<LoadingIndicator />
		</section>
	{/if}
</section>

<style lang="scss">
	.users {
		display: flex;
        flex-wrap: wrap;
		flex-direction: row;
		gap: 1rem;

		.panel {
			background: #101010;
			padding: 1rem;
			border-radius: 5px;
			box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

			section.title {
				width: 100%;

				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 5px;

				> img {
					width: 24px;
				}

				h1 {
					font-size: 1.5rem;
					margin: 0;
				}
			}

			section.user-data {
				background-color: #202020;
				width: 350px;

				p {
					margin: 0.5rem 0;
				}
			}

			section.connections {
				display: flex;
				flex-direction: column;
				gap: 5px;
				label {
					display: flex;
					align-items: center;
					img {
						width: 24px;
						height: 24px;
						margin-right: 5px;
					}
					input {
						color: white;
						padding: 0;
						height: 24px;
					}
				}
			}

			section.actions {
				display: flex;
				flex-direction: column;
				flex-wrap: wrap;
				gap: 5px;
			}
		}
	}
    @media (max-width: 768px) {
        .users {
            flex-direction: column;
            align-items: center;

            .panel {
                width: 100%;
                padding: 0;
                margin: 0;
            }
        }
    }
</style>
