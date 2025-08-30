<script lang="ts">
	import type { SearchUser } from '$lib/API/Models/Users';
	import { SearchUsers } from '$lib/API/Users';
	import { X } from 'phosphor-svelte';
	import { onMount } from 'svelte';
	import { cubicIn } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	export let searchTerm: string = '';
	export let onSelect: (user: SearchUser | null) => void = () => {};
	let users: SearchUser[] = [];

	let inputElement: HTMLInputElement;

	let selectedUser: SearchUser | null = null;

	let mounted = false;
	let showDropdown = false;

	onMount(() => {
		mounted = true;
	});

	$: (async () => {
		if (mounted && searchTerm.trim() !== '') {
			users = await SearchUsers(searchTerm);
		} else {
			users = [];
		}
	})();

	function selectUser(user: SearchUser | null) {
		selectedUser = user;
		onSelect(user);
		searchTerm = user?.twitchUsername ?? user?.kickUsername + "";
        if(searchTerm == "undefined") searchTerm = "";
	}
</script>

<section class="search">
	{#if !selectedUser}
		<input
			type="text"
			placeholder="Search users..."
			bind:value={searchTerm}
			bind:this={inputElement}
			on:focus={() => (showDropdown = true)}
			on:blur={() => setTimeout(() => (showDropdown = false), 0)}
		/>
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
						{user.twitchUsername ?? user.kickUsername}
					</button>
				{/each}
			</section>
		{/if}
	{:else}
		<section class="selected">
			<button on:click={() => selectUser(null)}>
				<p>{selectedUser.twitchUsername ?? selectedUser.kickUsername}</p>
				<X fill="white" weight="bold" />
			</button>
		</section>
	{/if}
</section>

<style lang="scss">
	.search {
		position: relative;
		display: inline-block;
	}
	.users-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		background: #222;
		border: 1px solid #444;
		z-index: 10;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		max-height: 200px;
		overflow-y: auto;
	}

	section.selected button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 5px;
		p {
			margin: 0;
		}
	}

	button {
		width: 100%;
		background: none;
		border: none;
		text-align: center;
		color: white;

		&:hover {
			background: darken(#222, 5%);
		}
	}
</style>
