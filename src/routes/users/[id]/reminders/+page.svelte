<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import LoadingIndicator from '../../../../components/LoadingIndicator.svelte';
	import type { Reminder } from '$lib/API/Models/Users';
	import { DeleteReminder, GetReminders } from '$lib/API/Users';

	import kickLogo from '$lib/assets/KickLogo.svg';
	import twitchLogo from '$lib/assets/glitch_flat_white.svg';
	import { Trash } from 'phosphor-svelte';

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
		if (success)
			reminders = reminders.filter(reminder => reminder.id !== id);
	}

	function formatDate(dateStr: Date) {
		const date = new Date(dateStr);
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
	}
</script>

<section class="reminders">
	{#if isLoaded}
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Platform</th>
					<th>Target</th>
					<th>Message</th>
					<th>Channel</th>
					<th>Created At</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each reminders as reminder}
					<tr>
						<td>{reminder.id}</td>
						<td id="platform">
							{#if reminder.platform === 'KICK'}
								<img src={kickLogo} alt="Kick Logo" />
							{:else if reminder.platform === 'TWITCH'}
								<img src={twitchLogo} alt="Twitch Logo" />
							{:else}
								{reminder.platform}
							{/if}
						</td>
						<td>{reminder.username}</td>
						<td class="content">{reminder.content}</td>
						<td>{reminder.channel}</td>
						<td>{formatDate(reminder.date)}</td>
						<td>
							<button>
								<Trash onclick={() => deleteReminder(reminder.id)} color="red" size={24} />
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
	section.reminders {
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

			td#platform {
				img {
					width: 24px;
					height: 24px;
					vertical-align: middle;
				}
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
			}

			th {
				background-color: #101010;
				font-weight: bold;
			}
		}
	}
	@media (max-width: 768px) {
		section.reminders {
			flex-direction: column;
			align-items: center;

			table {
				width: 100%;
				th, td {
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