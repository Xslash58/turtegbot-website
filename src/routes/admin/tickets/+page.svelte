<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ArrowCounterClockwise,
		Check,
		DotsThree,
		Lightbulb,
		Trash,
		Warning,
		X
	} from 'phosphor-svelte';
	import type { Ticket } from '$lib/API/Models/Users';
	import LoadingIndicator from '../../../components/LoadingIndicator.svelte';
	import { formatDate } from '$lib/Utilities';
	import { DeleteTicket, GetTickets, PatchTicket } from '$lib/API/Admin';
	import UserComponent from '../../../components/users/UserComponent.svelte';
	import { confirmationDialog } from '$lib/stores/modalStore';

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
		if(!force) {
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
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Username</th>
					<th>Message</th>
					<th>Type</th>
					<th>Status</th>
					<th>Created At</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each tickets as ticket}
					<tr>
						<td>{ticket.ID}</td>
						<td><UserComponent userId={ticket.userId} username={ticket.username} /></td>
						<td class="content">{ticket.message}</td>
						<td>
							{#if ticket.type == 1}
								<Lightbulb color="white" size={24} />
							{:else if ticket.type == 0}
								<Warning color="white" size={24} />
							{:else}
								{ticket.type}
							{/if}
						</td>
						<td>
							{#if ticket.approved}
								<Check color="green" weight="bold" size={24} />
							{:else if ticket.denied}
								<X color="red" weight="bold" size={24} />
							{:else}
								<DotsThree color="white" weight="bold" size={24} />
							{/if}
						</td>
						<td>{formatDate(ticket.date)}</td>
						<td class="actions">
							{#if !ticket.approved && !ticket.denied}
								<button onclick={() => updateTicket(ticket.ID, true, false)}>
									<Check color="green" weight="fill" size={24} />
								</button>
								<button onclick={() => updateTicket(ticket.ID, false, true)}>
									<X color="red" weight="fill" size={24} />
								</button>
								<button onclick={() => deleteTicket(ticket.ID)}>
									<Trash color="red" weight="fill" size={24} />
								</button>
							{:else}
								<button onclick={() => updateTicket(ticket.ID, false, false)}>
									<ArrowCounterClockwise color="aqua" weight="fill" size={24} />
								</button>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
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

		table {
			width: 100%;
			border-collapse: collapse;

			th,
			td {
				padding: 12px 15px;
				border: 1px solid #ddd;
				text-align: center;
			}

			td {
				&.actions {
					min-width: 100px;
					button {
						margin: 0 2px;
					}
				}
				&.content {
					text-align: left;
				}
			}

			button {
				background: none;
				border: none;
				cursor: pointer;
				padding: 0;
				margin: 0;
				transition: transform 0.1s;
				&:hover {
					transform: scale(1.15);
				}
				&:disabled {
					cursor: not-allowed;
					opacity: 0.25;
					transform: scale(1);
				}
			}

			th {
				background-color: #101010;
				font-weight: bold;
			}
		}
	}
	@media (max-width: 935px) {
		section.tickets {
			section.settings {
				background: none;
			}

			flex-direction: column;
			align-items: center;

			table {
				width: 100%;
				th,
				td {
					border: 1px solid rgba(221, 221, 221, 0.45);
				}
				tr {
					display: flex;
					flex-direction: column;
					border: 2px solid #ddd;
					text-align: center;

					td.content {
						text-align: left;
						white-space: normal;
						overflow-wrap: anywhere;
					}
				}
			}
		}
	}
</style>
