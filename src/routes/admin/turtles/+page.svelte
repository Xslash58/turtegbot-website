<script lang="ts">
	import { onMount } from 'svelte';
	import { Trash } from 'phosphor-svelte';
	import type { SearchUser } from '$lib/API/Models/Users';
	import LoadingIndicator from '../../../components/LoadingIndicator.svelte';
	import { formatDate } from '$lib/Utilities';
	import {
		GetTurtles,
	} from '$lib/API/Admin';
	import UserComponent from '../../../components/users/UserComponent.svelte';
	import UserSearch from '../../../components/users/UserSearch.svelte';
	import type { TurtleData, TurtleDataRank } from '$lib/API/Models/Turtles';

	let isLoaded: boolean = $state(false);
	let turtles: TurtleDataRank[] = $state([]);
	let filteredTurtles: TurtleDataRank[] = $state([]);

	onMount(async () => {
		console.log('Turtles page mounted');
		await fetchTurtles();
        filteredTurtles = turtles;
		isLoaded = true;
	});

	async function fetchTurtles() {
		turtles = await GetTurtles();

        turtles.map((turtle, index) => {
            turtle.rank = index + 1;
        });

		turtles = [...turtles];
	}

    async function searchByUser(user: SearchUser | null) {
        if(user == null) {
            filteredTurtles = turtles;
            return;
        }

        filteredTurtles = turtles.filter(turtle => {
            return turtle.user.ID == user.ID;
        });
    }
</script>

<section class="tickets">
	<section class="settings">
		<label>
			User: <UserSearch onSelect={(user) => searchByUser(user)} />
		</label>
	</section>
	{#if isLoaded}
		<table>
			<thead>
				<tr>
					<th>ID</th>
                    <th>Rank</th>
					<th>User</th>
					<th>Turtles</th>
					<th>lastCollect</th>
					<th>nextCollect</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredTurtles as turtle}
					<tr>
						<td>{turtle.ID}</td>
                        <td>{turtle.rank}</td>
						<td><UserComponent userId={turtle.user.ID} username={turtle.user.twitchUsername ?? turtle.user.kickUsername} /></td>
						<td>{turtle.turtles}</td>
						<td>{formatDate(turtle.lastCollect)}</td>
						<td>{formatDate(turtle.nextCollect)}</td>
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

			th {
				background-color: #101010;
				font-weight: bold;
			}
		}
	}
	@media (max-width: 880px) {
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
				}
			}
		}
	}
</style>
