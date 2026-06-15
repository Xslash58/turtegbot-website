<script lang="ts">
	import { onMount } from 'svelte';
	import { Clock, Eye, EyeClosed, Lightning, ListMagnifyingGlass, Trash } from 'phosphor-svelte';
	import type { Reminder, User } from '$lib/API/Models/Users';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { formatDate } from '$lib/Utilities';
	import {
		DeleteReminder,
		GetReminders,
		PatchReminder,
	} from '$lib/API/Admin';
	import UserComponent from '$components/users/UserComponent.svelte';
	import { confirmationDialog } from '$lib/stores/modalStore';
	import UserSearch from '$components/users/UserSearch.svelte';
	import { myUser } from '$lib/stores/userStore';
	import SearchBar from '$components/SearchBar.svelte';

	let me: User | null = $myUser;

	let isLoaded: boolean = $state(false);
	let reminders: Reminder[] = $state([]);

	let searchContent: string = $state('');
	let searchUserId: number | null = null;

	onMount(async () => {
		console.log('Reminders page mounted');
		await fetchReminders();
	});

	async function fetchReminders(searchContent?: string, searchUserId?: number | null) {
		isLoaded = false;
		reminders = await GetReminders(searchContent, searchUserId);

		reminders = [...reminders];
		isLoaded = true;
	}

	async function deleteReminder(id: number, force: boolean = false) {
		if (!force) {
			confirmationDialog.set({
				visible: true,
				text: `Are you sure you want to delete this reminder?
                Consider marking it as viewed instead.
				This action is irreversible.`,
				onConfirm: async () => {
					await deleteReminder(id, true);
				}
			});
			return;
		}

		const success = await DeleteReminder(id);
		if (success) reminders = reminders.filter((reminder) => reminder.id !== id);
	}

	async function updateReminder(id: number, isViewed: boolean) {
		const success = await PatchReminder(id, isViewed);
		if (success) {
			reminders = reminders.map((reminder) => {
				if (reminder.id === id) {
					return { ...reminder, isViewed };
				}
				return reminder;
			});
		}
	}
</script>

<section class="tickets">
	<section class="settings">
		<label>
			<UserSearch onSelect={(user) => (searchUserId = user?.ID ?? null)} selectionMode={true} />
		</label>
		<label>
			<SearchBar placeholder="Search..." bind:searchTerm={searchContent} isLoading={!isLoaded} />
		</label>
		<button onclick={() => fetchReminders(searchContent, searchUserId)} disabled={!isLoaded}> <ListMagnifyingGlass weight="bold" size={20} /> </button>
	</section>
	{#if isLoaded}
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Target</th>
					<th>Message</th>
					<th>Author</th>
					<th>Channel</th>
					<th>Type</th>
					<th>Status</th>
					<th>Created At</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each reminders as reminder}
					<tr>
						<td>{reminder.id}</td>
						<td><UserComponent userId={reminder.userId} username={reminder.username} /></td>
						<td class="content">{reminder.content}</td>
						<td><UserComponent userId={reminder.authorId} username={reminder.author} /></td>
						<td>{reminder.channel}</td>
						<td>
							{#if reminder.isInstant}
								<Lightning color="white" size={24} />
							{:else}
								<Clock color="white" size={24} />
							{/if}
						</td>
						<td>
							{#if reminder.isViewed}
								<Eye color="white" weight="bold" size={24} />
							{:else}
								<EyeClosed color="white" weight="bold" size={24} />
							{/if}
						</td>
						<td>{formatDate(reminder.date)}</td>
						<td class="actions">
							{#if !reminder.isViewed}
								<button onclick={() => updateReminder(reminder.id, true)}>
									<Eye color="green" weight="fill" size={24} />
								</button>
							{:else}
								<button onclick={() => updateReminder(reminder.id, false)}>
									<EyeClosed color="red" weight="fill" size={24} />
								</button>
							{/if}
							{#if me && me.role.power >= 10}
								<button onclick={() => deleteReminder(reminder.id)}>
									<Trash color="red" weight="fill" size={24} />
								</button>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</section>

<style lang="scss">
	section.tickets {
		section.settings {
			background-color: #0a0a0a;
			padding: 5px 10px;

			display: flex;
			flex-direction: row;
			align-items: center;
			flex-wrap: wrap;
			gap: 5px;

			button {
				color: white;
				background: none;
				border: none;
				cursor: pointer;
				padding: 0;
				margin-left: 5px;
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
	@media (max-width: 1516px) {
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
