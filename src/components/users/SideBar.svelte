<script lang="ts">
	import { goto } from '$app/navigation';
	import type { User, UserPage } from '$lib/API/Models/Users';
	import { onMount } from 'svelte';

	import loadingImage from '$lib/assets/loading_texture.webp';
	import { Logout } from '$lib/API/Auth';
	import { hexToRgba } from '$lib/API/Helpers';

	export let userPage: UserPage | null;
	export let user: User | null;
	export let me: User | null;

	let profileImageUrl: string = loadingImage;
	$: profileImageUrl = user?.profile_image_url || loadingImage;

	$: roleBgColor = user?.role?.color ? hexToRgba(user?.role?.color, 0.4) : null;

	onMount(async () => {
		console.log('SideBar component mounted');
	});

	function gotoCategory(category: string) {
		goto(`/users/${user?.id}/${category}`);
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
		<img src={profileImageUrl} alt="profile" on:error={handleProfileImageError} />
		<section class="user-meta">
			<h1>{user?.display_name}</h1>
			<section class="roles">
				{#if user?.role.name}
					<section class="role" style="background-color: {roleBgColor};">
						<p>{user?.role.name}</p>
					</section>
				{/if}
			</section>
		</section>
	</section>
	
	<nav>
		{#if user}
		<button on:click={() => gotoCategory(``)}>User Page</button>
		{/if}
		{#if user?.flags?.includes('experiment-streamelements')
		&& (user?.id === me?.id || (userPage?.myPowers?.["TWITCH"] ?? 0) > 5 || (me?.role.power ?? 0) > 10)}
			<button on:click={() => gotoCategory(`streamelements`)}>StreamElements</button>
		{/if}
		{#if me && user && (me?.id === user?.id || me.role.power >= 5)}
			{#if Object.keys(user?.roomIds).length > 0}
				<button on:click={() => gotoCategory(`settings`)}>Bot Settings</button>
				<button on:click={() => gotoCategory(`activity`)}>Bot Activity</button>
			{/if}
			<button on:click={() => gotoCategory(`tickets`)}>Tickets</button>
			<button on:click={() => gotoCategory(`reminders`)}>Reminders</button>
			<button on:click={() => gotoCategory(`connections`)}>Connections</button>
			{#if me?.id === user?.id}
				<button class="logout" on:click={() => logout()}>Logout</button>
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
				text-align: center;
				display: inline-block;
				.role {
					background-color: rgba($color: #fff, $alpha: 0.4);
					border-radius: 10px;
					width: 70px;
					padding: 0 10px;
					p {
						font-size: 0.9rem;
						padding: 0.1rem;
					}
				}
			}
		}

		button {
			background-color: #33ca00;
			color: white;
			border: none;
			border-radius: 10px;
			padding: 10px 15px;
			cursor: pointer;
			margin-bottom: 10px;

			&:hover {
				background-color: #28a300;
			}

			&:disabled {
				background-color: #555;
				cursor: not-allowed;
			}
		}

		nav {
			width: 100%;
			display: flex;
			flex-direction: column;
		}

		.logout {
			background-color: #ff0000;

			&:hover {
				background-color: #cc0000;
			}
		}
	}

	@media (max-width: 768px) {
		.sidebar {
			width: 100%;
			padding: 0;
			gap: 0;
		}
		button {
			min-width: 120px;
			padding: 5px 0 !important;

			display: flex;
			justify-content: center;
			align-items: center;
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
