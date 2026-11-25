<script lang="ts">
	import { goto } from '$app/navigation';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import type { User } from '$lib/API/Models/Users';
	import { loginModalVisible } from '$lib/stores/modalStore';
	import loadingTexture from '$lib/assets/loading_texture.webp';
	import { fade } from 'svelte/transition';
	import Button from '$components/Button.svelte';
	import { Code, Gavel, Gift, LockKey, SignOut } from 'phosphor-svelte';
	import { hexToRgba } from '$lib/API/Helpers';
	import { Logout } from '$lib/API/Auth';
	import Role from './Role.svelte';
	import Crowdin from '$components/Logo/Crowdin.svelte';
	import Github from '$components/Logo/Github.svelte';
	import { page } from '$app/state';

	let dropdownVisible: boolean = $state(false);
	let dropdownTimeout: ReturnType<typeof setTimeout> | null = $state(null);

	const buttonType = 'menu';

	let {
		user = $bindable<User | null>(null),
		isLoaded = $bindable<boolean>(false)
	}: {
		user: User | null;
		isLoaded: boolean;
	} = $props();

	let roleBgColor: string | null = $state(null);
	$effect(() => {
		roleBgColor = user?.role?.color ? hexToRgba(user?.role?.color, 0.4) : null;
	});

	function openLoginModal() {
		loginModalVisible.set(true);
	}

	async function handleLogout() {
		const success = await Logout();
		if (success) {
			dropdownVisible = false;
			if (window && location) {
				location.reload();
			}
		}
	}

	function changePage(url: string) {
		goto(getPagePath(url));
		dropdownVisible = false;
	}

	function getPagePath(category: string) {
		return category;
	}

	function openExternalLink(url: string) {
		window.open(url, '_blank');
		dropdownVisible = false;
	}

	function showDropdown() {
		if (dropdownTimeout) clearTimeout(dropdownTimeout);
		dropdownVisible = true;
	}

	function hideDropdown() {
		if (dropdownTimeout) clearTimeout(dropdownTimeout);
		dropdownTimeout = setTimeout(() => {
			dropdownVisible = false;
		}, 500);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section class="profile" onmouseenter={showDropdown} onmouseleave={hideDropdown}>
	{#if user && isLoaded}
		<button onclick={() => changePage(`/users/${user?.id}`)}>
			<p>{user.display_name}</p>
			<img src={user.profile_image_url || loadingTexture} alt="profile" />
		</button>
	{:else if !isLoaded}
		<LoadingIndicator />
	{:else}
		<button class="login-button" onclick={openLoginModal}>
			<span>Login</span>
		</button>
	{/if}
	{#if dropdownVisible}
		<section class="user-dropdown" transition:fade={{ duration: 100 }}>
			{#if user}
				<section class="profile">
					<button
						onclick={() => {
							changePage(`/users/${user?.id}`);
						}}
					>
						<img src={user.profile_image_url} alt="profile" />
						<section class="metadata">
							<p>{user.display_name}</p>
							<Role role={user.role} />
						</section>
					</button>
				</section>
				<hr />

				<Button
					variant={buttonType}
					onclick={() => changePage('/store/redeem')}
					active={page.url.pathname === getPagePath('/store/redeem')}
				>
					{#snippet icon({ active })}
						<Gift weight={active ? 'fill' : 'regular'} />
					{/snippet}
					Redeem
				</Button>

				<hr />
			{/if}

			<Button variant={buttonType} onclick={() => changePage('/developers/docs')} active={page.url.pathname === getPagePath('/developers/docs')}>
				{#snippet icon({ active })}
					<Code weight={active ? 'bold' : 'regular'} />
				{/snippet}
				Developer Portal
			</Button>

			<Button
				variant={buttonType}
				onclick={() => openExternalLink('https://github.com/Xslash58/turtegbot-website')}
				external={true}
			>
				{#snippet icon()}
					<Github />
				{/snippet}
				Github
			</Button>
			
			<Button
				variant={buttonType}
				onclick={() => openExternalLink('https://crowdin.com/project/turtegbot')}
				external={true}
			>
				{#snippet icon()}
					<Crowdin />
				{/snippet}
				Crowdin
			</Button>

			<hr />

			<Button
				variant={buttonType}
				onclick={() => changePage('/legal/privacy')}
				active={page.url.pathname === getPagePath('/legal/privacy')}
			>
				{#snippet icon({ active })}
					<LockKey weight={active ? 'fill' : 'regular'} />
				{/snippet}
				Privacy Policy
			</Button>

			<Button
				variant={buttonType}
				onclick={() => changePage('/legal/tos')}
				active={page.url.pathname === getPagePath('/legal/tos')}
			>
				{#snippet icon({ active })}
					<Gavel weight={active ? 'fill' : 'regular'} />
				{/snippet}
				Terms of Service
			</Button>

			{#if user}
				<hr />

				<Button variant={buttonType} onclick={handleLogout}>
					{#snippet icon({ active })}
						<SignOut weight={active ? 'fill' : 'regular'} />
					{/snippet}
					Logout
				</Button>
			{/if}
		</section>
	{/if}
</section>

<style lang="scss">
	hr {
		background-color: #303030;
		height: 1px;
		border: 0;
		margin: 0;
	}

	section.profile {
		position: relative;
		display: flex;
		align-items: center;
		border-radius: 10px;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;

		&:hover {
			background-color: #b9b9b92f;
		}

		.login-button {
			background-color: white;
			color: black;
			border: none;
			padding: 5px 10px;
			border-radius: 10px;
			cursor: pointer;

			font-weight: 600;

			&:hover {
				background-color: rgb(230, 230, 230);
			}
		}

		button {
			display: flex;
			align-items: center;
			background: none;
			border: none;
			cursor: pointer;
		}
		p {
			margin: 0;
			font-weight: 600;
			color: white;
		}
		img {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			margin-left: 10px;
		}

		.user-dropdown {
			position: absolute;
			top: 90%;
			right: 0;
			width: 200px;
			background-color: #101010;
			border-radius: 10px;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			margin-top: 5px;
			box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
			z-index: 1000;

			> :global(.btn:last-child) {
				border-bottom-left-radius: 10px;
				border-bottom-right-radius: 10px;
			}

			:global(.btn) {
				width: 100%;
			}

			section.profile {
				border-radius: 0;
				button {
					width: 100%;
					display: flex;
					align-items: center;
					background: none;
					border: none;
					cursor: pointer;

					padding: 5px 10px;
					margin: 2px 5px;
					border-radius: 0;
					border-radius: 10px;
				}
				p {
					margin: 0;
					font-weight: 600;
					font-size: large;
					color: white;
				}
				img {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					margin-right: 10px;
				}
			}
		}
	}

	@media (max-width: 768px) {
		section.profile {
			button:not(.login-button) {
				display: none;
			}
		}
	}
</style>
