<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Backpack,
		Bed,
		Briefcase,
		DotsThree,
		Exam,
		ListMagnifyingGlass,
		Moon,
		Shower,
	} from 'phosphor-svelte';
	import type { AFK, User } from '$lib/API/Models/Users';
	import { DeleteAFK, GetAFKs, PatchAFK } from '$lib/API/Admin';
	import { confirmationDialog } from '$lib/stores/modalStore';
	import UserSearch from '$components/users/UserSearch.svelte';
	import { myUser } from '$lib/stores/userStore';
	import { AFKType } from '$lib/API/Models/Admin';
	import SearchBar from '$components/SearchBar.svelte';
	import AFKCard from '$components/admin/AFKCard.svelte';

	let me: User | null = $myUser;

	let isLoaded: boolean = $state(false);
	let afks: AFK[] = $state([]);

	let searchContent: string = $state('');
	let searchUserId: number | null = null;

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
		isLoaded = false;
		afks = await GetAFKs(searchReason, searchUserId);

		afks = [...afks];
		isLoaded = true;
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

	async function endEdit(id: number, data: AFK) {
		if (id) await updateAFK(id, null, data.reason, data.date, data.endDate, data.type);
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
		<button onclick={() => fetchAFKs(searchContent, searchUserId)} disabled={!isLoaded}>
			<ListMagnifyingGlass weight="bold" size={20} />
		</button>
	</section>
	{#if isLoaded}
		{#each afks as afk}
			<AFKCard
				data={afk}
				adminMode={true}
				onStatusChange={(id: number, isActive: boolean) => updateAFK(id, isActive)}
				onEditSave={(id: number, newData: AFK) => endEdit(id, newData)}
				onDelete={(id: number) => deleteAFK(id)}
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
