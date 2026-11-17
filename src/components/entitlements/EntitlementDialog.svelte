<script lang="ts">
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import {
		AddEntitlementEdge,
		GetEntitlementGraph,
		GetEntitlementGraphForEntitlement,
		GetEntitlementsCatalog,
		GrantEntitlement,
		RemoveEntitlementEdge,
		RevokeEntitlement
	} from '$lib/API/Entitlements';
	import type { Entitlement, EntitlementGraphResponse } from '$lib/API/Models/Entitlements';
	import type { User } from '$lib/API/Models/Users';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import EntitlementGraph from './EntitlementGraph.svelte';
	import Button from '$components/Button.svelte';
	import { Minus, Plus } from 'phosphor-svelte';
	import { can } from '$lib/stores/permissions';
	import Select from '$components/Select.svelte';
	import Radio from '$components/Radio.svelte';

	let entitlementsCatalog: Entitlement[] = $state([]);
	let entitlementKinds: string[] = $state([]);

	let availableEntitlementOptions: Entitlement[] = $state([]);
	let selectedEntitlementId: string = $state('');

	let isVisible: boolean = $state(false);
	let isLoading: boolean = $state(false);

	let graphData: EntitlementGraphResponse | null = $state(null);

	const {
		user,
		entitlementId,
		mode
	}: {
		user?: User;
		entitlementId?: string;
		mode: 'user' | 'entitlement';
		onDelete?: (id: number) => void;
	} = $props();

	onMount(async () => {
		console.log('EntitlementDialog component mounted');

		entitlementsCatalog = await GetEntitlementsCatalog();
		entitlementKinds = [...new Set(entitlementsCatalog.map((e) => e.kind))];
		await refreshGraph();
	});

	export async function refreshGraph() {
		graphData = null;
		if (mode === 'user') graphData = await GetEntitlementGraph(user?.id + '');
		else if (mode === 'entitlement')
			graphData = await GetEntitlementGraphForEntitlement(entitlementId + '');
	}

	function handleKindClick(event: Event) {
		const target = event.target as HTMLInputElement;
		const selectedKind = target.value;
		console.log('Selected entitlement kind:', selectedKind);

		availableEntitlementOptions = entitlementsCatalog.filter((e) => e.kind === selectedKind);
	}

	async function addEntitlement() {
		if (selectedEntitlementId) {
			isLoading = true;

			if (mode === 'user') await GrantEntitlement(user?.id + '', selectedEntitlementId);
			else if (mode === 'entitlement')
				await AddEntitlementEdge(entitlementId + '', selectedEntitlementId);
			await refreshGraph();
			isLoading = false;
		}
	}

	async function removeEntitlement() {
		if (selectedEntitlementId) {
			isLoading = true;
			if (mode === 'user') await RevokeEntitlement(user?.id + '', selectedEntitlementId);
			else if (mode === 'entitlement')
				await RemoveEntitlementEdge(entitlementId + '', selectedEntitlementId);
			await refreshGraph();
			isLoading = false;
		}
	}

	export function toggleVisibility() {
		isVisible = !isVisible;
	}
</script>

{#if isVisible}
	<section class="dialog-entitlement">
		<button onclick={() => toggleVisibility()} class="background" aria-label="Close dialog"
		></button>
		<dialog class="dialog" transition:fade={{ duration: 200 }} open>
			{#if mode === 'user' && user}
				<h2>Manage Entitlements for {user?.display_name} ({user.id})</h2>
			{:else if mode === 'entitlement' && entitlementId}
				<h2>Manage Entitlement {entitlementId}</h2>
			{/if}
			<hr />
			<Radio
				options={entitlementKinds.map((kind) => ({ label: kind, value: kind }))}
				onclick={handleKindClick}
			/>
			{#if availableEntitlementOptions.length > 0}
				<Select
					options={availableEntitlementOptions.map((entitlement) => ({
						value: entitlement.id,
						label: entitlement.name
					}))}
					bind:value={selectedEntitlementId}
					name="entitlement"
					placeholder="Select an entitlement..."
					searchPlaceholder="Search entitlements..."
				/>
			{/if}
			<nav>
				{#if !isLoading}
					{#if $can('admin.entitlements.grant')}
						<Button
							disabled={selectedEntitlementId === null ||
								isLoading ||
								graphData?.links.some(
									(e) => (mode === 'user' && user && e.source === `user:${user.id}` && e.target === selectedEntitlementId)
									|| (mode === 'entitlement' && entitlementId && e.source === `${entitlementId}` && e.target === selectedEntitlementId)
								)}
							onclick={addEntitlement}
						>
							{#snippet icon()}
								<Plus weight="regular" />
							{/snippet}
							Add Entitlement
						</Button>
					{/if}
					{#if $can('admin.entitlements.revoke')}
						<Button
							disabled={selectedEntitlementId === null ||
								isLoading ||
								!graphData?.links.some(
									(e) => (mode === 'user' && user && e.source === `user:${user.id}` && e.target === selectedEntitlementId)
									|| (mode === 'entitlement' && entitlementId && e.source === `${entitlementId}` && e.target === selectedEntitlementId)
								)}
							onclick={removeEntitlement}
						>
							{#snippet icon()}
								<Minus weight="regular" />
							{/snippet}
							Remove Entitlement
						</Button>
					{/if}
				{:else}
					<LoadingIndicator size={12} />
				{/if}
			</nav>
			{#if graphData}
				<EntitlementGraph data={graphData} />
			{/if}
		</dialog>
	</section>
{/if}

<style lang="scss">
	section.dialog-entitlement {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;

		button.background {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
			z-index: 1000;
			border: none;
		}

		dialog.dialog {
			position: fixed;
			top: 50%;
			transform: translateY(-50%);
			z-index: 1001;

			width: 75%;
			height: 75%;

			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			text-align: center;
			background-color: #0a0a0a;
			color: white;
			border: none;
			border-radius: 10px;

			padding: 10px;
			gap: 10px;

			.radios {
				text-align: left;
			}

			h2 {
				margin: 0;
				font-size: 1.5rem;
			}

			hr {
				border: none;
				border-top: 1px solid #333;
				width: 100%;
			}
		}
	}
</style>
