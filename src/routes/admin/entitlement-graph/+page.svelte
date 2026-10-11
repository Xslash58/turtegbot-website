<script lang="ts">
	import EntitlementGraph from '$components/entitlements/EntitlementGraph.svelte';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import UserSearch from '$components/users/UserSearch.svelte';
	import { GetEntitlementGraph } from '$lib/API/Entitlements';
	import type { EntitlementGraphResponse } from '$lib/API/Models/Entitlements';

	let graphData: EntitlementGraphResponse | null = $state(null);
	let selectedUser: string | null = $state(null);

	async function changeUser(userId: number | null) {
		graphData = null;
		selectedUser = userId ? userId.toString() : null;
		if (userId) graphData = await GetEntitlementGraph(userId + '');
	}
</script>

<section class="entitlement-graph">
	<UserSearch onSelect={async (user) => await changeUser(user?.ID || null)} selectionMode={true} />
	{#if selectedUser}
		{#if graphData}
			<EntitlementGraph data={graphData} />
		{:else}
			<LoadingIndicator />
		{/if}
	{:else}
		<p>Please select a user to view their entitlement graph.</p>
	{/if}
</section>

<style lang="scss">
	.entitlement-graph {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-height: 0;
	}
</style>
