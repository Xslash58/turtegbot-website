<script lang="ts">
	import { goto } from '$app/navigation';
	import { hexToRgba } from '$lib/API/Helpers';
	import type { User } from '$lib/API/Models/Users';
	import { fade } from 'svelte/transition';
	import { Code, Gift, Hash, House, Rewind, SignOut, Wrench } from 'phosphor-svelte';
	import { hasAnyInNamespace } from '$lib/stores/permissions';
	import { Logout } from '$lib/API/Auth';
	import Button from './Button.svelte';
	import Role from './users/Role.svelte';

	const { user, onAction }: { user: User | null; onAction?: () => void } = $props();

	const roleBgColor = user?.role?.color ? hexToRgba(user?.role?.color, 0.4) : null;

	function handleClick() {
		onAction?.();
	}

	function changePage(url: string) {
		goto(url);
		handleClick();
	}

	async function handleLogout() {
		const success = await Logout();
		if (success && window && location) location.reload();
	}
</script>

<section class="mobile-nav" in:fade={{ duration: 100 }} out:fade={{ duration: 200 }}>
	<section class="top">
		{#if user}
			<section class="profile">
				<button
					onclick={() => {
						goto(`/users/${user?.id}`);
						handleClick();
					}}
				>
					<img src={user.profile_image_url} alt="profile" />
					<section class="metadata">
						<p>{user.display_name}</p>
						<Role role={user.role} />
					</section>
				</button>
			</section>
		{/if}
	</section>
	<nav>
		<Button onclick={() => changePage('/')} variant="dark">
			{#snippet icon()}
				<House weight="fill" />
			{/snippet}
			Home
		</Button>
		<Button onclick={() => changePage('/commands')} variant="dark">
			{#snippet icon()}
				<Hash weight="bold" />
			{/snippet}
			Commands
		</Button>
		<Button onclick={() => changePage('/store/redeem')} variant="dark">
			{#snippet icon()}
				<Gift weight="bold" />
			{/snippet}
			Redeem
		</Button>
		{#if import.meta.env.VITE_RECAPS == '1'}
			<Button onclick={() => changePage('/recap/2025')} class="special-event" variant="dark">
				{#snippet icon()}
					<Rewind weight="fill" />
				{/snippet}
				Recap 2025
			</Button>
		{/if}
		<Button onclick={() => changePage('/developers/docs')} variant="dark">
			{#snippet icon()}
				<Code weight="bold" />
			{/snippet}
			Developer Portal
		</Button>
		{#if $hasAnyInNamespace('moderation') || $hasAnyInNamespace('admin')}
			<Button
				onclick={() => changePage('/admin')}
				style="color: red; text-align: left;"
				variant="dark"
			>
				{#snippet icon()}
					<Wrench weight="fill" />
				{/snippet}
				Admin
			</Button>
		{/if}
		{#if user}
			<Button onclick={handleLogout} variant="dark">
				{#snippet icon()}
					<SignOut weight="fill" />
				{/snippet}
				Logout
			</Button>
		{/if}
	</nav>
</section>

<style lang="scss">
	.mobile-nav {
		position: fixed;
		top: 45px;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		background-color: #101010;

		nav {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			gap: 5px;

			:global(.btn) {
				width: 100%;
				height: 48px;
				font-size: large;
			}
		}

		.top {
			section.profile {
				button {
					width: 100%;
					display: flex;
					align-items: center;
					background: none;
					border: none;
					cursor: pointer;

					background-color: #121212;
					padding: 5px 10px;
					margin: 2px 5px;
					border-radius: 10px;

					&:hover {
						background-color: #18181885;
					}
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

	@keyframes rainbow-slide {
		0% {
			background-position: 0% 50%;
		}
		100% {
			background-position: 125% 50%;
		}
	}
</style>
