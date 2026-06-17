<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import type { Reminder } from '$lib/API/Models/Users';
	import { DeleteReminder, GetReminders } from '$lib/API/Users';
	import ReminderCard from '$components/users/ReminderCard.svelte';

	let userId: string = $state(page.params.id || '');
	let isLoaded: boolean = $state(false);
	let reminders: Reminder[] = $state([]);

	onMount(async () => {
		console.log('Reminders page mounted for user:', userId);
		await fetchReminders();
		isLoaded = true;
	});

	async function fetchReminders() {
		reminders = await GetReminders(userId);
	}

	async function deleteReminder(id: number) {
		const success = await DeleteReminder(userId, id);
		if (success) reminders = reminders.filter((reminder) => reminder.id !== id);
	}
</script>

<section class="reminders">
	{#if isLoaded}
		{#each reminders as reminder}
			<ReminderCard data={reminder} onDelete={(id: number) => deleteReminder(id)} />
		{/each}
	{:else}
		<LoadingIndicator />
	{/if}
</section>

<style lang="scss">
	section.reminders {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}
	@media (max-width: 768px) {
		section.reminders {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
