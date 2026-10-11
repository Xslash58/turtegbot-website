<script lang="ts">
	import type { User, UserPage } from '$lib/API/Models/Users';
	import { onMount } from 'svelte';

	import loadingImage from '$lib/assets/loading_texture.webp';
	import { Logout } from '$lib/API/Auth';
	import { hexToRgba } from '$lib/API/Helpers';
	import Button from '$components/Button.svelte';
	import { Gear, House, MusicNotes, Note, Plugs, Pulse, Robot, Seal, SignOut, Ticket, Wrench } from 'phosphor-svelte';
	import { page } from '$app/state';
	import { can, hasAnyInNamespace, myPermissions } from '$lib/stores/permissions';

	interface Props {
        userPage?: UserPage | null;
        user?: User | null;
        me?: User | null;
    }

	let { userPage = null, user = null, me = null }: Props = $props();

	let profileImageUrl = $derived(user?.profile_image_url || loadingImage);

	onMount(async () => {
		console.log('SideBar component mounted');
	});

	function getCategoryPath(category: string) {
		if(category === '') return `/users/${user?.id}`;
		return `/users/${user?.id}/${category}`;
	}
	async function logout() {
		const success = await Logout();
		if (success) location.reload();
	}

	function handleProfileImageError() {
		if (profileImageUrl.endsWith('/images/user-profile-pic.png'))
			// kick pfp
			profileImageUrl = 'https://kick.com/img/default-profile-pictures/default1.jpeg';
		else profileImageUrl = loadingImage;
	}
</script>

<section class="sidebar">
	<section class="user-info">
		<img src={profileImageUrl} alt="profile" onerror={handleProfileImageError} />
		<section class="user-meta">
			<h1>{user?.display_name}</h1>
			<section class="roles">
				{#if user?.roles && user.roles.length > 0}
					{#each user?.roles as role}
						<div class="role" style="background-color: {hexToRgba(role.color, 0.2)}">
							<p style="color: {hexToRgba(role.color, 1)}">{role.name}</p>
						</div>
					{/each}
				{/if}
			</section>
		</section>
	</section>

	<nav>
		{#if user}
			<Button href={getCategoryPath('')} active={page.url.pathname === getCategoryPath('')} class="side-button">
				{#snippet icon({ active })}
					<House weight={active ? 'fill' : 'regular'} />
				{/snippet}
				User Page
			</Button>
			{#if Object.keys(user?.roomIds).length > 0}
				<Button
					href={getCategoryPath('activity')}
					active={page.url.pathname === getCategoryPath('activity')}
					class="side-button"
				>
					{#snippet icon({ active })}
						<Pulse weight={active ? 'bold' : 'regular'} />
					{/snippet}
					Activity
				</Button>
			{/if}
		{/if}
		{#if user?.flags?.includes('experiment-streamelements') && (user?.id === me?.id || (userPage?.myPowers?.['TWITCH'] ?? 0) > 5 || $hasAnyInNamespace('admin.users'))}
			<Button
				href={getCategoryPath('streamelements/codes')}
				active={page.url.pathname === getCategoryPath('streamelements/codes')}
				class="side-button"
			>
				{#snippet icon({ active })}
					<Robot weight={active ? 'fill' : 'regular'} />
				{/snippet}
				StreamElements
			</Button>
		{/if}
		{#if me && user && (me?.id === user?.id || $hasAnyInNamespace('admin.users'))}
			{#if Object.keys(user?.roomIds).length > 0}
				<Button
					href={getCategoryPath('settings')}
					active={page.url.pathname === getCategoryPath('settings')}
					class="side-button"
				>
					{#snippet icon({ active })}
						<Gear weight={active ? 'fill' : 'regular'} />
					{/snippet}
					Bot Settings
				</Button>
				<Button
					href={getCategoryPath('mediarequests')}
					active={page.url.pathname === getCategoryPath('mediarequests')}
					class="side-button"
				>
					{#snippet icon({ active })}
						<MusicNotes weight={active ? 'fill' : 'regular'} />
					{/snippet}
					Media Requests
				</Button>
			{/if}
			<Button href={getCategoryPath('cosmetics')} active={page.url.pathname === getCategoryPath('cosmetics')} class="side-button">
				{#snippet icon({ active })}
					<Seal weight={active ? 'fill' : 'regular'} />
				{/snippet}
				Cosmetics
			</Button>
			<Button href={getCategoryPath('tickets')} active={page.url.pathname === getCategoryPath('tickets')} class="side-button">
				{#snippet icon({ active })}
					<Ticket weight={active ? 'fill' : 'regular'} />
				{/snippet}
				Tickets
			</Button>
			<Button
				href={getCategoryPath('reminders')}
				active={page.url.pathname === getCategoryPath('reminders')}
				class="side-button"
			>
				{#snippet icon({ active })}
					<Note weight={active ? 'fill' : 'regular'} />
				{/snippet}
				Reminders
			</Button>
			<Button
				href={getCategoryPath('connections')}
				active={page.url.pathname === getCategoryPath('connections')}
				class="side-button"
			>
				{#snippet icon({ active })}
					<Plugs weight={active ? 'fill' : 'regular'} />
				{/snippet}
				Connections
			</Button>
			{#if me?.id === user?.id}
				<Button onclick={() => logout()} class="side-button">
					{#snippet icon()}
						<SignOut />
					{/snippet}
					Logout
				</Button>
			{/if}
			{#if $can('admin.users.view')}
				<Button
					href={`/admin/users/${user?.id}`}
					class="side-button"
				>
					{#snippet icon({ active })}
						<Wrench weight={active ? 'fill' : 'regular'} />
					{/snippet}
					Admin
				</Button>
			{/if}
		{/if}
	</nav>
</section>

<style lang="scss">
	.sidebar {
		background-color: #101010;
		color: white;
		padding: 20px;
		width: 200px;
		min-height: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 50px;

		.user-info {
			text-align: center;
			margin-bottom: 20px;
			img {
				width: 80px;
				height: 80px;
				border-radius: 50%;
				margin-bottom: 10px;
			}

			h1 {
				margin: 0;
				font-size: 20px;
			}

			.roles {
				margin-top: 10px;
				text-align: center;
				display: flex;
				justify-content: center;
				flex-direction: row;
				flex-wrap: wrap;
				.role {
					background-color: rgba($color: #fff, $alpha: 0.4);
					border-radius: 10px;
					min-width: 70px;
					width: auto;
					padding: 0 10px;
					margin: 1px;
					p {
						font-size: 0.8rem;
						padding: 0.1rem;
						font-weight: 500;
						font-family: 'Inter';
						margin: 0;
					}
				}
			}
		}

		nav {
			width: 100%;
			display: flex;
			flex-direction: column;
			gap: 4px;
		}
	}

	@media (max-width: 768px) {
		.sidebar {
			width: 100%;
			padding: 0;
			gap: 0;
			
			:global(.side-button) {
				min-width: 120px;
				padding: 5px 10px;
				text-wrap: nowrap;
	
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		nav {
			flex-direction: row !important;
			flex-shrink: 0;
			overflow-x: scroll;
			gap: 5px;
			scrollbar-width: initial;

			&::-webkit-scrollbar {
				height: 6px;
			}
		}
		.user-info {
			display: flex;
			align-items: center;
			justify-content: flex-start;

			img {
				margin-bottom: 0;
				margin-right: 16px;
			}
			.user-meta {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
			}
		}
	}
</style>
