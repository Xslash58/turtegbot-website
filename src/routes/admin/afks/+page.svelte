<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Backpack,
		Bed,
		Briefcase,
		Check,
		DotsThree,
		Exam,
		Lightning,
		LightningSlash,
		Moon,
		NotePencil,
		Shower,
		Trash
	} from 'phosphor-svelte';
	import type { AFK, Reminder, User } from '$lib/API/Models/Users';
	import LoadingIndicator from '../../../components/LoadingIndicator.svelte';
	import { formatDate } from '$lib/Utilities';
	import { DeleteAFK, GetAFKs, PatchAFK } from '$lib/API/Admin';
	import UserComponent from '../../../components/users/UserComponent.svelte';
	import { confirmationDialog } from '$lib/stores/modalStore';
	import UserSearch from '../../../components/users/UserSearch.svelte';
	import { myUser } from '$lib/stores/userStore';
	import { AFKType } from '$lib/API/Models/Admin';

	let me: User | null = $myUser;

	let isLoaded: boolean = $state(false);
	let afks: AFK[] = $state([]);

	let searchContent: string = $state('');
	let searchUserId: number | null = null;

	let editableAFKId: number | null = $state(null);
	let editableAFKReason: string | null = $state(null);
	let editableAFKDate: string | null = $state(null);
	let editableAFKEndDate: string | null = $state(null);
	let editableAFKType: AFKType | null = $state(null);

	let typeIcons: Record<AFKType, typeof DotsThree> = {
		[AFKType.NORMAL]: DotsThree,
		[AFKType.SLEEP]: Bed,
		[AFKType.SHOWER]: Shower,
		[AFKType.SCHOOL]: Backpack,
		[AFKType.STUDY]: Exam,
		[AFKType.WORK]: Briefcase,
		[AFKType.NAP]: Moon
	};

	onMount(async () => {
		console.log('AFKs page mounted');
		await fetchAFKs();
		isLoaded = true;
	});

	async function fetchAFKs(searchReason?: string, searchUserId?: number | null) {
		afks = await GetAFKs(searchReason, searchUserId);

		afks = [...afks];
	}

	async function deleteAFK(id: number, force: boolean = false) {
		if (!force) {
			confirmationDialog.set({
				visible: true,
				text: `Are you sure you want to delete this AFK?
                Consider marking it as inactive instead.
				This action is irreversible.`,
				onConfirm: async () => {
					await deleteAFK(id, true);
				}
			});
			return;
		}

		const success = await DeleteAFK(id);
		if (success) afks = afks.filter((afk) => afk.ID !== id);
	}

	async function updateAFK(
		id: number,
		isActive?: boolean | null,
		reason?: string | null,
		date?: string | null,
		endDate?: string | null,
		type?: AFKType | null
	) {
		const success = await PatchAFK(id, isActive, reason, date, endDate, type);
		if (success) {
			afks = afks.map((afk) => {
				if (afk.ID === id) {
					return {
						ID: afk.ID,
						userId: afk.userId,
						username: afk.username,
						reason: reason ?? afk.reason,
						date: date ? date : afk.date,
						endDate: endDate ? endDate : afk.endDate,
						type: type ?? afk.type,
						isActive: isActive ?? afk.isActive
					};
				}
				return afk;
			});
		}
	}

	function toggleEdit(afk: AFK) {
		console.log(afk.endDate);
		editableAFKId = afk.ID;
		editableAFKReason = afk.reason;
		editableAFKDate = afk.date.toString().slice(0, 16);
		editableAFKEndDate = afk.endDate ? afk.endDate.toString().slice(0, 16) : null;
		editableAFKType = afk.type;
	}
	async function endEdit() {
		if (editableAFKDate && !editableAFKDate?.endsWith('Z')) editableAFKDate += 'Z';
		if (editableAFKEndDate && !editableAFKEndDate?.endsWith('Z')) editableAFKEndDate += 'Z';
		if (editableAFKId)
			await updateAFK(
				editableAFKId,
				null,
				editableAFKReason,
				editableAFKDate,
				editableAFKEndDate,
				editableAFKType
			);
		editableAFKId = null;
	}
</script>

<section class="tickets">
	<section class="settings">
		<label>
			User: <UserSearch onSelect={(user) => (searchUserId = user?.ID ?? null)} />
		</label>
		<label>
			Search: <input type="text" placeholder="Search..." bind:value={searchContent} />
		</label>
		<button onclick={() => fetchAFKs(searchContent, searchUserId)}> Search / Refetch </button>
	</section>
	{#if isLoaded}
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>User</th>
					<th>Reason</th>
					<th>Date</th>
					<th>End Date</th>
					<th>Type</th>
					<th>Status</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each afks as afk}
					{@const TypeIcon = typeIcons[afk.type as AFKType]}
					<tr>
						<td>{afk.ID}</td>
						<td><UserComponent userId={afk.userId} username={afk.username} /></td>
						{#if editableAFKId != afk.ID}
							<td class="content">{afk.reason}</td>
							<td>{formatDate(afk.date)}</td>
							<td>
								{#if afk.endDate}
									{formatDate(afk.endDate)}
								{:else}
									None
								{/if}
							</td>
							<td>
								<TypeIcon color="white" weight="bold" size={24} />
							</td>
						{:else}
							<td class="content"><textarea bind:value={editableAFKReason}></textarea></td>
							<td><input type="datetime-local" bind:value={editableAFKDate} /></td>
							<td><input type="datetime-local" bind:value={editableAFKEndDate} /></td>
							<td>
								<select bind:value={editableAFKType}>
									{#each Object.entries(AFKType) as [key, value]}
										{#if !isNaN(Number(value))}
											<option {value} selected={value === afk.type}>
												{key}
											</option>
										{/if}
									{/each}
								</select>
							</td>
						{/if}

						<td>
							{#if afk.isActive}
								<Lightning color="white" weight="bold" size={24} />
							{:else}
								<LightningSlash color="white" weight="bold" size={24} />
							{/if}
						</td>
						<td class="actions">
							{#if !afk.isActive}
								<button onclick={() => updateAFK(afk.ID, true)}>
									<Lightning color="green" weight="fill" size={24} />
								</button>
							{:else}
								<button onclick={() => updateAFK(afk.ID, false)}>
									<LightningSlash color="red" weight="fill" size={24} />
								</button>
							{/if}
							{#if editableAFKId === afk.ID}
								<button onclick={() => endEdit()}>
									<Check color="green" weight="fill" size={24} />
								</button>
							{:else}
								<button onclick={() => toggleEdit(afk)}>
									<NotePencil color="white" weight="fill" size={24} />
								</button>
							{/if}
							{#if me && me.role.power >= 10}
								<button onclick={() => deleteAFK(afk.ID)}>
									<Trash color="red" weight="fill" size={24} />
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

				textarea {
					width: 100%;
					height: 60px;
					resize: vertical;
					background-color: transparent;
					border: 1px solid #333;
					color: white;
					padding: 5px;
					box-sizing: border-box;
					font-family: inherit;
					font-size: inherit;
				}
				input[type='datetime-local'] {
					width: 100%;
					padding: 5px;
					box-sizing: border-box;
					background-color: #1a1a1a;
					border: 1px solid #333;
					color: white;
				}
				select {
					width: 100%;
					padding: 5px;
					box-sizing: border-box;
					background-color: #1a1a1a;
					border: 1px solid #333;
					color: white;
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
