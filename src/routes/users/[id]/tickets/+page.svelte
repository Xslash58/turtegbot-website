<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { DeleteTicket, GetTickets } from '$lib/API/Users';
	import type { Ticket } from '$lib/API/Models/Users';
	import TicketCard from '$components/users/TicketCard.svelte';

	let userId: string = $state(page.params.id || '');
	let isLoaded: boolean = $state(false);
	let tickets: Ticket[] = $state([]);

	onMount(async () => {
		console.log('Tickets page mounted for user:', userId);
		await fetchTickets();
		isLoaded = true;
	});

	async function fetchTickets() {
		tickets = await GetTickets(userId);
	}

	async function deleteTicket(id: number) {
		const success = await DeleteTicket(userId, id);
		if (success) {
			tickets = tickets.filter((ticket) => ticket.ID !== id);
		}
	}
</script>

<section class="tickets">
	{#if isLoaded}
		{#each tickets as ticket}
			<TicketCard data={ticket} onDelete={(id) => deleteTicket(id)} />
		{/each}
	{:else}
		<LoadingIndicator />
	{/if}
</section>

<style lang="scss">
	section.tickets {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}
	@media (max-width: 768px) {
		section.tickets {
			align-items: center;
		}
	}
</style>
