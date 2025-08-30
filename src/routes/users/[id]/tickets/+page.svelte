<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import LoadingIndicator from '../../../../components/LoadingIndicator.svelte';
	import { Check, DotsThree, Lightbulb, Trash, Warning, X } from 'phosphor-svelte';
	import { DeleteTicket, GetTickets } from '$lib/API/Users';
	import type { Ticket } from '$lib/API/Models/Users';
	import { formatDate } from '$lib/Utilities';

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
			tickets = tickets.filter(ticket => ticket.ID !== id);
		}
	}
</script>

<section class="tickets">
	{#if isLoaded}
		<table>
			<thead>
				<tr>
					<th>Ticket ID</th>
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
						<td>
							<button disabled={ticket.approved || ticket.denied} onclick={() => deleteTicket(ticket.ID)}>
								<Trash color="red" size={24} />
							</button>
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
		display: flex;
		justify-content: center;

		table {
			width: 100%;
			border-collapse: collapse;

			th,
			td {
				padding: 12px 15px;
				border: 1px solid #ddd;
				text-align: center;
			}

			td.content {
				text-align: left;
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
	@media (max-width: 768px) {
		section.tickets {
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
