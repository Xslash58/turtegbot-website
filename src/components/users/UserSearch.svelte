<script lang="ts">
	import type { SearchUser } from '$lib/API/Models/Users';
	import { SearchUsers } from '$lib/API/Users';
	import { MagnifyingGlass, X } from 'phosphor-svelte';
	import { onMount } from 'svelte';
	import { cubicIn } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import loadingTexture from '$lib/assets/loading_texture.webp';
	import LoadingIndicator from '../LoadingIndicator.svelte';

	export let searchTerm: string = '';
	export let onSelect: (user: SearchUser | null) => void = () => {};
	export let onFocusOut: () => void = () => {};
	export let selectionMode = false;
	export let autoFocus = false;

	let users: SearchUser[] = [];

	let inputElement: HTMLInputElement;

	let selectedUser: SearchUser | null = null;

	let mounted = false;
	let showDropdown = false;
	let isLoading = false;
	let timeout: number | null = null;

	onMount(() => {
		mounted = true;
	});

	$: (async () => {
		if (mounted && searchTerm.trim() !== '') {
			search(searchTerm);
		} else {
			users = [];
		}
	})();

	function selectUser(user: SearchUser | null) {
		selectedUser = user;
		onSelect(user);
		if (selectionMode) searchTerm = user?.twitchUsername ?? user?.kickUsername + '';
		if (searchTerm == 'undefined' || !selectionMode) searchTerm = '';
		if (inputElement) inputElement.blur();
	}

	function search(query: string) {
		if (timeout) clearTimeout(timeout);

		isLoading = true;
		timeout = setTimeout(async () => {
			users = await SearchUsers(query);
			isLoading = false;
		}, 300);
	}
</script>

<section class="search">
	{#if !selectedUser || !selectionMode}
		<section class="search-bar" class:dropdown-visible={users.length > 0 && showDropdown}>
			<section class="icon">
				{#if isLoading}
					<LoadingIndicator size={12} />
				{:else}
					<MagnifyingGlass fill="white" weight="bold" />
				{/if}
			</section>
			<!-- svelte-ignore a11y_autofocus -->
			<input
				type="text"
				placeholder="Search users..."
				bind:value={searchTerm}
				bind:this={inputElement}
				on:focus={() => (showDropdown = true)}
				on:blur={() => setTimeout(() => (showDropdown = false), 0)}
				on:focusout={onFocusOut}
				bind:focused={autoFocus}
				autofocus={autoFocus}
			/>
		</section>
		{#if users.length > 0 && showDropdown}
			<section class="users-dropdown" transition:fade={{ duration: 100, easing: cubicIn }}>
				{#each users as user}
					<button
						on:mousedown={(e) => {
							e.preventDefault();
							selectUser(user);
						}}
						style="cursor:pointer;"
					>
						<img
							src={user.profile?.profile_image_url ?? loadingTexture}
							alt=""
							width="24"
							height="24"
							style="border-radius: 50%; margin-right: 8px;"
						/>
						{user.profile?.display_name ?? user.twitchUsername ?? user.kickUsername}
					</button>
				{/each}
			</section>
		{/if}
	{:else if selectionMode}
		<section class="search-bar">
			<button class="fake-cover" on:click={() => selectUser(null)} aria-label="Clear result"></button>
			<section class="icon">
				<X fill="white" weight="bold" />
			</section>
			<input
				type="text" value={selectedUser.twitchUsername ?? selectedUser.kickUsername}
				readonly
				disabled />
		</section>
	{/if}
</section>

<style lang="scss">
	.search-bar {
		display: flex;
		align-items: center;
		gap: 5px;
		background: #0c0c0c;
		padding: 5px 10px;
		border-radius: 4px;

		&.dropdown-visible {
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}

		.icon {
			width: 16px;
			height: 16px;
		}

		input {
			background: transparent;
			border: none;
			color: white;
			width: 200px;

			&::placeholder {
				color: #888;
			}

			&:focus {
				outline: none;
			}
		}

		p {
			margin: 0;
			width: 200px;
		}

		button {
			background: none;
			border: none;
			width: 16px;
			height: 16px;
			padding: 0;

			display: flex;
			justify-content: center;
			align-items: center;
		}
		button.fake-cover {
			background-color: none;
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
		}
	}

	.search {
		position: relative;
		display: inline-block;
	}
	.users-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		background: #0c0c0c;
		z-index: 10;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		max-height: 200px;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.users-dropdown button {
		width: 100%;
		min-height: 24px;
		background: none;
		border: none;
		text-align: center;
		color: white;

		display: flex;
		align-items: center;
		justify-content: center;

		padding: 7px 0;
		position: relative;

		img {
			position: absolute;
			left: 12px;
		}

		&:hover {
			background: darken(#222, 5%);
		}
	}
</style>
