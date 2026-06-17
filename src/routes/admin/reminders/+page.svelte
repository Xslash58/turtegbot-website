<script lang="ts">
	import { onMount } from 'svelte';
	import { ListMagnifyingGlass } from 'phosphor-svelte';
	import type { Reminder, User } from '$lib/API/Models/Users';
	import { DeleteReminder, GetReminders, PatchReminder } from '$lib/API/Admin';
	import { confirmationDialog } from '$lib/stores/modalStore';
	import UserSearch from '$components/users/UserSearch.svelte';
	import { myUser } from '$lib/stores/userStore';
	import SearchBar from '$components/SearchBar.svelte';
	import ReminderCard from '$components/users/ReminderCard.svelte';

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
		<button onclick={() => fetchReminders(searchContent, searchUserId)} disabled={!isLoaded}>
			<ListMagnifyingGlass weight="bold" size={20} />
		</button>
	</section>
	{#if isLoaded}
		{#each reminders as reminder}
			<ReminderCard
				data={reminder}
				adminMode={true}
				onDelete={(id: number) => deleteReminder(id)}
				onStatusChange={updateReminder}
			/>
		{/each}
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
	}
	@media (max-width: 1516px) {
		section.tickets {
			section.settings {
				background: none;
			}

			flex-direction: column;
			align-items: center;
		}
	}
</style>
