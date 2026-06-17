<script lang="ts">
	import { onMount } from 'svelte';
	import type { Ticket } from '$lib/API/Models/Users';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { DeleteTicket, GetTickets, PatchTicket } from '$lib/API/Admin';
	import { confirmationDialog } from '$lib/stores/modalStore';
	import TicketCard from '$components/users/TicketCard.svelte';

	let isLoaded: boolean = $state(false);
	let tickets: Ticket[] = $state([]);

	let showAll: boolean = $state(false);

	onMount(async () => {
		console.log('Tickets page mounted');
		await fetchTickets();
		isLoaded = true;
	});

	async function fetchTickets() {
		tickets = await GetTickets(showAll);

		tickets = [...tickets];
	}

	async function deleteTicket(id: number, force: boolean = false) {
		if (!force) {
			confirmationDialog.set({
				visible: true,
				text: `Are you sure you want to delete this ticket?
				This action is irreversible.`,
				onConfirm: async () => {
					await deleteTicket(id, true);
				}
			});
			return;
		}

		const success = await DeleteTicket(id);
		if (success) tickets = tickets.filter((ticket) => ticket.ID !== id);
	}

	async function updateTicket(id: number, approved: boolean, denied: boolean) {
		const success = await PatchTicket(id, approved, denied);
		if (success) {
			tickets = tickets.map((ticket) => {
				if (ticket.ID === id) {
					return { ...ticket, approved, denied };
				}
				return ticket;
			});
		}
	}
</script>

<section class="tickets">
	<section class="settings">
		<label>
			Show all:
			<input type="checkbox" bind:checked={showAll} onchange={fetchTickets} />
		</label>
	</section>
	{#if isLoaded}
		{#each tickets as ticket}
			<TicketCard
				data={ticket}
				adminMode={true}
				onApprove={(id) => updateTicket(id, true, false)}
				onDeny={(id) => updateTicket(id, false, true)}
				onRevert={(id) => updateTicket(id, false, false)}
				onDelete={(id) => deleteTicket(id)}
			/>
		{/each}
	{:else}
		<LoadingIndicator />
	{/if}
</section>

<style lang="scss">
	section.tickets {
		section.settings {
			background-color: #0a0a0a;
			padding: 5px 10px;
		}

		display: flex;
		justify-content: center;
		flex-direction: column;
	}
	@media (max-width: 935px) {
		section.tickets {
			section.settings {
				background: none;
			}

			flex-direction: column;
			align-items: center;
		}
	}
</style>
