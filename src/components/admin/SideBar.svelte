<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Button from '$components/Button.svelte';
	import { can } from '$lib/stores/permissions';
	import {
		Coins,
		Gift,
		Graph,
		House,
		Moon,
		Note,
		Ticket,
		User,
		Users,
		Wrench
	} from 'phosphor-svelte';
	import { onMount } from 'svelte';

	onMount(async () => {
		console.log('SideBar component mounted');
	});

	function getCategoryPath(category: string) {
		if (category === '') return `/admin`;
		return `/admin/${category}`;
	}
</script>

<section class="sidebar">
	<nav>
		<Button
			href={getCategoryPath('')}
			active={page.url.pathname === getCategoryPath('')}
			class="side-button"
		>
			{#snippet icon({ active })}
				<House weight={active ? 'fill' : 'regular'} />
			{/snippet}
			Home
		</Button>
		{#if $can('admin.tickets.view')}
			<Button
				href={getCategoryPath('tickets')}
				active={page.url.pathname === getCategoryPath('tickets')}
				class="side-button"
			>
				{#snippet icon({ active })}
					<Ticket weight={active ? 'fill' : 'regular'} />
				{/snippet}
				Tickets
			</Button>
		{/if}
		{#if $can('admin.reminders.view')}
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
		{/if}
		{#if $can('admin.afks.view')}
			<Button
				href={getCategoryPath('afks')}
				active={page.url.pathname === getCategoryPath('afks')}
				class="side-button"
			>
				{#snippet icon({ active })}
					<Moon weight={active ? 'fill' : 'regular'} />
				{/snippet}
				AFKs
			</Button>
		{/if}
		{#if $can('admin.turtles.view')}
			<Button
				href={getCategoryPath('turtles')}
				active={page.url.pathname === getCategoryPath('turtles')}
				class="side-button"
			>
				{#snippet icon({ active })}
					<Coins weight={active ? 'fill' : 'regular'} />
				{/snippet}
				Turtles
			</Button>
		{/if}
		{#if $can('admin.entitlements.view')}
			<Button
				href={getCategoryPath('entitlement-graph')}
				active={page.url.pathname === getCategoryPath('entitlement-graph')}
				class="side-button"
			>
				{#snippet icon({ active })}
					<Graph weight={active ? 'fill' : 'regular'} />
				{/snippet}
				Entitlement Graph
			</Button>
		{/if}
		{#if $can('admin.codes.view')}
			<Button
				href={getCategoryPath('codes')}
				active={page.url.pathname === getCategoryPath('codes')}
				class="side-button"
			>
				{#snippet icon({ active })}
					<Gift weight={active ? 'fill' : 'regular'} />
				{/snippet}
				Codes
			</Button>
		{/if}
		{#if $can('admin.users.view')}
			<Button
				href={getCategoryPath('users')}
				active={page.url.pathname.startsWith(getCategoryPath('users'))}
				class="side-button"
			>
				{#snippet icon({ active })}
					<Users weight={active ? 'fill' : 'regular'} />
				{/snippet}
				Users
			</Button>
		{/if}
		{#if $can('admin.maintenance.view')}
			<Button
				href={getCategoryPath('maintenance')}
				active={page.url.pathname === getCategoryPath('maintenance')}
				class="side-button"
			>
				{#snippet icon({ active })}
					<Wrench weight={active ? 'fill' : 'regular'} />
				{/snippet}
				Maintenance
			</Button>
		{/if}
	</nav>
</section>

<style lang="scss">
	.sidebar {
		position: sticky;
		top: 0;

		background-color: #101010;
		color: white;
		padding: 20px;
		width: 200px;
		min-height: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 100px;

		nav {
			gap: 5px;
		}

		nav {
			width: 100%;
			display: flex;
			flex-direction: column;
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
	}
</style>
